from app import create_app
from app.extensions import socketio

import sys
import os

# Add the parent directory to the sys.path so Python can find 'app' and 'config'
# This is crucial when running a script that imports from its sibling directories
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__))))

app = create_app()


if __name__ == '__main__':
    socketio.run(app, debug=True, allow_unsafe_werkzeug=True)