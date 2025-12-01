# core/signals.py
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from .models import kinesiologo


@receiver(pre_save, sender=kinesiologo)
def detectar_aprobacion_kinesiologo(sender, instance, **kwargs):
    """
    Detecta cuando un kinesiólogo es aprobado y envía correo.
    Se ejecuta antes de guardar para comparar el estado anterior con el nuevo.
    """
    if instance.pk:  # Solo si ya existe (es una actualización, no creación)
        try:
            anterior = kinesiologo.objects.get(pk=instance.pk)
            
            # Si cambió de otro estado a 'aprobado'
            if anterior.estado_verificacion != 'aprobado' and instance.estado_verificacion == 'aprobado':
                # Enviar correo de aprobación
                enviar_correo_aprobacion(instance)
        except kinesiologo.DoesNotExist:
            pass  # Es nuevo, no hacer nada


def enviar_correo_aprobacion(kine):
    """Envía correo de aprobación al kinesiólogo"""
    asunto = '¡Tu perfil ha sido aprobado! - KineAyuda'
    
    mensaje = f"""
Hola {kine.nombre} {kine.apellido},

¡Excelentes noticias! Tu perfil de kinesiólogo ha sido aprobado en KineAyuda.

Ya puedes:
✅ Acceder a tu panel de kinesiólogo
✅ Publicar tu disponibilidad horaria
✅ Comenzar a recibir pacientes

Para empezar, inicia sesión en: {settings.FRONTEND_BASE_URL}/kinesiologos/login

Si tienes alguna duda, no dudes en contactarnos.

¡Bienvenido al equipo de KineAyuda!

---
Este es un correo automático, por favor no respondas a este mensaje.
KineAyuda - Tu plataforma de kinesiología
{settings.FRONTEND_BASE_URL}
    """.strip()
    
    try:
        send_mail(
            subject=asunto,
            message=mensaje,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[kine.email],
            fail_silently=False,
        )
        print(f"✅ Correo de aprobación enviado a {kine.email}")
    except Exception as e:
        print(f"❌ Error al enviar correo a {kine.email}: {str(e)}")
