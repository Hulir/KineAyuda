from rest_framework import routers
from django.urls import path, include
from .views import (kinesiologoViewSet, pacienteViewSet, citaViewSet, reseñaViewSet, verificar_firebase_token, me, AgendaViewSet, 
                    AgendarCitaView, HorasDisponiblesView, KinesiologosPublicosView, ReseñasPublicasView, lista_metodos_pago,
                    estado_suscripcion, webpay_iniciar_suscripcion, webpay_retorno, DocumentoVerificacionViewSet, webpay_iniciar_pago_cita,
                    webpay_retorno_pago_cita, CitasPorRutView, CrearReseñaPorCitaView, consultar_cita_publica,
                    validar_sentimiento_resena, estadisticas_resenas_kine, evolucion_resenas_kine, palabras_clave_resenas)

router = routers.DefaultRouter()
router.register(r'kinesiologos', kinesiologoViewSet, basename='kinesiologo')
router.register(r'pacientes', pacienteViewSet, basename='paciente')
router.register(r'citas', citaViewSet, basename='cita')
router.register(r'reseñas', reseñaViewSet, basename='reseña')
router.register(r'agendas', AgendaViewSet, basename='agenda')
router.register(r'documentos', DocumentoVerificacionViewSet, basename='documentos')

urlpatterns = [
    path('', include(router.urls)),
    path('login/verify', verificar_firebase_token, name='verificar_token'),
    path('me/', me, name='me'),
    path('public/kinesiologos/estadisticas/', KinesiologosPublicosView.as_view()),  # Debe ir antes de la ruta genérica
    path('public/kinesiologos/', KinesiologosPublicosView.as_view()),
    path('public/kinesiologos/<int:kinesiologo_id>/resenas/', ReseñasPublicasView.as_view()),
    path('public/kinesiologos/<int:kinesiologo_id>/horas/', HorasDisponiblesView.as_view()),
    path('public/agendar/', AgendarCitaView.as_view()),
    path('public/paciente/<str:rut>/citas/', CitasPorRutView.as_view()),
    path('public/citas/<int:cita_id>/', consultar_cita_publica, name='consultar-cita'),
    path('public/citas/<int:cita_id>/resena/', CrearReseñaPorCitaView.as_view(), name='crear-resena-por-cita'),
    path('pagos/metodos/', lista_metodos_pago),
    #path('pagos/webhook/<str:proveedor>/', webhook_pago),
    path('pagos/estado/', estado_suscripcion),
    path('pagos/webpay/iniciar/', webpay_iniciar_suscripcion),
    path('pagos/webpay/retorno/', webpay_retorno),
    path('pagos/citas/webpay/iniciar/', webpay_iniciar_pago_cita),
    path('pagos/citas/webpay/retorno/', webpay_retorno_pago_cita),
    # Fase 1: Validación IA y Estadísticas
    path('public/validar-sentimiento/', validar_sentimiento_resena, name='validar-sentimiento'),
    path('kine/resenas/estadisticas/', estadisticas_resenas_kine, name='estadisticas-resenas'),
    # Fase 2: Gráficos y Analytics
    path('kine/resenas/evolucion/', evolucion_resenas_kine, name='evolucion-resenas'),
    path('kine/resenas/palabras-clave/', palabras_clave_resenas, name='palabras-clave'),
]