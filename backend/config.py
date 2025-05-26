import os


basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY='e2dcf3fb6ed77dfb1ddfc72aede3f7bebe6b18f68d4af5f84683461c730ba1d5'
    SQLALCHEMY_DATABASE_URI='sqlite:///' + os.path.join(basedir, 'instance', 'app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False