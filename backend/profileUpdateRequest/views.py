from .serializers import ProfileUpdateSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.authentication import TokenAuthentication

class ProfileUpdateView(APIView):
    def post(self, request):
        serializer = ProfileUpdateSerializer(instance=request.user, data=request.data, partial=True, context={'request': request})

        if serializer.is_valid():
            send_mail(
                subject='AIvestor Profile Update Confirmation',
                message=f"Hi {request.user.display_name or request.user.username},\n\nYour profile was updated successfully.",
                from_email = settings.DEFAULT_FROM_EMAIL,
                recipient_list=[request.user.email],
                fail_silently=True,
            )

            serializer.save()
            return Response({"message": "Profile updated successfully"}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        return Response({"GET not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
