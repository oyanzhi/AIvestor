from django.urls import path
from .views import PredictStockAppView

urlpatterns = [
    path('stockmodelrequest/', PredictStockAppView.as_view(), name='predictstocklist'), # URL for the register account API endpoint
]
