from rest_framework import serializers
from portfolio.models import stockHolding
from stocks.models import Stock
from stocks.services import get_or_create_stock


class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = ['ticker', 'name', 'sector', 'industry', 'current_price', 'pe_ratio', 'beta', 'volatility']

class StockHoldingSerializer(serializers.ModelSerializer):
    stock = StockSerializer()  # Nested stock details

    class Meta:
        model = stockHolding
        fields = ['quantity', 'average_buy_price', 'stock']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        stock = data.pop('stock')

        # Add valuation (quantity * current_price)
        valuation = instance.quantity * stock['current_price']
        data['valuation'] = valuation
        return data