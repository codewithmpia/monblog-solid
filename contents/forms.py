from flask_wtf import FlaskForm
from wtforms.fields import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired


class LoginForm(FlaskForm):
    username = StringField(
        label="Nom d'utilisateur",
        validators=[DataRequired(message="Le nom d'utilisateur est requis.")]
    )
    password = PasswordField(
        label="Mot de passe",
        validators=[DataRequired(message="Le mot de passe est requis.")]
    )
    submit = SubmitField(label="Se connecter")