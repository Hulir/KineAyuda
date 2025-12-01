import uuid
from django.shortcuts import render
from datetime import timedelta
from django.conf import settings
from django.utils import timezone
from django.db import transaction
from django.db.models import Q, Count, Case, When, FloatField, Avg
from django.db.models.functions import TruncDay, TruncWeek, TruncMonth
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import redirect, get_object_or_404
from rest_framework import viewsets, status, mixins
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.core.mail import send_mail
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.parsers import MultiPartParser, FormParser
from .models import kinesiologo, paciente, cita, reseña, agenda, metodoPago, pagoSuscripcion, documentoVerificacion, pagoCita
from firebase_admin import auth
from .serializer import (kinesiologoSerializer, pacienteSerializer, citaSerializer, reseñaSerializer, agendaSerializer, metodoPagoSerializer, 
                         documentoVerificacionSerializer, kinesiologoFotoSerializer, KinesiologoRegistroSerializer, CitaPublicaSerializer, ReseñaPublicaSerializer)
from .utils.auth_helpers import get_kinesiologo_from_request, kinesio_tiene_suscripcion_activa
from .utils.rut import normalizar_rut
from .payments.webpay import create_transaction, commit_transaction
from .permissions import TieneSuscripcionActiva, EsKinesiologoVerificado
from dateutil.relativedelta import relativedelta
from .modulo_ia import analizar_sentimiento

# Create your views here.

