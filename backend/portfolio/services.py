from decimal import Decimal
from stocks.services import get_or_create_stock
from portfolio.models import stockHolding

def add_or_update_stock_holding(user, ticker, shares: Decimal, bought_price: Decimal):
    stock = get_or_create_stock(ticker)
    holding, created = stockHolding.objects.get_or_create(user=user, stock=stock, defaults={'average_buy_price': bought_price, 'quantity' : shares})

    if not created:
        total_qty = holding.quantity + shares
        total_cost = (holding.quantity * holding.average_buy_price) + (shares * bought_price)
        holding.average_buy_price = total_cost / total_qty
        holding.quantity = total_qty
    else:
        holding.quantity = shares
        holding.average_buy_price = bought_price

    holding.save()
    return holding, stock
