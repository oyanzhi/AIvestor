from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from rest_framework.permissions import IsAuthenticated

from .models import NotificationsDatabase
from .notificationsserializer import NotificationsSerializer


class GetNotificationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # limit to 15
        records = NotificationsDatabase.objects.filter(user=user).order_by("-sent_at")[
            :15
        ]

        serializer = NotificationsSerializer(records, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
