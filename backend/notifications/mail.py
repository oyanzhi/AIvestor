from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from .models import NotificationsDatabase

def save_email(user, subject, body_text, body_html, email_type):
    NotificationsDatabase.objects.create(
        user=user,
        subject=subject,
        body_text=body_text,
        body_html=body_html,
        email_type=email_type
    )


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

    save_email(user, subject, text_content, html_content, email_type="Profile Update")

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

    save_email(user, subject, text_content, html_content, email_type="New Account Created")

def send_verification_email(user):
    subject = "AIvestor Account Verification"
    from_email = settings.DEFAULT_FROM_EMAIL
    to = [user.email]

    verification_link = f"{settings.FRONTEND_DOMAIN}/registeraccountapp/verifyaccount/?code={user.verification_code}"

    context = {
        "user": user,
        "verification_link": verification_link,
        "support_email": settings.DEFAULT_SUPPORT_EMAIL,
    }

    text_content = render_to_string("emails/verification.txt", context)
    html_content = render_to_string("emails/verification.html", context)

    msg = EmailMultiAlternatives(subject, text_content, from_email, to)
    msg.attach_alternative(html_content, "text/html")
    msg.send()

    save_email(user, subject, text_content, html_content, email_type="Account Verification")




