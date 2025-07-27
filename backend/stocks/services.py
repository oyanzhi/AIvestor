from .models import Stock
from statistics import median
from decimal import Decimal
import yfinance as yf
import pandas as pd
from decimal import Decimal, InvalidOperation
from ml.predict import StockPredict


def update_all_stock_metrics(verbose=False):
    stocks = Stock.objects.all()
    updated = []
    predictor = StockPredict()

    for stock in stocks:
        try:
            info, yf_stock = fetch_yfinance_info(stock.ticker)

            # Basic metadata
            stock.name = info.get("shortName") or stock.name
            stock.sector = info.get("sector")
            stock.industry = info.get("industry")

            # Financial metrics
            price = info.get("currentPrice") or info.get("previousClose")
            if price is not None:
                stock.current_price = Decimal(str(price))

            previous_close = info.get("previousClose")
            if previous_close is not None:
                stock.previous_close = Decimal(str(previous_close))

            if not isinstance(
                info.get("marketCap"), int
            ):  # defensive check as market cap may sometimes give null
                stock.market_cap = None
            stock.pe_ratio = info.get("trailingPE")
            stock.forward_pe = info.get("forwardPE")
            stock.peg_ratio = info.get("trailingPegRatio")
            stock.pb_ratio = info.get("priceToBook")
            stock.price_to_sales = info.get("priceToSalesTrailing12Months")
            stock.enterprise_to_revenue = info.get("enterpriseToRevenue")
            stock.enterprise_to_ebitda = info.get("enterpriseToEbitda")

            stock.dividend_yield = info.get("dividendYield")
            stock.dividend_rate = info.get("dividendRate")
            stock.payout_ratio = info.get("payoutRatio")

            # Profitability
            stock.roa = info.get("returnOnAssets")
            stock.roe = info.get("returnOnEquity")
            stock.gross_margin = info.get("grossMargins")
            stock.operating_margin = info.get("operatingMargins")
            stock.net_margin = info.get("profitMargins")

            # Growth
            stock.earnings_growth = info.get("earningsQuarterlyGrowth")
            stock.revenue_growth = info.get("revenueGrowth") or info.get(
                "revenueQuarterlyGrowth"
            )
            stock.free_cash_flow_growth = calculate_free_cash_flow_growth(yf_stock)

            # Liquidity & solvency
            stock.current_ratio = info.get("currentRatio")
            stock.quick_ratio = info.get("quickRatio")

            income_stmt = yf_stock.financials  # or .financials
            interest_expense = None
            ebit = None
            if income_stmt is not None:
                if "Interest Expense" in income_stmt.index:
                    interest_expense = income_stmt.loc[
                        "Interest Expense", income_stmt.columns[0]
                    ]
                if "Operating Income" in income_stmt.index:
                    ebit = income_stmt.loc["Operating Income", income_stmt.columns[0]]

            if (
                ebit is not None
                and interest_expense is not None
                and interest_expense != 0
            ):
                stock.interest_coverage = ebit / abs(interest_expense)
            else:
                stock.interest_coverage = None

            stock.beta = info.get("beta")
            stock.debt_to_asset_ratio = calculate_debt_to_asset_ratio(yf_stock, info)
            stock.free_cash_flow = info.get("freeCashflow")

            stock.operating_cash_flow = info.get("operatingCashflow")

            cashflow = yf_stock.cashflow
            if "Capital Expenditure" in cashflow.index:
                capex = cashflow.loc["Capital Expenditure"]
                latest_capex = capex.sort_index(ascending=False).iloc[0]
                stock.capital_expenditures = (
                    Decimal(str(latest_capex)) if pd.notna(latest_capex) else None
                )
            else:
                stock.capital_expenditures = None

            stock.cash = info.get("totalCash")
            stock.total_debt = info.get("totalDebt")

            # Shares info
            stock.shares_outstanding = info.get("sharesOutstanding")

            stock.float_shares = info.get("floatShares")
            stock.shares_short = info.get("sharesShort")
            stock.short_ratio = info.get("shortRatio")

            # Custom logic
            valuation, valuation_score = get_valuation_status(stock)
            risk_level, risk_score = get_risk_level(stock)
            stock.volatility = estimate_volatility(yf_stock)
            stock.valuation = valuation
            stock.valuation_score = valuation_score
            stock.risk_level = risk_level
            stock.risk_score = risk_score

            predicted_price = predictor.final(ticker=stock.ticker)
            if predicted_price is not None:
                stock.predicted_closing_price = Decimal(str(predicted_price))

            if previous_close is not 0.0:
                stock.expected_percentage_change_in_price = (stock.predicted_closing_price - previous_close) / previous_close * 100

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


