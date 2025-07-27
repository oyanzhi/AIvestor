from rest_framework.test import APITestCase
from rest_framework import status
from registeraccountapp.models import AccountDatabase
from django.contrib.auth.hashers import make_password
from rest_framework.authtoken.models import Token


class ProfileUpdateTestCase(APITestCase):

    # initialization
    def setUp(self):
        self.user = AccountDatabase.objects.create_user(
            username="test", email="aloysius7m@gmail.com", password="testpassword123"
        )
        self.url = "/profileUpdateRequest/update/"
        self.token = Token.objects.create(user=self.user)

    # helper to test authenticated user
    def auth_header(self):
        return {"HTTP_AUTHORIZATION": f"Token {self.token.key}"}

    # TEST 1
    def test_successful_profile_update(self):
        response = self.client.post(
            self.url,
            {
                "display_name": "Updated Display",
                "username": "updateduser",
                "password": "newsecurepassword123",
                "confirmpassword": "newsecurepassword123",
                "risk_tolerance": "High",
                "alert_threshold": 20,
            },
            format="json",
            **self.auth_header(),
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("message", response.data)

    # TEST 2
    def test_password_too_short(self):
        response = self.client.post(
            self.url,
            {
                "username": "updateduser",
                "password": "short",
                "confirmpassword": "short",
                "risk_tolerance": "Low",
                "alert_threshold": 5,
            },
            format="json",
            **self.auth_header(),
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("non_field_errors", response.data)

    # TEST 3
    def test_passwords_do_not_match(self):
        response = self.client.post(
            self.url,
            {
                "username": "updateduser",
                "password": "newsecurepassword123",
                "confirmpassword": "differentpassword",
                "risk_tolerance": "Low",
                "alert_threshold": 5,
            },
            format="json",
            **self.auth_header(),
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("non_field_errors", response.data)

    # TEST 4
    def test_duplicate_username(self):
        # Create another user with the target username
        AccountDatabase.objects.create(
            username="existinguser",
            email="existing@example.com",
            password=make_password("anotherpassword"),
        )

        response = self.client.post(
            self.url,
            {
                "username": "existinguser",
                "password": "newsecurepassword123",
                "confirmpassword": "newsecurepassword123",
                "risk_tolerance": "Medium",
                "alert_threshold": 10,
            },
            format="json",
            **self.auth_header(),
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("username", response.data)

    # TEST 5
    def test_unauthenticated_access(self):
        response = self.client.post(
            self.url,
            {
                "username": "unauthuser",
                "password": "irrelevant",
                "confirmpassword": "irrelevant",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
