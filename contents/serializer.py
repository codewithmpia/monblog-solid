from flask import url_for
from marshmallow import post_dump, pre_dump
from .settings import ma
from .models import Post, Comment


class CommentSerializer(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Comment
        include_fk = True
        fields = ("id", "post_slug", "name", "message", "created_at", "active")


class PostSerializer(ma.SQLAlchemyAutoSchema):
    comments = ma.Nested(CommentSerializer, many=True)
    image_url = ma.String(dump_only=True) 

    class Meta:
        model = Post
        include_relationships = True
        fields = (
            "title", 
            "slug", 
            "author", 
            "resume", 
            "content", 
            "image_url", 
            "views", 
            "link",
            "created_at", 
            "publish", 
            "comments"
        )

    def get_active_comments(self, comments):
        return [comment for comment in comments if comment.get("active", False)]

    @post_dump(pass_many=True)
    def filter_comments(self, data, many, **kwargs):
        if many:
            for item in data:
                if "comments" in item:
                    item["comments"] = self.get_active_comments(item["comments"])
        else:
            if "comments" in data:
                data["comments"] = self.get_active_comments(data["comments"])
        return data

    @pre_dump
    def add_image_url(self, data, **kwargs):
        if isinstance(data, Post):
            data.image_url = url_for('static', filename=f"posts/{data.image}", _external=True)
        return data

# Instantiate serializers
posts_serializer = PostSerializer(many=True)
post_serializer = PostSerializer()