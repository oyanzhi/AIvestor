from django.urls import path
from .views import (
    ForumPostListCreateView,
    ForumPostDetailView,
    ForumCommentListCreateView,
    VoteCreateUpdateView,
)

urlpatterns = [
    path("posts/", ForumPostListCreateView.as_view(), name="forum-post-list-create"),
    path("posts/create/", ForumPostListCreateView.as_view(), name="forum-post-create"),
    path("posts/<int:pk>/", ForumPostDetailView.as_view(), name="forum-post-detail"),
    path(
        "posts/<int:post_id>/comments/",
        ForumCommentListCreateView.as_view(),
        name="forum-comments",
    ),
    path("vote/", VoteCreateUpdateView.as_view(), name="vote"),
]
