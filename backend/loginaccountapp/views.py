from .loginaccountlogic import LoginAccountLogic
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from django.http import HttpResponse

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