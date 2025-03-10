import os 
from pathlib import Path
from datetime import timedelta

from flask import Flask, g
from flask_sqlalchemy import SQLAlchemy
from flask_admin import Admin
from flask_restful import Api
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from flask_login import LoginManager, current_user

def get_env_variable(name):
    try:
        return os.environ[name]
    except KeyError:
        message = f"La variable d'environnement {name} n'est pas définie."
        raise Exception(message)

BASE_DIR = Path(__file__).resolve().parent

app = Flask(
    __name__,
    static_folder=BASE_DIR / "static",
    template_folder=BASE_DIR / "templates"
)

# Secret key
app.config["SECRET_KEY"] = get_env_variable("SECRET_KEY")

# Session lifetime
app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(minutes=5)

# Database
app.config["SQLALCHEMY_DATABASE_URI"] = get_env_variable("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

# Api
api = Api(app)

# Marshmallow
ma = Marshmallow(app)

# Cors
CORS(app, resources={
    r"/api/posts/": {"origins": "*"},
    r"/api/posts/<string:slug>/": {"origins": "*"}
})

# Flask_Login
from .models import User

login_manager = LoginManager(app)
login_manager.login_view = "login"
login_manager.login_message = "La connexion est requise."

@login_manager.user_loader
def load_user(id):
    return User.query.get(id)

@app.before_request
def get_current_user():
    g.user = current_user

# Admin 
from .models import Post, Comment
from .admin import (
    CustomAdminIndexView, 
    PostAdminView, CommentAdminView
)

admin = Admin(
    app, 
    name="codewithmpia",
    index_view=CustomAdminIndexView(
        name="Tableau de bord",
        template="admin/index.html"
    )
)

admin.add_views(
    PostAdminView(Post, db.session),
    CommentAdminView(Comment, db.session)
)

# Routes and views
from .views import IndexView, LoginView, LogoutView
from .routes import PostListView, PostDetailView

app.add_url_rule("/", view_func=IndexView.as_view(name="index"), defaults={"path": ""})
app.add_url_rule("/<path:path>/", view_func=IndexView.as_view(name="index_path"))
app.add_url_rule("/login/", view_func=LoginView.as_view(name="login"))
app.add_url_rule("/logout/", view_func=LogoutView.as_view(name="logout"))

api.add_resource(PostListView, "/api/posts/")
api.add_resource(PostDetailView, "/api/posts/<string:slug>/")