def calculate_debt_to_asset_ratio(yfstock, info):
    try:
        total_debt = info.get("totalDebt")
        total_assets = None
        balance_sheet = yfstock.balance_sheet
        if balance_sheet is not None and "Total Assets" in balance_sheet.index:
            # The balance sheet columns are dates, get the latest available date column
            latest_date = balance_sheet.columns[0]
            total_assets = balance_sheet.loc["Total Assets", latest_date]

        if not total_debt or not total_assets or total_assets == 0:
            return None
        ratio = total_debt / total_assets
        return round(ratio, 4)
    except Exception as e:
        print(f"Error calculating debt to asset ratio: {e}")
        return None


def calculate_free_cash_flow_growth(yf_stock):
    try:
        cashflow = yf_stock.cashflow

        if cashflow is None or cashflow.empty:
            return None

        # Extract rows
        op_cashflow = cashflow.loc["Operating Cash Flow"]
        capex = cashflow.loc["Capital Expenditure"]

        # FCF = Operating Cash Flow - CapEx (CapEx is negative, so we add)
        fcf_series = op_cashflow.add(capex)

        # Make sure we have at least 2 years
        if len(fcf_series) < 2:
            return None

        # Sort from newest to oldest (column names are dates)
        fcf_sorted = fcf_series.sort_index(ascending=False)

        current_fcf = fcf_sorted.iloc[0]
        previous_fcf = fcf_sorted.iloc[1]

        if previous_fcf == 0:
            return None

        growth = (current_fcf - previous_fcf) / abs(previous_fcf)
        return round(float(growth) * 100, 2)

    except Exception as e:
        print(f"[ERROR] FCF growth calculation failed: {e}")
        return None


def estimate_volatility(yf_stock):
    try:
        hist = yf_stock.history(period="1mo")
        if hist.empty or "Close" not in hist:
            return None
        returns = hist["Close"].pct_change().dropna()
        return round(returns.std() * (252**0.5), 4)
    except:
        return None


def get_valuation_status(stock):

    if not stock.sector:
        return "Fairly valued", 0

    score = 0

    # Get sector medians
    sector_pe = get_sector_median("pe_ratio", stock.sector)
    sector_pb = get_sector_median("pb_ratio", stock.sector)
    sector_ps = get_sector_median("price_to_sales", stock.sector)
    sector_dy = get_sector_median("dividend_yield", stock.sector)

    # Relative P/E (20%)
    pe = stock.forward_pe or stock.pe_ratio
    if pe and sector_pe:
        relative_pe = pe / sector_pe
        if relative_pe < 0.8:
            score += 20
        elif relative_pe > 1.2:
            score -= 20

    # PEG based (25%)
    if stock.peg_ratio:
        if stock.peg_ratio < 0.8:
            score += 25
        elif stock.peg_ratio > 1.2:
            score -= 25
        elif stock.peg_ratio < 0:  # Negative growth
            score -= 30

    # Relative P/B (15%)
    if stock.pb_ratio and sector_pb:
        relative_pb = stock.pb_ratio / sector_pb
        if relative_pb < 0.8:
            score += 15
        elif relative_pb > 1.2:
            score -= 15

    # P/S Ratio (15%)
    if stock.price_to_sales and sector_ps:
        relative_ps = stock.price_to_sales / sector_ps
        if relative_ps < 0.8:
            score += 15
        elif relative_ps > 1.2:
            score -= 15

    # Dividend yield (higher is better) (10%)
    if stock.dividend_yield and sector_dy:
        if stock.dividend_yield > sector_dy * 1.5:
            score += 10
        elif stock.dividend_yield < sector_dy * 0.5:
            score -= 5

    # Growth Adjustment (15%)
    growth_rate = stock.earnings_growth or stock.revenue_growth
    if growth_rate:
        if growth_rate > 0.2:  # 20%+ growth
            score += 15
        elif growth_rate < -0.1:  # Declining
            score -= 15

    # Final decision
    if score >= 20:
        return "Undervalued", score
    elif score <= -20:
        return "Overvalued", score
    else:
        return "Fairly valued", score


