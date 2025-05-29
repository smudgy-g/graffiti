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


@socketio.on('send_lines')
def handle_send_lines(data):
    """event listener when client draws a line"""
    emit("receive_lines", data, broadcast=True)
