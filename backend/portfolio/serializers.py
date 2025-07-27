from rest_framework import serializers
from portfolio.models import stockHolding
from stocks.models import Stock
from stocks.services import get_or_create_stock


class StockHoldingSerializer(serializers.ModelSerializer):
    ticker = serializers.CharField(source="stock.ticker", read_only=True)
    name = serializers.CharField(source="stock.name", read_only=True)

    class Meta:
        model = stockHolding
        fields = ["id", "ticker", "name", "quantity", "average_buy_price", "added_on"]
