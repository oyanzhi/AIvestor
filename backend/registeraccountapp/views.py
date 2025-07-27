from .registeraccountlogic import RegisterAccountLogic
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from notifications.mail import send_welcome_email, send_verification_email
from .models import AccountDatabase


class RegisterAccountAppView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterAccountLogic(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            send_verification_email(user)
            send_welcome_email(user)

            return Response(
                {"message": "Registration Successful! Please Check Your Email for Verification."}, status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyAccountView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        code = request.query_params.get("code")

        if not code:
            return Response({"message": "Missing Verification Code"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = AccountDatabase.objects.get(verification_code=code)
        except AccountDatabase.DoesNotExist:
            return Response({"message": "Invalid Verification Code"}, status=status.HTTP_400_BAD_REQUEST)
        
        if user.is_verified:
            return Response({"message": "Already Verified"}, status=status.HTTP_200_OK)
        
        if user.verification_code == code:
            user.is_verified = True
            user.verification_code = None
            user.save()
            return Response({"message": "User Verified"}, status=status.HTTP_200_OK)
        

        return Response({"message": "Invalid Verifcation"}, status=status.HTTP_400_BAD_REQUEST)
