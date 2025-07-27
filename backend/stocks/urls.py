from django.urls import path
from .views import UpdateStocksView, GetStockView, GetHistoricalDataView

urlpatterns = [
    path("updatestock/", UpdateStocksView.as_view(), name="stockupdate"),
    path("getstock/", GetStockView.as_view(), name="getstock"),
    path("gethistory/", GetHistoricalDataView.as_view(), name="gethistory"),
]
