from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from registeraccountapp.models import AccountDatabase


class ForumPost(models.Model):
    author = models.ForeignKey(
        AccountDatabase, on_delete=models.CASCADE, related_name="posts"
    )
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class ForumComment(models.Model):
    post = models.ForeignKey(
        ForumPost, on_delete=models.CASCADE, related_name="comments"
    )
    author = models.ForeignKey(
        AccountDatabase, on_delete=models.CASCADE, related_name="comments"
    )
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.author.username} on {self.post.title}"


class Vote(models.Model):
    user = models.ForeignKey(
        AccountDatabase, on_delete=models.CASCADE, related_name="votes"
    )
    value = models.SmallIntegerField()  # +1 for upvote, -1 for downvote

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey("content_type", "object_id")

    class Meta:
        unique_together = (
            "user",
            "content_type",
            "object_id",
        )  # prevent multiple votes by same user on same object

    def __str__(self):
        return f"{self.user.username} voted {self.value} on {self.content_object}"
