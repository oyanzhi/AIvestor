from django.urls import path
from . import views

urlpatterns = [
    path('addstock', views.AddStockToPortfolioView.as_view(), name='add-stock'),
    path('remove/<str:ticker>', views.RemoveStockFromPortfolioView.as_view(), name='remove-stock'),
    path('populate', views.PortfolioView.as_view(), name='populate-portfolio'),
    path('search-name', views.SearchNameView.as_view(), name='search-name'),
    path('search-symbol', views.SearchSymbolView.as_view(), name='search-symbol'),

]