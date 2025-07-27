from rest_framework import serializers
from .models import Stock  # replace with actual model name


class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = [
            "name",
            "ticker",
            "sector",
            "industry",
            "dividend_yield",
            "current_price",
            "previous_close",
            "predicted_closing_price",
            "expected_percentage_change_in_price",
            "market_cap",
            "pe_ratio",
            "forward_pe",
            "peg_ratio",
            "pb_ratio",
            "price_to_sales",
            "dcf_intrinsic_value",
            "valuation",
            "roe",
            "roa",
            "gross_margin",
            "operating_margin",
            "net_margin",
            "earnings_growth",
            "revenue_growth",
            "free_cash_flow_growth",
            "beta",
            "volatility",
            "debt_to_asset_ratio",
            "risk_level",
            "free_cash_flow",
            "operating_cash_flow",
            "capital_expenditures",
            "cash",
            "total_debt",
            "shares_outstanding",
            "float_shares",
            "shares_short",
            "short_ratio",
        ]
