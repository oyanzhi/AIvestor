from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from yahooquery import Ticker
from decimal import Decimal
from rest_framework.permissions import AllowAny
from stocks.models import Stock
from portfolio.models import stockHolding
from stocks.services import get_valuation_status, get_risk_level
from portfolio.services import add_or_update_stock_holding


class SearchSymbolView(APIView):
    permission_classes=[AllowAny]
    def get(self, request):
        stock_name = request.GET.get("name", "").strip()
        if not stock_name:
            return Response({"error": "Stock name is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            ticker = Ticker(stock_name)
            symbols = ticker.symbols

            if not symbols:
                return Response({"error": "No symbol found for the given name"}, status=status.HTTP_404_NOT_FOUND)

            #ask user to be more specific if result not unique
            if len(symbols) > 1:
                return Response({"error": "Multiple company found. Please be more specific."}, status=status.HTTP_400_BAD_REQUEST)

            symbol = symbols[0] 
            return Response({"symbol": symbol}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SearchNameView(APIView):
    permission_classes=[AllowAny]
    def get(self, request):
        stock_symbol = request.GET.get("symbol", "").strip()
        if not stock_symbol:
            return Response({"error": "Ticker symbol is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            ticker = Ticker(stock_symbol)
            price_data = ticker.price

            # Make sure data exists for the symbol
            if stock_symbol not in price_data or 'longName' not in price_data[stock_symbol]:
                return Response({"error": "No name found for the given symbol"}, status=status.HTTP_404_NOT_FOUND)

            name = price_data[stock_symbol]['longName']

            return Response({"name": name}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class RemoveStockFromPortfolioView(APIView):
    def delete(self, request, ticker):
        try:
            stock = get_object_or_404(Stock, ticker=ticker)
            holding = get_object_or_404(stockHolding, user=request.user, stock=stock)

            holding.delete()
            return Response({"message": "Stock removed from portfolio."}, status=status.HTTP_204_NO_CONTENT)

        except stockHolding.DoesNotExist:
            return Response({"error": "Stock not found in portfolio."}, status=status.HTTP_404_NOT_FOUND)

class AddStockToPortfolioView(APIView):
    def post(self, request):
        ticker = request.data.get("ticker")
        shares = Decimal(request.data.get("shares", 0))
        bought_price = Decimal(request.data.get("bought_price", 0))

        if not ticker or shares <= 0 or bought_price <= 0:
            return Response({"error": "Invalid input."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = request.user
            holding, stock = add_or_update_stock_holding(user, ticker, shares, bought_price)

            # Portfolio metrics
            current_price = stock.current_price
            total_cost = holding.quantity * holding.average_buy_price
            market_value = holding.quantity * current_price
            valuation = get_valuation_status(stock)
            risk_level = get_risk_level(stock)

            return Response({
                "name": stock.name,
                "ticker": stock.ticker,
                "shares": float(holding.quantity),
                "boughtPrice": float(holding.average_buy_price),
                "currentPrice": float(current_price),
                "totalCost": float(total_cost),
                "marketValue": float(market_value),
                "valuation": valuation,
                "riskLevel": risk_level,
            }, status=status.HTTP_201_CREATED)

        except Stock.DoesNotExist:
            return Response({"error": "Stock not found."}, status=status.HTTP_404_NOT_FOUND)
        
class PortfolioView(APIView):
    def get(self, request):
        user = request.user
        holdings = stockHolding.objects.filter(user=user)
        portfolio_data = []

        for holding in holdings:
            stock = holding.stock
            total_cost = holding.quantity * holding.average_buy_price
            market_value = holding.quantity * stock.current_price

            portfolio_data.append({
                "name": stock.name,
                "ticker": stock.ticker,
                "shares": float(holding.quantity),
                "boughtPrice": float(holding.average_buy_price),
                "currentPrice": float(stock.current_price),
                "totalCost": float(total_cost),
                "marketValue": float(market_value),
                "valuation": stock.valuation or "Fairly valued",
                "riskLevel": stock.risk_level or "Medium",
            })

        return Response(portfolio_data, status=status.HTTP_200_OK)
    
