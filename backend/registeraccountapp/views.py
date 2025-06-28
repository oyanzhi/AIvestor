from .registeraccountlogic import RegisterAccountLogic
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from notifications.mail import send_welcome_email 

class RegisterAccountAppView(APIView):
    permission_classes=[AllowAny]

    def post(self, request):
        serializer = RegisterAccountLogic(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            send_welcome_email(user)

            return Response({"Registration Successful!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        return Response({"GET not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)