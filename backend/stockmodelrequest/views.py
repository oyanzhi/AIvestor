from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .postreceivelogic import PostReceiveLogic

# Create your views here.
class PredictStockAppView(APIView):
    def post(self, request):
        serializer = PostReceiveLogic(data=request.data)

        if serializer.is_valid():
            predictions = serializer.check_ticker(serializer.validated_data)
            return Response(predictions, status=status.HTTP_200_OK)
        
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

