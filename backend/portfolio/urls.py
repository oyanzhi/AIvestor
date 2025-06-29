from django.urls import path
from . import views

urlpatterns = [
    path('addstock', views.AddStockToPortfolioView.as_view(), name='add-stock'),
    path('sell/<str:ticker>', views.SellStockFromPortfolioView.as_view(), name='sell-stock'),
    path('populate', views.PortfolioView.as_view(), name='populate-portfolio'),
    path('search-name', views.SearchNameView.as_view(), name='search-name'),
    path('search-symbol', views.SearchSymbolView.as_view(), name='search-symbol')
]