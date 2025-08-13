from django.contrib import admin
from .models import ForumPost, ForumComment

admin.site.register(ForumPost)
admin.site.register(ForumComment)