class kinesiologoViewSet(viewsets.ModelViewSet):
    serializer_class = kinesiologoSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        #Devuelve solo el perfil del kine logeado
        kx = get_kinesiologo_from_request(self.request)
        if not kx:
            #Si aun no tiene perfil, no ve nada en el listado
            return kinesiologo.objects.none()
        #Solo puede ver su propio perfil
        return kinesiologo.objects.filter(id=kx.id)
    
    def perform_create(self, serializer):
        uid = self.request.user.uid #UID de Firebase del kinesiologo autenticado
        #Asocia el firebase_ide al crear el kinesiologo
        serializer.save(firebase_ide=uid)
    
    def perform_update(self, serializer):
        uid = self.request.user.uid
        #Asegura que el firebase_ide no cambie a otro valor
        serializer.save(firebase_ide=uid)
    
    @action(detail=False, methods=['patch'], url_path='foto', parser_classes=[MultiPartParser, FormParser])
    def foto(self, request):
        kx = get_kinesiologo_from_request(request)
        if not kx:
            return Response({'error': 'Kinesiologo no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        ser = kinesiologoFotoSerializer(kx, data=request.data, partial=True)
        ser.is_valid(raise_exception=True)
        ser.save()
        return Response(ser.data, status=status.HTTP_200_OK)

    @action(
        detail=False,
        methods=['post'],
        url_path='registro',
        parser_classes=[MultiPartParser, FormParser],
        permission_classes=[AllowAny],
    )
    def registro(self, request):

        from core.utils.auth_helpers import get_kinesiologo_from_request

        # Evitar duplicados
        if get_kinesiologo_from_request(request):
            return Response({"error": "Ya tienes un perfil creado."}, status=400)

        ser = KinesiologoRegistroSerializer(data=request.data, context={'request': request})
        ser.is_valid(raise_exception=True)
        kx = ser.save()
        return Response(
            {"mensaje": "Registro enviado a verificación", "kinesiologo_id": kx.id},
            status=status.HTTP_201_CREATED,
        )
    @action(
        detail=False,
        methods=['get'],
        url_path='metricas-resenas',
        permission_classes=[IsAuthenticated],
    )
    def metricas_resenas(self, request):
        """
        GET /api/kinesiologos/metricas-resenas/?granularidad=mes&desde=2025-01-01&hasta=2025-12-31

        granularidad: 'dia' | 'semana' | 'mes' (por defecto: 'mes')
        desde / hasta: YYYY-MM-DD (opcionales)
        """
        kx = get_kinesiologo_from_request(request)
        if not kx:
            return Response({"detail": "Kinesiólogo no encontrado."}, status=status.HTTP_404_NOT_FOUND)

        granularidad = request.query_params.get('granularidad', 'mes')
        fecha_desde = request.query_params.get('desde')
        fecha_hasta = request.query_params.get('hasta')

        # Base: todas las reseñas de este kinesiólogo
        qs = reseña.objects.filter(cita__kinesiologo=kx)

        # Filtrar por rango de fechas (según fecha de la cita)
        if fecha_desde:
            qs = qs.filter(cita__fecha_hora__date__gte=fecha_desde)
        if fecha_hasta:
            qs = qs.filter(cita__fecha_hora__date__lte=fecha_hasta)

        # Elegir cómo agrupar (día, semana o mes)
        if granularidad == 'dia':
            qs = qs.annotate(periodo=TruncDay('cita__fecha_hora'))
        elif granularidad == 'semana':
            qs = qs.annotate(periodo=TruncWeek('cita__fecha_hora'))
        else:  # 'mes' por defecto
            qs = qs.annotate(periodo=TruncMonth('cita__fecha_hora'))

        # Score de satisfacción: positiva = +1, neutral = 0, negativa = -1
        qs = qs.annotate(
            score_val=Case(
                When(sentimiento='positiva', then=1.0),
                When(sentimiento='neutral', then=0.0),
                When(sentimiento='negativa', then=-1.0),
                output_field=FloatField(),
            )
        )

        # Agregación por período
        agg = (
            qs.values('periodo')
              .annotate(
                  total=Count('id'),
                  positivas=Count('id', filter=Q(sentimiento='positiva')),
                  neutrales=Count('id', filter=Q(sentimiento='neutral')),
                  negativas=Count('id', filter=Q(sentimiento='negativa')),
                  score_promedio=Avg('score_val'),
              )
              .order_by('periodo')
        )

        # Resumen global
        total = qs.count()
        positivas_total = qs.filter(sentimiento='positiva').count()
        neutrales_total = qs.filter(sentimiento='neutral').count()
        negativas_total = qs.filter(sentimiento='negativa').count()

        resumen = {
            "total_reseñas": total,
            "positivas": positivas_total,
            "neutrales": neutrales_total,
            "negativas": negativas_total,
        }

        # Serializar fechas a string (ISO) para que el front pinte fácil
        series = [
            {
                "periodo": item["periodo"].date().isoformat() if granularidad == "dia" else item["periodo"].isoformat(),
                "total": item["total"],
                "positivas": item["positivas"],
                "neutrales": item["neutrales"],
                "negativas": item["negativas"],
                "score_promedio": item["score_promedio"],
            }
            for item in agg
        ]

        return Response(
            {
                "granularidad": granularidad,
                "resumen": resumen,
                "series": series,
            },
            status=200,
        )

class pacienteViewSet(viewsets.ModelViewSet):
    queryset = paciente.objects.all()
    serializer_class = pacienteSerializer

class citaViewSet(viewsets.ModelViewSet):
    serializer_class = citaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        kx = get_kinesiologo_from_request(self.request)
        if not kx:
            return cita.objects.none()
        #Devuelve solo las citas del kinesiologo autenticado
        return cita.objects.filter(kinesiologo=kx).select_related('paciente', 'kinesiologo')
    
    def perform_create(self, serializer):
        kx = get_kinesiologo_from_request(self.request)
        if not kx:
            raise PermissionError("Kinesiologo no autenticado.")
        #Asocia la cita al kinesiologo autenticado
        serializer.save(kinesiologo=kx)

class reseñaViewSet(viewsets.ModelViewSet):
    serializer_class = reseñaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        kx = get_kinesiologo_from_request(self.request)
        if not kx:
            return reseña.objects.none()
        #Devuelve solo las reseñas de las citas del kinesiologo autenticado
        return reseña.objects.filter(cita__kinesiologo=kx).select_related('cita', 'cita__paciente')

class CrearReseñaPorCitaView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request, cita_id):
        cita_obj = get_object_or_404(cita, id=cita_id)
        serializer = ReseñaPublicaSerializer(data=request.data, context={"cita": cita_obj})
        serializer.is_valid(raise_exception=True)
        reseña_obj = serializer.save() 

        return Response({
            "mensaje": "Reseña creada exitosamente.",
            "reseña_id": reseña_obj.id,
            "sentimiento": reseña_obj.sentimiento,
        },
        status=status.HTTP_201_CREATED)

class KinesiologosPublicosView(ListAPIView):
    """Vista pública para listar todos los kinesiologos aprobados con filtros avanzados."""
    serializer_class = kinesiologoSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qset = kinesiologo.objects.filter(estado_verificacion='aprobado')
        
        # Filtro por especialidad
        especialidad = self.request.query_params.get('especialidad')
        if especialidad:
            qset = qset.filter(especialidad__iexact=especialidad)
        
        # Filtro por rango de precios
        precio_min = self.request.query_params.get('precio_min')
        precio_max = self.request.query_params.get('precio_max')
        if precio_min:
            qset = qset.filter(precio_consulta__gte=precio_min)
        if precio_max:
            qset = qset.filter(precio_consulta__lte=precio_max)
        
        # Filtro por modalidades
        atiende_domicilio = self.request.query_params.get('atiende_domicilio')
        atiende_consulta = self.request.query_params.get('atiende_consulta')
        
        if atiende_domicilio is not None and atiende_domicilio.lower() == 'true':
            qset = qset.filter(atiende_domicilio=True)
        if atiende_consulta is not None and atiende_consulta.lower() == 'true':
            qset = qset.filter(atiende_consulta=True)
        
        # Filtro por ubicación
        comuna = self.request.query_params.get('comuna')
        region = self.request.query_params.get('region')
        if comuna:
            qset = qset.filter(comuna__icontains=comuna)
        if region:
            qset = qset.filter(region__icontains=region)
        
        # Ordenamiento
        ordering = self.request.query_params.get('ordering', 'apellido')
        if ordering in ['precio_consulta', 'apellido', '-precio_consulta', '-apellido']:
            qset = qset.order_by(ordering)
        
        return qset
    
    def list(self, request, *args, **kwargs):
        """Sobrescribimos list para agregar endpoint de estadísticas"""
        # Si es request de estadísticas
        if request.path.endswith('/estadisticas/'):
            return self.get_estadisticas(request)
        
        return super().list(request, *args, **kwargs)
    
    def get_estadisticas(self, request):
        """Retorna estadísticas para poblar los filtros"""
        from django.db.models import Min, Max, Count, Q
        
        qset = kinesiologo.objects.filter(estado_verificacion='aprobado')
        
        # Especialidades únicas
        especialidades = list(qset.values_list('especialidad', flat=True).distinct())
        
        # Comunas únicas (excluyendo nulls)
        comunas = list(qset.exclude(comuna__isnull=True).exclude(comuna='').values_list('comuna', flat=True).distinct())
        
        # Regiones únicas
        regiones = list(qset.exclude(region__isnull=True).exclude(region='').values_list('region', flat=True).distinct())
        
        # Rango de precios
        precio_rango = qset.aggregate(
            min=Min('precio_consulta'),
            max=Max('precio_consulta')
        )
        
        # Contador de modalidades
        modalidades = {
            'domicilio': qset.filter(atiende_domicilio=True).count(),
            'consulta': qset.filter(atiende_consulta=True).count(),
        }
        
        data = {
            'especialidades': especialidades,
            'comunas': comunas,
            'regiones': regiones,
            'precioRango': {
                'min': precio_rango['min'] or 0,
                'max': precio_rango['max'] or 100000,
            },
            'modalidades': modalidades
        }
        
        return Response(data, status=status.HTTP_200_OK)

class ReseñasPublicasView(ListAPIView):
    """Vista pública para listar todas las reseñas."""
    permission_classes = [AllowAny]

    def get(self, request, kinesiologo_id):
        qset = reseña.objects.filter(cita__kinesiologo_id=kinesiologo_id)
        data = reseñaSerializer(qset, many=True).data
        return Response(data, status=status.HTTP_200_OK)

class HorasDisponiblesView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, kinesiologo_id):
        """Devuelve las horas disponibles para reserva de un kinesiologo específico."""
        ahora = timezone.now()
        slots = agenda.objects.filter(kinesiologo_id=kinesiologo_id, estado='disponible', inicio__gte=ahora).order_by('inicio')
        data = [{
            'id': slot.id,
            'fecha': slot.inicio.date().isoformat(),  # Formato: 2025-11-24
            'hora_inicio': slot.inicio.time().isoformat()[:5],  # Formato: 14:00
            'hora_fin': slot.fin.time().isoformat()[:5],  # Formato: 15:00
            'inicio': slot.inicio.isoformat(),  # Formato completo ISO
            'fin': slot.fin.isoformat()  # Formato completo ISO
        } for slot in slots]
        return Response(data, status=status.HTTP_200_OK)

