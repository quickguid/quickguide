import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from dotenv import load_dotenv  # Import the load_dotenv function

# Load environment variables from the .env file
load_dotenv()

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'hjshjhdjah kjshkjdhjs'
    
    # Use JAWSDB_URL if available, otherwise fallback to localhost
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('JAWSDB_URL', 'mysql://root:Ar0966678@localhost/adobe5')
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
        return User.query.get(int(id))

    # Test database connection route
    @app.route('/test-db')
    def test_db():
        try:
            # Query the first user as a test
            user = User.query.first()
            if user:
                return f"Connected to the database! First user: {user.first_name} {user.last_name}"
            else:
                return "Connected to the database, but no users found."
        except Exception as e:
            return f"Failed to connect to the database. Error: {str(e)}"

    return app
