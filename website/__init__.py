from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
import os


db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'hjshjhdjah kjshkjdhjs'
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('mysql://fb7d44wlpxshifyo:so77r3i5bv82rt89@d6q8diwwdmy5c9k9.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/jjtl9wgwpao1sh9w')  # Use JawsDB URL
    app.config['USER_EMAIL_SENDER_EMAIL'] = 'Ar0966678@gmail.com'
    app.config['USER_ENABLE_EMAIL'] = True

    db.init_app(app)

    from .views import views
    from .auth import auth

    app.register_blueprint(views, url_prefix='/')
    app.register_blueprint(auth, url_prefix='/')

    from .models import User

    with app.app_context():
        db.create_all()

    login_manager = LoginManager()
    login_manager.login_view = 'auth.login'
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(id):
        return User.query.get(int(id))  # if this changes to a string, remove int
    
    return app