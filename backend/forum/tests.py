from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.contenttypes.models import ContentType
from .models import ForumPost, ForumComment, Vote
from registeraccountapp.models import AccountDatabase
from rest_framework_simplejwt.tokens import RefreshToken


class ForumTests(APITestCase):
    # initialization
    def setUp(self):
        self.user = AccountDatabase.objects.create_user(
            username="test", email="aloysius7m@gmail.com", password="testpassword123"
        )
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")

        self.post = ForumPost.objects.create(
            author=self.user, title="Test Post", content="Test content"
        )

    def test_create_post(self):
        url = reverse("forum-post-list-create")
        data = {"title": "New Post", "content": "This is a new forum post"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], "New Post")

    def test_list_posts(self):
        url = reverse("forum-post-list-create")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_retrieve_post_detail(self):
        url = reverse("forum-post-detail", kwargs={"pk": self.post.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], self.post.id)

    def test_add_comment(self):
        url = reverse("forum-comments", kwargs={"post_id": self.post.id})
        data = {"content": "This is a test comment"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["content"], "This is a test comment")

    def test_list_comments(self):
        ForumComment.objects.create(
            post=self.post, author=self.user, content="Comment 1"
        )
        url = reverse("forum-comments", kwargs={"post_id": self.post.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)
