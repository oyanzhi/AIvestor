from django.db import models

# Create your models here.
class Stock(models.Model):
    ticker = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100, blank=True)
    sector = models.CharField(max_length=100, blank=True, null=True)
    industry = models.CharField(max_length=100, blank=True, null=True)

    # Valuation metrics
    market_cap = models.BigIntegerField(blank=True, null=True)
    pe_ratio = models.FloatField(blank=True, null=True) #This is the price you are paying per dollar earned by company. Generally low is good, high is bad but depends on industry. 
    peg_ratio = models.FloatField(blank=True, null=True) #This is just pe but with growth consideration. PEG < 1 is often sign of undervaluation
    pb_ratio = models.FloatField(blank=True, null=True) #this is price that you are paying per net asset value of company.Low pb ratio generally indicate undervaluation
    dividend_yield = models.FloatField(blank=True, null=True) # Generally, a higher dividend yield suggests a company is generating more profit.
    current_price = models.DecimalField(max_digits=12, decimal_places=2)

    # risk Metrics
    beta = models.FloatField(blank=True, null=True) # > 1 means more volatile than market hence HIGHER RISK
    volatility = models.FloatField(blank=True, null=True) # (must calculate from historical prices) Higher = HIGHER RISK
    debt_to_asset_ratio = models.FloatField(blank=True, null=True) # A high debt-to-asset ratio means a larger portion of the company's assets are financed by debt hence higher risk

    # Cash flow metrics
    free_cash_flow = models.BigIntegerField(blank=True, null=True) #help to do discounted cash flow (DCF)

    #time
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.ticker