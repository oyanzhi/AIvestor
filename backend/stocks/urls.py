from django.urls import path
from .views import UpdateStocksView

urlpatterns = [
    path('updatestock/', UpdateStocksView.as_view(), name='stockupdate'), 
]
