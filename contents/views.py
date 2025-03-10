import mimetypes
from flask import send_from_directory, current_app, render_template, flash, redirect, url_for
from flask.views import MethodView
from flask_login import current_user, login_user, logout_user, login_required


from .models import User
from .forms import LoginForm


class IndexView(MethodView):
    template_name = "index.html"

    def get(self, path=""):
        static_folder = current_app.static_folder

        if path and ("." in path):
            response = send_from_directory(static_folder, path)
            mimetype, _ = mimetypes.guess_type(path)

            if mimetype:
                response.headers["Content-Type"] = mimetype
            return response
        
        return send_from_directory(current_app.static_folder, self.template_name)
    

class LoginView(MethodView):
    template_name = "login.html"

    def get(self):
        if current_user.is_authenticated:
            if current_user.is_admin:
                return redirect(url_for("admin.index"))
            return redirect(url_for("index"))
        
        form = LoginForm()
        return render_template(self.template_name, form=form)
    
    def post(self):
        if current_user.is_authenticated:
            if current_user.is_admin:
                return redirect(url_for("admin.index"))
            return redirect(url_for("index"))
        
        form = LoginForm()

        if form.validate_on_submit():
            username = form.username.data
            password = form.password.data

            existing_user = User.query.filter_by(username=username).first()

            if not (existing_user and existing_user.check_password(password)):
                flash("Nom d'utilisateur ou mot de passe incorrect.", "danger")
                return redirect(url_for("login"))
            
            login_user(existing_user)

            if existing_user.is_admin:
                flash("Vous êtes connecté.", "success")
                return redirect(url_for("admin.index"))
            
            return redirect(url_for("index"))

        elif form.errors:
            for _, errors in form.errors.items():
                for error in errors:
                    flash(error, "danger")

        return render_template(self.template_name, form=form)
    

class LogoutView(MethodView):
    decorators = [login_required]

    def get(self):
        if current_user.is_authenticated:
            logout_user()
        return redirect(url_for("index"))