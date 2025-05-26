# SocketIO event handlers
from flask import request
from flask_socketio import emit, send
from app.extensions import socketio


@socketio.on('connect')
def test_connect(auth):
    """event listener when client connects to the server"""
    print(request.sid)
    print("client has connected")
    emit("connected",{"data":f"id: {request.sid} is connected"})


@socketio.on('disconnect')
def test_disconnect(reason):
    print('Client disconnected, reason:', reason)


@socketio.on('send_message')
def handle_message(data):
    """event listener when client types a message"""
    emit("recieve_message", data, broadcast=True)
