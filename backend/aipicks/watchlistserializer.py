from rest_framework import serializers
from .models import Watchlist
from stocks.models import Stock

class AIPicksSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = ['ticker', 'expected_percentage_change_in_price']

class WatchlistSerializer(serializers.ModelSerializer):
    stock = AIPicksSerializer(read_only=True)
    
    class Meta:
        model = Watchlist
        fields = ["id", "stock"]


