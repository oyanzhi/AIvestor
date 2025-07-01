from django.urls import path
from .views import LoginAccountAppView, Ping

urlpatterns = [
    path('loginpage/', LoginAccountAppView.as_view(), name='loginaccount'), # URL for the login account API endpoint
    path('ping/', Ping.as_view() , name='ping'), # URL for the pinging
]
