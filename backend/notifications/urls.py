from django.urls import path
from .views import GetNotificationsView

urlpatterns = [
    path("getnotifications/", GetNotificationsView.as_view(), name="getnotifications")
]
