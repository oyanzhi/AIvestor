from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from stocks.services import get_or_create_stock
from .models import Watchlist
from stocks.models import Stock
from .watchlistserializer import WatchlistSerializer
from stocks.serializers import StockSerializer
import math


# Create your views here.
class AddWatchlist(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        tickersymbol = request.data.get("tickersymbol")

        if not tickersymbol:
            return Response({"message": "Missing Ticker"}, status=status.HTTP_400_BAD_REQUEST)
        
        tickersymbol = tickersymbol.upper().strip()
        
        try:
            stock_entry = get_or_create_stock(tickersymbol)
        except ValueError:
            return Response({"message": "Unable to add stock to watchlist"}, status=status.HTTP_400_BAD_REQUEST)
        
        watchlist_entry, created = Watchlist.objects.get_or_create(user=request.user, stock=stock_entry)

        if created:
            serialized = WatchlistSerializer(watchlist_entry)
            return Response({"message": "Successfully added to watchlist.", "entry": serialized.data}, status=status.HTTP_200_OK)
        
        return Response({"message": "Ticker already in watchlist"}, status=status.HTTP_200_OK)


class RemoveWatchlist(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        tickersymbol = request.data.get("tickersymbol")

        if not tickersymbol:
            return Response({"message": "Missing Ticker"}, status=status.HTTP_400_BAD_REQUEST)
        
        tickersymbol = tickersymbol.upper().strip()

        try:
            stock = Stock.objects.get(ticker=tickersymbol)
        except Stock.DoesNotExist:
            return Response({"message": "Not Found"}, status=status.HTTP_404_NOT_FOUND)
        
        deleted, _ = Watchlist.objects.filter(user=request.user, stock=stock).delete()

        if deleted:
            return Response({"message": "Successfully Removed from Watchlist"}, status=status.HTTP_200_OK)
        
        return Response({"message": "Stock Not In Watchlist"}, status=status.HTTP_404_NOT_FOUND)


class FetchWatchlist(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        watchlist_entries = Watchlist.objects.filter(user=user).order_by("stock__ticker")

        serialized = WatchlistSerializer(watchlist_entries, many=True)

        return Response(serialized.data, status=status.HTTP_200_OK)
    

class FetchAIRecommendations(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        in_watchlist = Watchlist.objects.filter(user=request.user).values_list("stock_id", flat=True)

        recommendations = Stock.objects.exclude(id__in=in_watchlist).filter(
            previous_close__isnull=False,
            predicted_closing_price__isnull=False,
            expected_percentage_change_in_price__isnull=False
        ).order_by(
            "-expected_percentage_change_in_price"
        )[:5]

        serialized = StockSerializer(recommendations, many=True)

        return Response(serialized.data, status=status.HTTP_200_OK)





        
