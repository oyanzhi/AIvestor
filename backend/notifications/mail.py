from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings

def send_profile_updated_email(user):
    subject = "AIvestor Profile Update Confirmation"
    from_email = settings.DEFAULT_FROM_EMAIL
    to = [user.email]

    context = {
        "user": user,
        "support_email": settings.DEFAULT_FROM_EMAIL,
    }

    text_content = f"""
                    Hi {user.display_name or user.username},

                    Your profile was successfully updated.

                    If you have any questions, contact us at {settings.DEFAULT_FROM_EMAIL}.

                    – The AIvestor Team
                    """
    html_content = render_to_string("emails/profile_updated.html", context)

    msg = EmailMultiAlternatives(subject, text_content, from_email, to)
    msg.attach_alternative(html_content, "text/html")
    msg.send()