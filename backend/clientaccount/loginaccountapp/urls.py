from django.urls import path
from .views import LoginAccountAppView

urlpatterns = [
    path('loginpage/', LoginAccountAppView.as_view(), name='loginaccount'), # URL for the login account API endpoint
]
