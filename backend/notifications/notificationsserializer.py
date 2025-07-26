from rest_framework import serializers
from .models import NotificationsDatabase

class NotificationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationsDatabase
        fields = ["id", "user", "subject", "body_text", "body_html", "sent_at", "email_type"]

        