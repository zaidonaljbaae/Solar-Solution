from flask import Flask
from backend.config import Config
from backend.extensions import init_extensions
from dotenv import load_dotenv
import os

# Blueprints
from backend.routes.users_routes import users_bp
from backend.routes.governorate_routes import governorate_bp
from backend.routes.region_routes import regions_bp
from backend.routes.client_message_routes import client_message_bp
from backend.routes.auth_routes import auth_bp

def create_app():
    app = Flask(__name__)

    # Load config from .env
    app.config.from_object(Config)

    # Init extensions
    init_extensions(app)

    # Register routes
    app.register_blueprint(users_bp)
    app.register_blueprint(governorate_bp)
    app.register_blueprint(regions_bp)
    app.register_blueprint(client_message_bp)
    app.register_blueprint(auth_bp)

    return app

app = create_app()
