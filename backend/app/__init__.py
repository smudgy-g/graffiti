from flask import Flask
import os

from app.extensions import socketio
from app.routes import bp as bp_auth
from config import Config


def create_app():
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(Config)

    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    socketio.init_app(app)
    app.register_blueprint(bp_auth)
    
    from . import events

    return app

