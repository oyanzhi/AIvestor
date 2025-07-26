from .loginaccountlogic import LoginAccountLogic
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from django.http import HttpResponse

from google.oauth2 import id_token
from google.auth.transport import requests
from django.conf import settings

from registeraccountapp.models import AccountDatabase

import string
import secrets
from django.contrib.auth.hashers import make_password

def make_random_password():
    alphabet = string.ascii_letters + string.digits
    password = ''.join(secrets.choice(alphabet) for i in range(8))

    return make_password(password)

# Create your views here.
class LoginAccountAppView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginAccountLogic(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data["user"]

            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            refresh_token = str(refresh)
            
            response = Response({"message": "Login Successful", "access": access_token}, status=status.HTTP_200_OK)

            response.set_cookie(
                key="refresh_token",
                value=refresh_token,
                httponly=True,
                secure=True,
                samesite="Lax",
                max_age= 7 * 24 * 60 * 60 #same timeframe as refresh token
            )

            return response
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class GoogleSignInView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        token = request.data.get("id_token")

        if not token:
            return Response({"Error": "ID token missing."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            info = id_token.verify_oauth2_token(token, requests.Request(), audience=settings.GOOGLE_CLIENT_ID)

        except Exception as e:
            return Response({"Error": str(e)}, status=status.HTTP_401_UNAUTHORIZED)
        
        email = info.get("email")
        sub = info.get("sub")

        if not email or not sub:
            return Response({"Error": "Missing Data"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = AccountDatabase.objects.get(oauth_provider="google", oauth_provider_id=sub)

        except AccountDatabase.DoesNotExist:
            try:
                user = AccountDatabase.objects.get(email=email)
                user.oauth_provider = "google"
                user.oauth_provider_id = sub
                user.is_oauth_user = True
                user.save()

            except AccountDatabase.DoesNotExist:
                base_username = email.split("@")[0]
                username = base_username
                counter = 1

                while AccountDatabase.objects.filter(username=username).exists():
                    username = f"{base_username}{counter}"
                    counter += 1

                user = AccountDatabase.objects.create(
                    username = username,
                    email = email,
                    password = make_random_password(),
                    oauth_provider = "google",
                    oauth_provider_id = sub,
                    is_oauth_user = True,
                )
        
        token = RefreshToken.for_user(user)
        access_token = str(token.access_token)

        refresh_token = str(token)
        
        response = Response({"message": "Login Successful", "access": access_token}, status=status.HTTP_200_OK)

        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=True,
            samesite="Lax",
            max_age= 7 * 24 * 60 * 60 #same timeframe as refresh token
        )

        return response


    
class TokenRefreshView(APIView): #currently setup but not being used
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")

        if not refresh_token:
            return Response({"Error": "No Refresh Token Found."}, status=status.HTTP_401_UNAUTHORIZED)
        

        try:
            token = RefreshToken(refresh_token)
            access_token = str(token.access_token)
            return Response({"access": access_token}, status=status.HTTP_200_OK)
        
        except Exception:
            return Response({"Error": "Refresh Token Cannot be Generated"}, status=status.HTTP_401_UNAUTHORIZED)
    
class Ping(APIView):
    permission_classes=[AllowAny]
    def get(self, request):
        return HttpResponse("OK", content_type="text/plain")