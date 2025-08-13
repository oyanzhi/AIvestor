from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .models import ForumPost, ForumComment, Vote
from .serializers import ForumPostSerializer, ForumCommentSerializer, VoteSerializer
from registeraccountapp.models import AccountDatabase
from django.contrib.contenttypes.models import ContentType


# List all forum posts / Create a new one
class ForumPostListCreateView(generics.ListCreateAPIView):
    queryset = ForumPost.objects.all().order_by("-created_at")
    serializer_class = ForumPostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


# Retrieve a specific post
class ForumPostDetailView(generics.RetrieveAPIView):
    queryset = ForumPost.objects.all()
    serializer_class = ForumPostSerializer
    permission_classes = [permissions.AllowAny]


# List and create comments for a post
class ForumCommentListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request, post_id):
        comments = ForumComment.objects.filter(post_id=post_id).order_by("created_at")
        serializer = ForumCommentSerializer(comments, many=True)
        return Response(serializer.data)

    def post(self, request, post_id):
        post = ForumPost.objects.filter(id=post_id).first()
        if not post:
            return Response(
                {"detail": "Post not found"}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = ForumCommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(post=post, author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VoteCreateUpdateView(APIView):
    def post(self, request):
        user = request.user
        value = request.data.get("value")
        content_type_id = request.data.get("content_type")
        object_id = request.data.get("object_id")

        if value not in [1, -1]:
            return Response(
                {"detail": "Invalid vote value."}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            content_type = ContentType.objects.get(id=content_type_id)
            model_class = content_type.model_class()
            obj = model_class.objects.get(id=object_id)
        except (ContentType.DoesNotExist, model_class.DoesNotExist):
            return Response(
                {"detail": "Invalid content or object id."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        vote, created = Vote.objects.get_or_create(
            user=user,
            content_type=content_type,
            object_id=object_id,
            defaults={"value": value},
        )
        if not created:
            if vote.value == value:
                vote.delete()
                return Response({"detail": "Vote removed."}, status=status.HTTP_200_OK)
            else:
                vote.value = value
                vote.save()

        serializer = VoteSerializer(vote)
        return Response(serializer.data, status=status.HTTP_200_OK)
