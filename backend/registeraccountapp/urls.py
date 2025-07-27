from django.urls import path
from .views import RegisterAccountAppView, VerifyAccountView

urlpatterns = [
    path("registerpage/", RegisterAccountAppView.as_view(), name="registeraccount"),  # URL for the register account API endpoint
    path("verifyaccount/", VerifyAccountView.as_view(), name="verifyaccount"),
]
