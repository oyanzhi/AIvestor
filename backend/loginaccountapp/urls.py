from django.urls import path
from .views import LoginAccountAppView, TokenRefreshView, Ping

urlpatterns = [
    path('loginpage/', LoginAccountAppView.as_view(), name='loginaccount'), # URL for the login account API endpoint
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), 
    path('ping/', Ping.as_view() , name='ping'), # URL for the pinging
]
