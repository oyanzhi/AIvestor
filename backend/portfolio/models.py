from django.db import models
from django.conf import settings
from stocks.models import Stock

# Create your models here.
class stockHolding(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField
    average_buy_price = models.DecimalField(max_digits=12, decimal_places=2)
    added_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'stock') #prevent duplication of pair
    
    def __str__(self):
        return f"{self.user.username} owns {self.quantity} of {self.stock.symbol}"