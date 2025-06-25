from django.urls import path
from .views import RegisterAccountAppView

urlpatterns = [
    path('registerpage/', RegisterAccountAppView.as_view(), name='registeraccount'), # URL for the register account API endpoint
]
