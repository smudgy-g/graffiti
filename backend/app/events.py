# SocketIO event handlers
from flask import request
from flask_socketio import emit, send
from app.extensions import socketio


@socketio.on('connect')
def test_connect(auth):
    """event listener when client connects to the server"""
    emit("connected",{"data":f"id: {request.sid} is connected"})


@socketio.on('disconnect')
def test_disconnect(reason):
    print('Client disconnected, reason:', reason)


@socketio.on('on_drawing')
def handle_emit_stroke(data):
    """event listener when client draws a line"""
    emit("drawing", data, broadcast=True, include_self=False)

@socketio.on('clear_canvas')
def handle_clear_canvas():
    """event listener when client clears the canvas"""
    emit("clear", broadcast=True, include_self=True)
