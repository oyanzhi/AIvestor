from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings

def send_profile_updated_email(user):
    subject = "AIvestor Profile Update Confirmation"
    from_email = settings.DEFAULT_FROM_EMAIL
    to = [user.email]

    context = {
        "user": user,
        "support_email": settings.DEFAULT_SUPPORT_EMAIL,
    }

    text_content = render_to_string("emails/profile_updated.txt", context)
    html_content = render_to_string("emails/profile_updated.html", context)

    msg = EmailMultiAlternatives(subject, text_content, from_email, to)
    msg.attach_alternative(html_content, "text/html")
    msg.send()

def send_welcome_email(user):
    subject = "AIvestor Account Creation"
    from_email = settings.DEFAULT_FROM_EMAIL
    to = [user.email]

    context = {
        "user": user,
        "support_email": settings.DEFAULT_SUPPORT_EMAIL,
    }

    text_content = render_to_string("emails/welcome_email.txt", context)
    html_content = render_to_string("emails/welcome_email.html", context)

    msg = EmailMultiAlternatives(subject, text_content, from_email, to)
    msg.attach_alternative(html_content, "text/html")
    msg.send()