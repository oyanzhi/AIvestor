from rest_framework import serializers
from .models import Stock  # replace with actual model name

class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = [
            'name', 'ticker', 'current_price', 'market_cap', 'pe_ratio', 'valuation', 'risk_level'
        ]