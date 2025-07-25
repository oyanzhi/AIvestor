from django.shortcuts import render
from .serializers import StockSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from stocks.services import update_all_stock_metrics
from rest_framework.permissions import AllowAny
from .models import Stock
from datetime import datetime, timedelta
import yfinance as yf

# Create your views here.
class UpdateStocksView(APIView):
    permission_classes=[AllowAny]

    def post(self, request):
        update_all_stock_metrics(verbose=False)
        return Response({"message": "Stock metrics updated."}, status=status.HTTP_200_OK)
    
class GetStockView(APIView):
    def get(self, request):
        symbol = request.GET.get("symbol")
        if not symbol:
            return Response({"error": "Symbol query param is required."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            stock = Stock.objects.get(ticker__iexact=symbol)
        except Stock.DoesNotExist:
            return Response({"error": "Stock not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = StockSerializer(stock)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class GetHistoricalDataView(APIView):
    def get(self, request):
        symbol = request.GET.get("symbol")
        if not symbol:
            return Response({"error": "Symbol query param is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            stock = yf.Ticker(symbol)
            hist = stock.history(period="6mo", interval="1d")  # or "1y", etc.
            history_data = [
                {
                    "date": date.strftime("%Y-%m-%d"),
                    "close": round(row["Close"], 2) if not pd.isna(row["Close"]) else None
                }
                for date, row in hist.iterrows()
            ]
            return Response({"symbol": symbol, "historyData": history_data}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": f"Failed to fetch history: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)