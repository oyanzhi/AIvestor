from .models import Stock
from decimal import Decimal
import yfinance as yf

def update_all_stock_metrics(verbose=False):
    stocks = Stock.objects.all()
    updated = []

    for stock in stocks:
        try:
            info, yf_stock = fetch_yfinance_info(stock.ticker)

            # Basic metadata
            stock.name = info.get('shortName') or stock.name
            stock.sector = info.get('sector')
            stock.industry = info.get('industry')

            # Financial metrics
            price = info.get('currentPrice') or info.get('previousClose')
            if price is not None:
                stock.current_price = Decimal(str(price))

            if not isinstance(info.get("marketCap"), int): #defensive check as market cap may sometimes give null
                stock.market_cap = None
            stock.pe_ratio = info.get('trailingPE')
            stock.peg_ratio = info.get('pegRatio')
            stock.pb_ratio = info.get('priceToBook')
            stock.dividend_yield = info.get('dividendYield')
            stock.beta = info.get('beta')
            stock.debt_to_asset_ratio = calculate_debt_to_asset_ratio(info)
            stock.free_cash_flow = info.get('freeCashflow') 

            # Custom logic
            stock.volatility = estimate_volatility(yf_stock)
            stock.valuation = get_valuation_status(stock)
            stock.risk_level = get_risk_level(stock)

            stock.save()
            if verbose:
                print(f"✅ Updated {stock.ticker}")
            updated.append(stock.ticker)

        except Exception as e:
            if verbose:
                print(f"[ERROR] Failed to update {stock.ticker}: {e}")

    if verbose:
        print(f"Updated {len(updated)} stocks: {updated}")
    return updated

def fetch_yfinance_info(ticker):
    yf_stock = yf.Ticker(ticker)
    return yf_stock.info, yf_stock

def calculate_debt_to_asset_ratio(info):
    try:
        total_debt = info.get('totalDebt')
        total_assets = info.get('totalAssets')
        if not total_debt or not total_assets or total_assets == 0:
            return None  
        ratio = total_debt / total_assets
        return round(ratio, 4) 
    except Exception as e:
        print(f"Error calculating debt to asset ratio: {e}")
        return None

def estimate_volatility(yf_stock):
    try:
        hist = yf_stock.history(period="1mo")
        if hist.empty or 'Close' not in hist:
            return None
        returns = hist['Close'].pct_change().dropna()
        return round(returns.std() * (252 ** 0.5), 4)
    except:
        return None

def get_valuation_status(stock):
    if stock.pe_ratio is None:
        return "Fairly valued"
    elif stock.pe_ratio < 15:
        return "Undervalued"
    elif stock.pe_ratio > 25:
        return "Overvalued"
    else:
        return "Fairly valued"

def get_risk_level(stock):
    beta = stock.beta or 1.0
    volatility = stock.volatility or 0.3
    debt_ratio = stock.debt_to_asset_ratio or 0.5

    score = 0
    if beta > 1.5:
        score += 2
    elif beta > 1.0:
        score += 1

    if volatility > 0.5:
        score += 2
    elif volatility > 0.3:
        score += 1

    if debt_ratio > 0.6:
        score += 2
    elif debt_ratio > 0.4:
        score += 1

    if score >= 4:
        return "High"
    elif score >= 2:
        return "Medium"
    else:
        return "Low"
    
def get_or_create_stock(ticker):
    from .models import Stock

    try:
        return Stock.objects.get(ticker=ticker.upper())
    except Stock.DoesNotExist:
        # Fetch from yfinance
        info, yf_stock = fetch_yfinance_info(ticker)

        price = info.get('currentPrice') or info.get('previousClose')
        if price is None:
            raise ValueError("Unable to retrieve current price for ticker")

        stock = Stock.objects.create(
            ticker=ticker.upper(),
            name=info.get('shortName') or ticker.upper(),
            sector=info.get('sector'),
            industry=info.get('industry'),
            current_price=Decimal(str(price)),
            market_cap=info.get('marketCap') if isinstance(info.get('marketCap'), int) else None,
            pe_ratio=info.get('trailingPE'),
            peg_ratio=info.get('pegRatio'),
            pb_ratio=info.get('priceToBook'),
            dividend_yield=info.get('dividendYield'),
            beta=info.get('beta'),
            debt_to_asset_ratio=calculate_debt_to_asset_ratio(info),
            free_cash_flow=info.get('freeCashflow'),
            volatility=estimate_volatility(yf_stock),
        )
        stock.valuation = get_valuation_status(stock)
        stock.risk_level = get_risk_level(stock)
        stock.save()
        return stock