class AgendaViewSet(viewsets.ModelViewSet):
    serializer_class = agendaSerializer
    permission_classes = [IsAuthenticated]  # base

    def get_permissions(self):
        """
        Lectura (list/retrieve): solo autenticación.
        Mutaciones (create/update/partial_update/destroy): requiere suscripción activa.
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), EsKinesiologoVerificado(),TieneSuscripcionActiva()]
        return [IsAuthenticated(), EsKinesiologoVerificado()]

    def get_queryset(self):
        kx = get_kinesiologo_from_request(self.request)
        if not kx:
            return agenda.objects.none()
        # solo horarios del kinesiólogo autenticado
        return agenda.objects.filter(kinesiologo=kx).order_by('inicio')

    def perform_create(self, serializer):
        kx = get_kinesiologo_from_request(self.request)
        if not kx:
            raise PermissionDenied("Kinesiólogo no autenticado.")

        # Defensa en profundidad: aunque ya pasó el permiso, revalida suscripción
        if not kinesio_tiene_suscripcion_activa(kx):
            raise PermissionDenied("Necesitas una suscripción activa para publicar disponibilidad.")

        inicio = serializer.validated_data['inicio']
        fin = serializer.validated_data['fin']

        # Validar solapamiento
        solapa = agenda.objects.filter(
            kinesiologo=kx,
            estado__in=['disponible', 'reservado', 'no_disponible'],
        ).filter(
            Q(inicio__lt=fin) & Q(fin__gt=inicio)
        ).exists()

        if solapa:
            raise ValidationError("El horario solapa con otro existente.")

        serializer.save(kinesiologo=kx, estado='disponible')

    def perform_destroy(self, instance):
        if instance.estado == 'reservado':
            raise ValidationError("No se puede eliminar un horario reservado. Cancele la cita primero.")
        instance.delete()

class AgendarCitaView(APIView):
    permission_classes = [AllowAny]
    
    @transaction.atomic
    def post(self, request):
        """Permite a un paciente agendar una cita en un horario disponible."""
        #validar que existe el cupo
        slot_id = request.data.get('id')
        if not slot_id:
            return Response({'error': 'slot_id es requerido.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            slot = agenda.objects.select_for_update().get(id=slot_id)
        except agenda.DoesNotExist:
            return Response({'error': 'Cupo no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        
        #Validar que el cupo esta disponible
        if slot.estado != 'disponible' or slot.inicio < timezone.now():
            return Response({'error': 'Cupo no disponible para reserva.'}, status=status.HTTP_400_BAD_REQUEST)
        
        #Crear o reutilizar paciente según el RUT
        rut = request.data.get('rut')
        paciente_obj = paciente.objects.filter(rut__iexact=rut).first()
        if not paciente_obj:
            paciente_serializer = pacienteSerializer(data=request.data)
            paciente_serializer.is_valid(raise_exception=True)
            paciente_obj = paciente_serializer.save()
        
        #Crear la cita asociada al cupo
        nueva_cita = cita.objects.create(
            paciente=paciente_obj,
            kinesiologo=slot.kinesiologo,
            fecha_hora=slot.inicio,
            estado='pendiente',
            nota=""
        )

        #Marcar el cupo como reservado
        slot.estado = 'reservado'
        slot.paciente = paciente_obj
        slot.cita = nueva_cita
        slot.save()

        return Response({'mensaje': 'Cita agendada exitosamente.', 'cita': citaSerializer(nueva_cita).data}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([AllowAny])
def verificar_firebase_token(request):
    #Verifica el token de Firebase enviado en la solicitud y devuelve la información del usuario si es válido.
    token = request.data.get('token')
    if not token:
        return Response({'error': 'Token no proporcionado.'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        decoded = auth.verify_id_token(token)
        return Response({'uid': decoded['uid'], 
                         'email': decoded.get('email')}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    kx = get_kinesiologo_from_request(request)
    if not kx:
        return Response({'detail': 'Kinesiologo no encontrado. ¿Ya registraste tu cuenta?'}, status=404)
    return Response(kinesiologoSerializer(kx).data)

@api_view(['GET'])
@permission_classes([AllowAny])
def lista_metodos_pago(request):
    qs = metodoPago.objects.filter(activo=True)
    return Response(metodoPagoSerializer(qs, many=True).data, status=200)

''' 
@api_view(['POST'])
@permission_classes([AllowAny])  # proveedor no manda token
def webhook_pago(request, proveedor: str):
    data = request.data
    orden = data.get('orden_comercio')
    estado = data.get('estado')
    transa_id = data.get('transa_id_externo')

    if not orden:
        return Response({"error": "orden_comercio requerido"}, status=400)

    try:
        pago = pagoSuscripcion.objects.get(orden_comercio=orden)
    except pagoSuscripcion.DoesNotExist:
        return Response({"error": "Orden no encontrada"}, status=404)

    pago.raw_payload = data
    pago.transa_id_externo = transa_id

    if estado == 'pagado':
        pago.estado = 'pagado'
        pago.fecha_expiracion = timezone.now() + timedelta(days=30)
    elif estado in ['pendiente', 'fallido', 'expirado']:
        pago.estado = estado
    else:
        pago.estado = 'fallido'

    pago.save()
    return Response({"mensaje": "actualizado correctamente"}, status=200)
'''


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def estado_suscripcion(request):
    kx = get_kinesiologo_from_request(request)
    if not kx:
        return Response({"error": "Perfil no encontrado"}, status=404)

    ultimo_pago = pagoSuscripcion.objects.filter(kinesiologo=kx).order_by('-fecha_pago').first()

    activa = kinesio_tiene_suscripcion_activa(kx)
    vence = ultimo_pago.fecha_expiracion if ultimo_pago else None

    return Response({
        "activa": activa,
        "vence": vence,
    }, status=200)

#1 INICIAR SUSCRIPCION
@api_view(['POST'])
@permission_classes([IsAuthenticated, EsKinesiologoVerificado])
def webpay_iniciar_suscripcion(request):
    """
    Body:
    { "monto": 4990 }
    """
    kx = get_kinesiologo_from_request(request)
    if not kx:
        return Response({"error": "Perfil de kinesiólogo no encontrado"}, status=404)

    monto = request.data.get("monto")
    if not monto:
        return Response({"error": "El campo 'monto' es requerido"}, status=400)

    # Aseguramos que exista el método 'transbank'
    mp, _ = metodoPago.objects.get_or_create(nombre='Transbank', codigo_interno='transbank', defaults={'activo': True})

    # Orden interna única
    buy_order = str(uuid.uuid4())[:12]
    session_id = str(kx.id)

    # Creamos el registro interno en 'pendiente'
    pago = pagoSuscripcion.objects.create(
        kinesiologo=kx,
        metodo=mp,
        monto=monto,
        estado='pendiente',
        orden_comercio=buy_order,
        fecha_creacion=timezone.now()
    )

    # URL de retorno que Transbank llamará al finalizar (POST con token_ws o TBK_TOKEN)
    return_url = f"{settings.BACKEND_BASE_URL}/api/pagos/webpay/retorno/"

    # Llamamos a Webpay (Sandbox)
    resp = create_transaction(buy_order=buy_order, session_id=session_id, amount=float(monto), return_url=return_url)
    token = resp.get("token")
    init_url = resp.get("url")

    # Guardamos temporalmente el token como referencia externa (opcional)
    pago.transa_id_externo = token
    pago.save()

    # El front DEBE redirigir al usuario a Webpay enviando token por POST (form auto-submit)
    # Para el front: mostrar 'init_url' y 'token' y construir un formulario POST a init_url con 'token_ws'
    return Response({
        "mensaje": "Transacción creada",
        "orden_comercio": buy_order,
        "url": init_url,
        "token": token,
        "nota": "Construir un form POST a 'url' con input hidden 'token_ws=token'."
    }, status=201)

# 2) RETORNO DESDE WEBPAY (CONFIRMA/RECHAZA LA TRANSACCIÓN)
@csrf_exempt
@api_view(['POST', 'GET'])
@permission_classes([AllowAny])  # Webpay nos llamará sin token
def webpay_retorno(request):
    """
    Webpay redirige al browser del cliente a esta URL:
      - Si éxito/continuación: POST con 'token_ws'
      - Si abandono/cancelación: GET/POST con 'TBK_TOKEN' (sin 'token_ws')
    Aquí haremos commit del pago y actualizaremos 'pagoSuscripcion'.
    """
    # Caso abandono/cancelación
    tbk_token = request.POST.get("TBK_TOKEN") or request.GET.get("TBK_TOKEN")
    if tbk_token:
        # Marcar último pago 'pendiente' de esa orden como fallido (si tienes la orden, úsala)
        # Sin orden, buscamos por token externo = tbk_token o por el último pendiente
        pago = pagoSuscripcion.objects.filter(estado='pendiente').order_by('-fecha_pago').first()
        if pago:
            pago.estado = 'fallido'
            pago.save()
        return Response({"estado": "fallido", "detalle": "Pago cancelado por el usuario"}, status=200)

    # Caso normal: token_ws presente
    token_ws = request.POST.get("token_ws") or request.GET.get("token_ws")
    if not token_ws:
        return Response({"error": "token_ws o TBK_TOKEN no presentes"}, status=400)

    # Confirmar la transacción con Transbank (commit)
    commit = commit_transaction(token_ws)
    # commit incluye: buy_order, session_id, amount, authorization_code, response_code, status, etc.
    buy_order = commit.get("buy_order")
    response_code = commit.get("response_code")  # 0 = aprobado

    try:
        pago = pagoSuscripcion.objects.get(orden_comercio=buy_order)
    except pagoSuscripcion.DoesNotExist:
        return Response({"error": "Orden no encontrada"}, status=404)

    # Guardamos payload bruto (útil para auditoría)
    pago.raw_payload = commit
    pago.transa_id_externo = token_ws

    if response_code == 0:
        pago.estado = 'pagado'
        pago.fecha_expiracion = timezone.now() + relativedelta(months=1)
    else:
        pago.estado = 'fallido'

    pago.save()

    # Redirigir al frontend para mostrar pantalla de éxito/fracaso
    from django.shortcuts import redirect
    frontend_url = f"{settings.FRONTEND_BASE_URL.rstrip('/')}/pago-exitoso?orden={buy_order}&estado={pago.estado}"
    if pago.fecha_expiracion:
        frontend_url += f"&expiracion={pago.fecha_expiracion.isoformat()}"
    return redirect(frontend_url)

class DocumentoVerificacionViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = documentoVerificacionSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        kx = get_kinesiologo_from_request(self.request)
        if not kx:
            return documentoVerificacion.objects.none()
        return documentoVerificacion.objects.filter(kinesiologo=kx).order_by('-fecha_subida')
    
    def perform_create(self, serializer):
        kx = get_kinesiologo_from_request(self.request)
        if not kx:
            raise PermissionDenied("Kinesiólogo no autenticado.")
        serializer.save(kinesiologo=kx)

class KinesiologoRegistroView(APIView):
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        if get_kinesiologo_from_request(request):
            return Response({"error": "Ya tienes un perfil registrado."}, status=400)
        
        serializer = KinesiologoRegistroSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        kx = serializer.save()
        return Response(
            {"mensaje": "Registro enviado a verificación", "kinesiologo_id": kx.id},
            status=201
        )

@api_view(['POST'])
@permission_classes([AllowAny])
def webpay_iniciar_pago_cita(request):
    data = request.data
    agenda_id = data.get('agenda_id')
    monto = data.get('monto')

    if not agenda_id or not monto:
        return Response({"error": "agenda_id y monto son obligatorios."}, status=400)

    try:
        monto = float(monto)
    except ValueError:
        return Response({"error": "Monto inválido."}, status=400)

    # 1) Obtener el slot de agenda y validar disponibilidad
    slot = get_object_or_404(agenda, id=agenda_id)

    if slot.estado != 'disponible':
        return Response({"error": "El horario ya no está disponible."}, status=400)

    if slot.inicio <= timezone.now():
        return Response({"error": "No se puede agendar un horario pasado."}, status=400)

    kx = slot.kinesiologo

    # 2) Crear (o reutilizar) paciente priorizando RUT para evitar duplicados
    email = data.get('email')
    if not email:
        return Response({"error": "El email del paciente es obligatorio."}, status=400)

    rut_raw = data.get("rut")
    if not rut_raw:
        return Response({"error": "El RUT del paciente es obligatorio."}, status=400)
    try:
        rut = normalizar_rut(rut_raw)
    except Exception as e:
        return Response({"error": f"RUT inválido: {str(e)}"}, status=400)

    paciente_obj = paciente.objects.filter(rut__iexact=rut).first()
    if paciente_obj:
        updated = False
        if email and paciente_obj.email != email:
            paciente_obj.email = email
            updated = True
        for campo in ["nombre", "apellido", "telefono", "fecha_nacimiento"]:
            incoming = data.get(campo)
            if incoming and not getattr(paciente_obj, campo):
                setattr(paciente_obj, campo, incoming)
                updated = True
        if updated:
            paciente_obj.save()
    else:
        paciente_obj = paciente.objects.create(
            email=email,
            nombre=data.get("nombre", ""),
            apellido=data.get("apellido", ""),
            telefono=data.get("telefono", ""),
            fecha_nacimiento=data.get("fecha_nacimiento", "2000-01-01"),
            rut=rut,
        )

    # 3) Crear cita en estado pendiente / no pagada aún
    nueva_cita = cita.objects.create(
        paciente=paciente_obj,
        kinesiologo=kx,
        fecha_hora=slot.inicio,
        estado='pendiente',
        estado_pago='pendiente',
    )

    # 4) Crear pagoCita pendiente
    pago = pagoCita.objects.create(
        cita=nueva_cita,
        kinesiologo=kx,
        paciente=paciente_obj,
        monto=monto,
        estado='pendiente',
    )

    # 5) Generar buy_order y session_id
    buy_order = f"CITA-{pago.id}"
    session_id = f"PAC-{paciente_obj.id}"

    pago.buy_order = buy_order
    pago.session_id = session_id
    pago.save()

    # 6) Llamar a Webpay
    return_url = f"{settings.BACKEND_BASE_URL.rstrip('/')}/api/pagos/citas/webpay/retorno/"
    resp = create_transaction(
        buy_order=buy_order,
        session_id=session_id,
        amount=monto,
        return_url=return_url
    )

    # resp tiene .token y .url (según SDK)
    token = getattr(resp, 'token', None) or resp.get('token')
    url = getattr(resp, 'url', None) or resp.get('url')

    if not token or not url:
        return Response({"error": "Error al iniciar transacción con Webpay."}, status=500)

    pago.token_ws = token
    pago.save()

    return Response({
        "url": url,
        "token": token,
        "cita_id": nueva_cita.id
    }, status=200)

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def webpay_retorno_pago_cita(request):
    """
    Webpay redirige aquí con token_ws.
    Confirma el pago y actualiza cita + agenda.
    """
    token_ws = request.GET.get('token_ws') or request.POST.get('token_ws')
    if not token_ws:
        return Response({"error": "Falta token_ws."}, status=400)

    # 1) Confirmar con Webpay
    resp = commit_transaction(token_ws)

    # Dependiendo del SDK, resp puede ser objeto o dict
    status_tx = getattr(resp, 'status', None) or resp.get('status')
    buy_order = getattr(resp, 'buy_order', None) or resp.get('buy_order')
    response_code = getattr(resp, 'response_code', None) or resp.get('response_code')

    # 2) Buscar pagoCita por buy_order
    try:
        pago = pagoCita.objects.select_related('cita', 'cita__kinesiologo').get(buy_order=buy_order)
    except pagoCita.DoesNotExist:
        return Response({"error": "Pago no encontrado."}, status=404)

    pago.raw_payload = getattr(resp, 'json', None) if hasattr(resp, 'json') else None
    pago.token_ws = token_ws

    cita_obj = pago.cita
    slot_qs = agenda.objects.filter(
        kinesiologo=cita_obj.kinesiologo,
        inicio=cita_obj.fecha_hora
    )

    # 3) Evaluar resultado
    if status_tx == "AUTHORIZED" and response_code == 0:
        pago.estado = 'pagado'
        pago.fecha_pago = timezone.now()

        cita_obj.estado_pago = 'pagado'
        cita_obj.estado = 'pendiente'  # o 'confirmada' si agregas ese estado
        cita_obj.save()

        # marcar slot como reservado
        slot = slot_qs.first()
        slot.estado = 'reservado'
        slot.cita = cita_obj
        slot.paciente = pago.paciente
        slot.save()

        pago.save()

        # Enviar correo de confirmación al paciente
        try:
            kx = cita_obj.kinesiologo
            paciente_obj = pago.paciente
            fecha_local = cita_obj.fecha_hora.astimezone(timezone.get_current_timezone())
            fecha_str = fecha_local.strftime("%d-%m-%Y %H:%M")
            direccion = kx.direccion_consulta or "La dirección será coordinada con el profesional."
            subject = "Confirmación de cita - KineAyuda"
            body = (
                f"Hola {paciente_obj.nombre} {paciente_obj.apellido},\n\n"
                f"Tu pago ha sido recibido y tu cita quedó agendada.\n\n"
                f"Profesional: {kx.nombre} {kx.apellido} ({kx.especialidad})\n"
                f"Fecha y hora: {fecha_str}\n"
                f"Dirección: {direccion}\n\n"
                f"Gracias por confiar en KineAyuda."
            )
            if paciente_obj.email:
                send_mail(subject, body, settings.DEFAULT_FROM_EMAIL, [paciente_obj.email], fail_silently=True)
        except Exception as e:
            print(f"[EMAIL] Error al enviar confirmación de cita: {e}")

        # Redirigir al frontend para mostrar confirmación de cita
        from django.shortcuts import redirect
        frontend_url = f"{settings.FRONTEND_BASE_URL.rstrip('/')}/pago-cita-exitoso?orden={buy_order}&estado={pago.estado}"
        return redirect(frontend_url)

    else:
        pago.estado = 'fallido'
        cita_obj.estado_pago = 'fallido'
        cita_obj.estado = 'cancelada'
        cita_obj.save()
        slot_qs.update(estado='disponible')
        pago.save()

        return Response({
            "mensaje": "Pago rechazado o fallido.",
            "detalle": status_tx,
            "codigo_respuesta": response_code
        }, status=400)

class CitasPorRutView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, rut):
        """Devuelve las citas asociadas a un paciente identificado por su RUT."""
        try:
            rut_norm = normalizar_rut(rut)
        except Exception as e:
            return Response({"error": f"RUT inválido: {str(e)}"}, status=400)
        
        try:
            paciente_obj = paciente.objects.get(rut=rut_norm)
        except paciente.DoesNotExist:
            return Response({"error": "Paciente no encontrado."}, status=404)
        
        #Traer citas del paciente
        citas = cita.objects.filter(paciente=paciente_obj).order_by('-fecha_hora')
        data = CitaPublicaSerializer(citas, many=True).data
        return Response({"paciente": paciente_obj.nombre, "citas": data})

# Endpoint para consultar una cita pública (sin autenticación)
@api_view(['GET'])
@permission_classes([AllowAny])
def consultar_cita_publica(request, cita_id):
    """Permite consultar los detalles de una cita de forma pública"""
    try:
        cita_obj = cita.objects.select_related('kinesiologo', 'paciente').get(id=cita_id)
        
        # Verificar si puede dejar reseña
        puede_resenar = (
            cita_obj.estado == 'completada' and 
            not reseña.objects.filter(cita=cita_obj).exists()
        )
        
        return Response({
            'id': cita_obj.id,
            'fecha_hora': cita_obj.fecha_hora,
            'estado': cita_obj.estado,
            'kinesiologo': {
                'nombre': f"{cita_obj.kinesiologo.nombre} {cita_obj.kinesiologo.apellido}",
                'especialidad': cita_obj.kinesiologo.especialidad,
                'foto_url': cita_obj.kinesiologo.foto_perfil.url if cita_obj.kinesiologo.foto_perfil else None
            },
            'paciente': {
                'nombre': f"{cita_obj.paciente.nombre} {cita_obj.paciente.apellido}"
            },
            'puede_resenar': puede_resenar
        })
    except cita.DoesNotExist:
        return Response({'error': 'Cita no encontrada'}, status=404)


# ============================================
# ENDPOINTS FASE 1: VALIDACIÓN IA Y ESTADÍSTICAS
# ============================================

@api_view(['POST'])
@permission_classes([AllowAny])
def validar_sentimiento_resena(request):
    """
    Valida si el sentimiento del comentario coincide con la calificación de estrellas.
    Retorna alerta si hay discrepancia (ej: 5⭐ + comentario negativo)
    """
    comentario = request.data.get('comentario', '').strip()
    calificacion = request.data.get('calificacion')
    
    if not comentario or not calificacion:
        return Response({
            'error': 'Se requiere comentario y calificacion'
        }, status=400)
    
    try:
        calificacion = int(calificacion)
        if calificacion < 1 or calificacion > 5:
            return Response({
                'error': 'Calificación debe estar entre 1 y 5'
            }, status=400)
    except (ValueError, TypeError):
        return Response({
            'error': 'Calificación inválida'
        }, status=400)
    
    # Analizar sentimiento del comentario con IA
    sentimiento = analizar_sentimiento(comentario)
    
    # Determinar si hay coincidencia
    coincide = True
    sugerencia = ""
    alerta_tipo = "info"
    
    if calificacion >= 4 and sentimiento == 'negativa':
        coincide = False
        alerta_tipo = "warning"
        sugerencia = f"Tu comentario parece negativo pero diste {calificacion} {'estrella' if calificacion == 1 else 'estrellas'}. ¿Deseas revisar tu calificación?"
    elif calificacion <= 2 and sentimiento == 'positiva':
        coincide = False
        alerta_tipo = "warning"
        sugerencia = f"Tu comentario parece positivo pero diste {calificacion} {'estrella' if calificacion == 1 else 'estrellas'}. ¿Tal vez quisiste dar más estrellas?"
    
    return Response({
        'coincide': coincide,
        'sentimiento_detectado': sentimiento,
        'sugerencia': sugerencia,
        'alerta_tipo': alerta_tipo,
        'calificacion_enviada': calificacion
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def estadisticas_resenas_kine(request):
    """
    Devuelve estadísticas de reseñas del kinesiólogo autenticado.
    Incluye: total, promedio, distribución por sentimiento, y discrepancias.
    """
    kine_id = request.user.uid  # UID de Firebase
    
    # Obtener kinesiólogo desde Firebase UID
    try:
        kine = kinesiologo.objects.get(firebase_ide=kine_id)
    except kinesiologo.DoesNotExist:
        return Response({
            'error': 'Kinesiólogo no encontrado'
        }, status=404)
    
    # Obtener todas las reseñas del kine
    resenas_kine = reseña.objects.filter(
        cita__kinesiologo_id=kine.id
    )
    
    total = resenas_kine.count()
    
    if total == 0:
        return Response({
            'total': 0,
            'promedio_calificacion': 0,
            'sentimientos': {
                'positiva': 0,
                'neutral': 0,
                'negativa': 0
            },
            'porcentajes': {
                'positiva': 0,
                'neutral': 0,
                'negativa': 0
            },
            'discrepancias': []
        })
    
    # Promedio de calificación
    promedio = resenas_kine.aggregate(Avg('calificacion'))['calificacion__avg']
    
    # Conteo por sentimiento
    sentimientos = resenas_kine.values('sentimiento').annotate(
        count=Count('id')
    )
    
    sent_dict = {'positiva': 0, 'neutral': 0, 'negativa': 0}
    for s in sentimientos:
        sent_key = s['sentimiento'] if s['sentimiento'] else 'neutral'
        sent_dict[sent_key] = s['count']
    
    # Calcular porcentajes
    porcentajes = {
        'positiva': round((sent_dict['positiva'] / total) * 100, 1),
        'neutral': round((sent_dict['neutral'] / total) * 100, 1),
        'negativa': round((sent_dict['negativa'] / total) * 100, 1)
    }
    
    # Detectar discrepancias (alta calificación con comentario negativo, o viceversa)
    discrepancias = resenas_kine.filter(
        Q(calificacion__gte=4, sentimiento='negativa') |
        Q(calificacion__lte=2, sentimiento='positiva')
    ).values('id', 'comentario', 'calificacion', 'sentimiento', 'fecha_creacion')[:5]  # Límite 5
    
    return Response({
        'total': total,
        'promedio_calificacion': round(promedio, 1) if promedio else 0,
        'sentimientos': sent_dict,
        'porcentajes': porcentajes,
        'discrepancias': list(discrepancias)
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def evolucion_resenas_kine(request):
    """
    Devuelve evolución temporal de sentimientos (últimos 12 meses).
    Para gráficos de tendencia en el dashboard del kinesiólogo.
    """
    from datetime import datetime,timedelta
    from dateutil.relativedelta import relativedelta
    
    kine_id = request.user.uid  # UID de Firebase
    
    # Obtener kinesiólogo desde Firebase UID
    try:
        kine = kinesiologo.objects.get(firebase_ide=kine_id)
    except kinesiologo.DoesNotExist:
        return Response({
            'error': 'Kinesiólogo no encontrado'
        }, status=404)
    
    # Obtener todas las reseñas del kine
    resenas_kine = reseña.objects.filter(
        cita__kinesiologo_id=kine.id
    )
    
    # Calcular fecha de hace 12 meses
    fecha_inicio = timezone.now() - relativedelta(months=12)
    
    # Filtrar últimos 12 meses
    resenas_recientes = resenas_kine.filter(
        fecha_creacion__gte=fecha_inicio
    )
    
    # Agrupar por mes y sentimiento
    meses_data = {}
    
    for i in range(12):
        mes_fecha = timezone.now() - relativedelta(months=i)
        mes_key = mes_fecha.strftime('%Y-%m')
        mes_label = mes_fecha.strftime('%b %Y')  # Ej: "Nov 2025"
        
        # Filtrar reseñas de este mes
        inicio_mes = mes_fecha.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        if i == 0:
            fin_mes = timezone.now()
        else:
            fin_mes = (mes_fecha.replace(day=1) + relativedelta(months=1)) - timedelta(seconds=1)
        
        resenas_mes = resenas_recientes.filter(
            fecha_creacion__gte=inicio_mes,
            fecha_creacion__lte=fin_mes
        )
        
        total_mes = resenas_mes.count()
        
        if total_mes > 0:
            # Contar por sentimiento
            sent_counts = resenas_mes.values('sentimiento').annotate(
                count=Count('id')
            )
            
            positivas = 0
            neutrales = 0
            negativas = 0
            
            for s in sent_counts:
                sent = s['sentimiento'] if s['sentimiento'] else 'neutral'
                if sent == 'positiva':
                    positivas = s['count']
                elif sent == 'neutral':
                    neutrales = s['count']
                elif sent == 'negativa':
                    negativas = s['count']
            
            # Calcular porcentajes
            porc_positivas = round((positivas / total_mes) * 100, 1)
            porc_neutrales = round((neutrales / total_mes) * 100, 1)
            porc_negativas = round((negativas / total_mes) * 100, 1)
        else:
            porc_positivas = porc_neutrales = porc_negativas = 0
        
        meses_data[mes_key] = {
            'mes': mes_label,
            'total': total_mes,
            'positivas': porc_positivas,
            'neutrales': porc_neutrales,
            'negativas': porc_negativas
        }
    
    # Convertir dict a lista ordenada (más reciente primero)
    evolucion = [meses_data[k] for k in sorted(meses_data.keys(), reverse=True)]
    
    return Response({
        'evolucion': evolucion[::-1],  # Invertir para mostrar más antiguo primero
        'meses_totales': len([m for m in evolucion if m['total'] > 0])
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def palabras_clave_resenas(request):
    """
    Analiza palabras más frecuentes en reseñas del kinesiólogo.
    Separa por sentimiento positivo/negativo.
    """
    from collections import Counter
    import re
    
    kine_id = request.user.uid
    
    try:
        kine = kinesiologo.objects.get(firebase_ide=kine_id)
    except kinesiologo.DoesNotExist:
        return Response({'error': 'Kinesiólogo no encontrado'}, status=404)
    
    resenas_kine = reseña.objects.filter(cita__kinesiologo_id=kine.id)
    
    # Stop words básicas en español
    stopwords = {
        'el', 'la', 'de', 'que', 'y', 'a', 'en', 'un', 'ser', 'se', 'no', 'haber',
        'por', 'con', 'su', 'para', 'como', 'estar', 'tener', 'le', 'lo', 'todo',
        'pero', 'más', 'hacer', 'o', 'poder', 'decir', 'este', 'ir', 'otro', 'ese',
        'la', 'si', 'me', 'ya', 'ver', 'porque', 'dar', 'cuando', 'él', 'muy',
        'sin', 'vez', 'mucho', 'saber', 'qué', 'sobre', 'mi', 'alguno', 'mismo',
        'yo', 'también', 'hasta', 'año', 'dos', 'querer', 'entre', 'así', 'primero',
        'desde', 'grande', 'eso', 'ni', 'nos', 'llegar', 'pasar', 'tiempo', 'ella',
        'es', 'fue', 'ha', 'una', 'las', 'los', 'del', 'al', 'esta', 'te', 'fue',
        'muy', 'buena', 'buen', 'bueno', 'mala', 'malo'
    }
    
    def extraer_palabras(comentario):
        # Limpiar y tokenizar
        palabras = re.findall(r'\b[a-záéíóúñ]{4,}\b', comentario.lower())
        return [p for p in palabras if p not in stopwords]
    
    # Palabras en reseñas positivas
    positivas = resenas_kine.filter(sentimiento='positiva')
    palabras_positivas = []
    for r in positivas:
        palabras_positivas.extend(extraer_palabras(r.comentario))
    
    # Palabras en reseñas negativas
    negativas = resenas_kine.filter(sentimiento='negativa')
    palabras_negativas = []
    for r in negativas:
        palabras_negativas.extend(extraer_palabras(r.comentario))
    
    # Contar frecuencias
    freq_positivas = Counter(palabras_positivas).most_common(10)
    freq_negativas = Counter(palabras_negativas).most_common(10)
    
    return Response({
        'positivas': [{'palabra': p, 'frecuencia': f} for p, f in freq_positivas],
        'negativas': [{'palabra': p, 'frecuencia': f} for p, f in freq_negativas],
        'total_positivas': len(palabras_positivas),
        'total_negativas': len(palabras_negativas)
    })
