# Error handlers
from flask import request
from app.extensions import socketio

@socketio.on_error()        # Handles the default namespace
def error_handler(e):
    print(request.event["message"]) # "my error event"
    print(request.event["args"])    # (data,)
    pass

@socketio.on_error('/chat') # handles the '/chat' namespace
def error_handler_chat(e):
    print(request.event["message"]) # "my error event"
    print(request.event["args"])    # (data,)
    pass

@socketio.on_error_default  # handles all namespaces without an explicit error handler
def default_error_handler(e):
    print(request.event["message"]) # "my error event"
    print(request.event["args"])    # (data,)
    pass