def get_risk_level(stock):
    beta = stock.beta or 1.0
    volatility = stock.volatility or 0.3
    debt_ratio = stock.debt_to_asset_ratio or 0.5
    interest_coverage = stock.interest_coverage

    score = 70

    # Market Risk (20%)
    if beta > 1.5:
        score += 20
    elif beta > 1.2:
        score += 10
    elif beta < 0.8:
        score -= 10

    # Volatility Risk (10%)
    if volatility > 0.5:
        score += 15
    elif volatility > 0.35:
        score += 7

    # Financial Risk (25%)
    if debt_ratio > 0.7:
        score += 25
    elif debt_ratio > 0.5:
        score += 12
    elif debt_ratio < 0.2:
        score -= 10

    # Interest Coverage
    if interest_coverage is not None:
        if interest_coverage < 1:
            score += 20
        elif interest_coverage < 3:
            score += 10
        elif interest_coverage > 8:
            score -= 5

    # Liquidity Risk (20% weight)
    if stock.current_ratio:
        if stock.current_ratio < 1:
            score += 20
        elif stock.current_ratio < 1.5:
            score += 10

    # Cash/Debt
    if stock.cash and stock.total_debt:
        if stock.cash / stock.total_debt < 0.2:
            score += 10

    # Profitability Risk (15%)
    if stock.operating_margin:
        if stock.operating_margin < 0.05:
            score += 15
        elif stock.operating_margin < 0:
            score += 25

    # Size Risk (10%)
    if stock.market_cap:
        if stock.market_cap < 1e9:  # < $1B
            score += 15
        elif stock.market_cap < 5e9:  # < $5B
            score += 7

    # final risk rating
    normalized_score = score / 2
    if normalized_score >= 60:
        return "High", normalized_score
    elif normalized_score >= 40:
        return "Medium", normalized_score
    else:
        return "Low", normalized_score


def get_or_create_stock(ticker):
    from .models import Stock

    try:
        return Stock.objects.get(ticker=ticker.upper())
    except Stock.DoesNotExist:
        # Fetch from yfinance
        info, yf_stock = fetch_yfinance_info(ticker)

        price = info.get("currentPrice") or info.get("previousClose")
        if price is None:
            raise ValueError("Unable to retrieve current price for ticker")

        stock = Stock.objects.create(
            ticker=ticker.upper(),
            name=info.get("shortName") or ticker.upper(),
            sector=info.get("sector"),
            industry=info.get("industry"),
            current_price=Decimal(str(price)),
            market_cap=(
                info.get("marketCap")
                if isinstance(info.get("marketCap"), int)
                else None
            ),
            pe_ratio=info.get("trailingPE"),
            peg_ratio=info.get("pegRatio"),
            pb_ratio=info.get("priceToBook"),
            dividend_yield=info.get("dividendYield"),
            beta=info.get("beta"),
            debt_to_asset_ratio=calculate_debt_to_asset_ratio(info),
            free_cash_flow=info.get("freeCashflow"),
            volatility=estimate_volatility(yf_stock),
        )
        stock.valuation, stock.valuation_score = get_valuation_status(stock)
        stock.risk_level, stock.risk_score = get_risk_level(stock)
        stock.save()
        return stock


def get_sector_median(metric, sector):
    if not sector or not metric:
        return None
    peers = Stock.objects.filter(sector=sector).exclude(**{f"{metric}__isnull": True})
    values = [getattr(p, metric) for p in peers if getattr(p, metric) is not None]
    if not values:
        return None
    return median(values)
