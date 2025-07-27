from rest_framework import serializers
from .models import ForumPost, ForumComment, Vote
from django.contrib.contenttypes.models import ContentType
from django.db.models import Sum


class ForumCommentSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source="author.username", read_only=True)
    votes = serializers.SerializerMethodField()
    user_vote = serializers.SerializerMethodField()

    class Meta:
        model = ForumComment
        fields = [
            "id",
            "author_username",
            "content",
            "created_at",
            "votes",
            "user_vote",
        ]
        read_only_fields = ["post", "author_username", "created_at", "votes"]

    def get_votes(self, obj):
        votes_sum = Vote.objects.filter(
            content_type=ContentType.objects.get_for_model(obj), object_id=obj.id
        ).aggregate(total=Sum("value"))["total"]
        return votes_sum or 0

    def get_user_vote(self, obj):
        request = self.context.get("request")
        if not request or request.user.is_anonymous:
            return 0
        vote = Vote.objects.filter(
            user=request.user,
            content_type=ContentType.objects.get_for_model(obj),
            object_id=obj.id,
        ).first()
        return vote.value if vote else 0


class ForumPostSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source="author.username", read_only=True)
    comments = ForumCommentSerializer(many=True, read_only=True)
    votes = serializers.SerializerMethodField()
    user_vote = serializers.SerializerMethodField()

    class Meta:
        model = ForumPost
        fields = [
            "id",
            "title",
            "content",
            "author_username",
            "created_at",
            "comments",
            "votes",
            "user_vote",
        ]
        read_only_fields = ["author_username", "created_at", "votes", "user_vote"]

    def get_votes(self, obj):
        votes_sum = Vote.objects.filter(
            content_type=ContentType.objects.get_for_model(obj), object_id=obj.id
        ).aggregate(total=Sum("value"))["total"]
        return votes_sum or 0

    def get_user_vote(self, obj):
        request = self.context.get("request")
        if not request or request.user.is_anonymous:
            return 0

        vote = Vote.objects.filter(
            user=request.user,
            content_type=ContentType.objects.get_for_model(obj),
            object_id=obj.id,
        ).first()
        return vote.value if vote else 0


class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = ["id", "value", "content_type", "object_id"]
