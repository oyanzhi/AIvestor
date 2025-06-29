from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from stocks.services import update_all_stock_metrics
from rest_framework.permissions import AllowAny

# Create your views here.
class UpdateStocksView(APIView):
    permission_classes=[AllowAny]

    def post(self, request):
        update_all_stock_metrics()
        return Response({"message": "Stock metrics updated."}, status=status.HTTP_200_OK)