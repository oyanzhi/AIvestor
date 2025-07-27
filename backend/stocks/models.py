from django.db import models


# Create your models here.
class Stock(models.Model):
    ticker = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100, blank=True)
    sector = models.CharField(max_length=100, blank=True, null=True)
    industry = models.CharField(max_length=100, blank=True, null=True)

    # Valuation metrics
    market_cap = models.BigIntegerField(blank=True, null=True)
    pe_ratio = models.FloatField(
        blank=True, null=True
    )  # This is the price you are paying per dollar earned by company. Generally low is good, high is bad but depends on industry.
    forward_pe = models.FloatField(blank=True, null=True)  # Forward PE
    peg_ratio = models.FloatField(
        blank=True, null=True
    )  # This is just pe but with growth consideration. PEG < 1 is often sign of undervaluation
    pb_ratio = models.FloatField(
        blank=True, null=True
    )  # this is price that you are paying per net asset value of company.Low pb ratio generally indicate undervaluation
    price_to_sales = models.FloatField(blank=True, null=True)
    enterprise_to_revenue = models.FloatField(blank=True, null=True)
    enterprise_to_ebitda = models.FloatField(blank=True, null=True)
    dividend_yield = models.FloatField(
        blank=True, null=True
    )  # Generally, a higher dividend yield suggests a company is generating more profit.
    dividend_rate = models.FloatField(blank=True, null=True)
    payout_ratio = models.FloatField(blank=True, null=True)
    dcf_intrinsic_value = models.DecimalField(
        max_digits=20, decimal_places=4, null=True, blank=True
    )

    current_price = models.DecimalField(max_digits=12, decimal_places=2)
    previous_close = models.FloatField(null=True, blank=True)
    predicted_closing_price = models.DecimalField(
        max_digits=12, decimal_places=2, null=True, blank=True
    )
    expected_percentage_change_in_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    valuation_score = models.IntegerField(null=True, blank=True)
    valuation = models.CharField(
        max_length=20,
        choices=[
            ("Undervalued", "Undervalued"),
            ("Fairly valued", "Fairly valued"),
            ("Overvalued", "Overvalued"),
        ],
        null=True,
        blank=True,
    )

    # Profitability metrics
    roa = models.FloatField(blank=True, null=True)  # Return on Assets
    roe = models.FloatField(blank=True, null=True)  # Return on Equity
    gross_margin = models.FloatField(blank=True, null=True)
    operating_margin = models.FloatField(blank=True, null=True)
    net_margin = models.FloatField(blank=True, null=True)

    # Growth metrics
    earnings_growth = models.FloatField(blank=True, null=True)
    revenue_growth = models.FloatField(blank=True, null=True)
    free_cash_flow_growth = models.FloatField(blank=True, null=True)

    # Liquidity & solvency
    current_ratio = models.FloatField(blank=True, null=True)
    quick_ratio = models.FloatField(blank=True, null=True)
    interest_coverage = models.FloatField(blank=True, null=True)

    # risk Metrics
    beta = models.FloatField(
        blank=True, null=True
    )  # > 1 means more volatile than market hence HIGHER RISK
    volatility = models.FloatField(
        blank=True, null=True
    )  # (must calculate from historical prices) Higher = HIGHER RISK
    debt_to_asset_ratio = models.FloatField(
        blank=True, null=True
    )  # A high debt-to-asset ratio means a larger portion of the company's assets are financed by debt hence higher risk
    risk_score = models.IntegerField(null=True, blank=True)
    risk_level = models.CharField(
        max_length=20,
        choices=[
            ("Low", "Low"),
            ("Medium", "Medium"),
            ("High", "High"),
        ],
        null=True,
        blank=True,
    )

    # Cash flow metrics
    free_cash_flow = models.BigIntegerField(
        blank=True, null=True
    )  # help to do discounted cash flow (DCF)
    operating_cash_flow = models.BigIntegerField(blank=True, null=True)
    capital_expenditures = models.BigIntegerField(blank=True, null=True)
    cash = models.BigIntegerField(blank=True, null=True)
    total_debt = models.BigIntegerField(blank=True, null=True)

    # Shares info
    shares_outstanding = models.BigIntegerField(blank=True, null=True)
    float_shares = models.BigIntegerField(blank=True, null=True)
    shares_short = models.BigIntegerField(blank=True, null=True)
    short_ratio = models.FloatField(blank=True, null=True)

    # time
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.ticker
