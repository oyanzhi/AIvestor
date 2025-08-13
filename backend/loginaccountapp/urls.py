from django.urls import path
from .views import LoginAccountAppView, GoogleSignInView, TokenRefreshView, Ping

urlpatterns = [
    path(
        "loginpage/", LoginAccountAppView.as_view(), name="loginaccount"
    ),  # URL for the login account API endpoint
    path("googlelogin/", GoogleSignInView.as_view(), name="googlelogin"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("ping/", Ping.as_view(), name="ping"),  # URL for the pinging
]
