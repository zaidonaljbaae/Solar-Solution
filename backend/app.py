from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from backend.config import Config

db = SQLAlchemy()
migrate = Migrate()


def create_app():
    app = Flask(__name__)

    # Load config
    app.config.from_object(Config)

    # Init DB
    db.init_app(app)

    # Init Migrate
    migrate.init_app(app, db)

    # Register Blueprints
    from backend.routes.users_routes import users_bp
    from backend.routes.governorate_routes import governorate_bp
    from backend.routes.region_routes import regions_bp
    from backend.routes.client_message_routes import client_message_bp

    app.register_blueprint(users_bp)
    app.register_blueprint(governorate_bp)
    app.register_blueprint(regions_bp)
    app.register_blueprint(client_message_bp)

    return app


app = create_app()
