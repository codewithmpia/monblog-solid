from flask import redirect, url_for
from flask_admin import AdminIndexView, expose
from flask_admin.form import FileUploadField
from flask_admin.contrib.sqla import ModelView
from flask_login import current_user

from .settings import BASE_DIR


class CustomAdminIndexView(AdminIndexView):
    """
        - Restrict access to the Admin 
        - Customize the administration homepage.
    """
    @expose("/")
    def index(self):
        if current_user.is_authenticated and current_user.is_admin:
            return super(CustomAdminIndexView, self).index()
        return redirect(url_for("login"))


class BaseModelMixin:
    def is_accessible(self):
        return current_user.is_authenticated and current_user.is_admin
    
    def inaccessible_callback(self, *args):
        return redirect(url_for('login'))
    

class PostAdminView(BaseModelMixin, ModelView):
    column_list = ["title", "created_at", "publish", "comments"]
    form_extra_fields = {
        "image": FileUploadField(
            label="Image",
            base_path=BASE_DIR / "static/posts"
        )
    }

    def on_model_change(self, form, model, is_created):
        if is_created:
            model.generate_slug()
        return super().on_model_change(form, model, is_created)
    

class CommentAdminView(BaseModelMixin, ModelView):
    column_list = ["name", "created_at", "active", "post_slug"]
