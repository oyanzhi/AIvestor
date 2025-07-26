from django.db import models
from registeraccountapp.models import AccountDatabase

class NotificationsDatabase(models.Model):
    user = models.ForeignKey(AccountDatabase, on_delete=models.CASCADE, related_name="emails")
    subject = models.CharField(max_length=255)
    body_text = models.TextField()
    body_html = models.TextField()
    sent_at = models.DateTimeField(auto_now_add=True)
    email_type = models.CharField(max_length=50)

    class Meta:
        db_table = 'notifications'

    def __str__(self):
        return f"{self.user.username} - {self.subject}" 
    