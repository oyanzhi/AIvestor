from django.db import models
from registeraccountapp.models import AccountDatabase
from stocks.models import Stock

# Create your models here.
class Watchlist(models.Model):
    user = models.ForeignKey(AccountDatabase, on_delete=models.CASCADE, related_name="watchlist")
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE)

    class Meta:
        db_table = 'watchlist'
        unique_together = ('user', 'stock')

    def __str__(self):
        return f"{self.user.username} - {self.stock.name}"