from .serializers import ProfileUpdateSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.authentication import TokenAuthentication
from notifications.mail import send_profile_updated_email


class ProfileUpdateView(APIView):
    def post(self, request):
        serializer = ProfileUpdateSerializer(instance=request.user, data=request.data, partial=True, context={'request': request})

        if serializer.is_valid():
            serializer.save()

            send_profile_updated_email(request.user)

            return Response({"message": "Profile updated successfully"}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        return Response({"GET not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
