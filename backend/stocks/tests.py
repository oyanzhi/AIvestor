from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.contenttypes.models import ContentType
from .models import Stock
from registeraccountapp.models import AccountDatabase
from rest_framework_simplejwt.tokens import RefreshToken

class SimpleStockViewTests(APITestCase):
    # initialization
    def setUp(self):
        self.user = AccountDatabase.objects.create_user(
            username="test", email="aloysius7m@gmail.com", password="testpassword123"
        )
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")

        Stock.objects.create(
            name="NVIDIA Corporation",
            ticker="NVDA",
            sector="Technology",
            industry="Semiconductors",
            current_price=100,
            previous_close=95,
            market_cap=1000000000,
        )
        
    def test_update_stocks_post(self):
        url = reverse('stockupdate')
        response = self.client.post(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"message": "Stock metrics updated."})

    def test_get_stock_success(self):
        url = reverse('getstock') + "?symbol=TSLA" 
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['ticker'], "TEST")

    def test_get_stock_no_symbol(self):
        url = reverse('getstock')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {"error": "Symbol query param is required."})

    def test_get_stock_not_found(self):
        url = reverse('getstock') + "?symbol=NOPE"
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json(), {"error": "Stock not found."})
