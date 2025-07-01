from .loginaccountlogic import LoginAccountLogic
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import login
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny

# Create your views here.
class LoginAccountAppView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginAccountLogic(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data["user"]

            login(request, user)

            token, created = Token.objects.get_or_create(user=user)
            
            return Response({"message": "Login Successful", "token": token.key}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class Ping(APIView):
    permission_classes=[AllowAny]
    def get(self, request):
        return Response(status=status.HTTP_200_OK)