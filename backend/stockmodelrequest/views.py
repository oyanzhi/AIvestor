from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from .postreceivelogic import PostReceiveLogic


# Create your views here.
class PredictStockAppView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PostReceiveLogic(data=request.data)

        if serializer.is_valid():
            predictions = serializer.check_ticker(serializer.validated_data)
            return Response(predictions, status=status.HTTP_200_OK)
        
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

