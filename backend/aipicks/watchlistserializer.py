from rest_framework import serializers
from .models import Watchlist
from stocks.serializers import StockSerializer

class WatchlistSerializer(serializers.ModelSerializer):
    stock = StockSerializer(read_only=True)
    
    class Meta:
        model = Watchlist
        fields = ["id", "stock"]

        