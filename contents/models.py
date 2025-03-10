from datetime import datetime, timezone
from slugify import slugify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

from .settings import db 


class Post(db.Model):
    __tablename__ = "posts"
    title = db.Column(db.String(255), nullable=False, unique=True)
    slug = db.Column(db.String(255), primary_key=True)
    author = db.Column(db.String(100), nullable=False, default="Admin")
    resume = db.Column(db.Text(500), nullable=False)
    content = db.Column(db.Text(), nullable=False)
    image = db.Column(db.Unicode(128), nullable=True)
    views = db.Column(db.Integer(), default=0)
    link = db.Column(db.String(255), nullable=True, default="https://github.com/codewithmpia")
    created_at = db.Column(db.DateTime(), default=datetime.now(timezone.utc))
    publish = db.Column(db.Boolean(), default=False)
    comments = db.relationship("Comment", backref="post")

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def generate_slug(self):
        if self.title:
            self.slug = slugify(self.title)
        else:
            self.slug = ""

    def __str__(self):
        return self.title


class Comment(db.Model):
    __tablename__ = "comments"
    id = db.Column(db.Integer(), primary_key=True)
    post_slug = db.Column(db.String(255), db.ForeignKey("posts.slug"))
    name = db.Column(db.String(100), nullable=False)
    message = db.Column(db.Text(), nullable=False)
    created_at = db.Column(db.DateTime(), default=datetime.now(timezone.utc))
    active = db.Column(db.Boolean(), default=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def __str__(self):
        return f"Commentaire de {self.name}"
    

class User(UserMixin, db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer(), primary_key=True)
    username = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(255))
    is_admin = db.Column(db.Boolean(), default=False)

    def __init__(self, username, password):
        self.username = username
        self.password = generate_password_hash(password)

    def check_password(self, password2):
        return check_password_hash(self.password, password2)
    
    @property
    def is_authenticated(self):
        return True

    @property
    def is_active(self):
        return True
    
    def __str__(self):
        return self.username
    