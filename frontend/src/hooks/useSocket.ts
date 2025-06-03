import { useCallback, useEffect, useState } from 'react';
import type { Socket } from 'socket.io-client';
import type { Stroke } from 'types';

export default function (socket: Socket) {
    const [remoteStrokes, setRemoteStrokes] = useState<Stroke[]>([]);

    useEffect(() => {
        // MARK: SOcket lifecycle listeners
        socket.connect();

        socket.on('connect', () => {
            console.log('Socket.IO connected! (from handler)');
        });

        socket.on('connect_error', (err) => {
            console.error(
                'Socket.IO Connection error! (from handler):',
                err.message
            );
            console.error('Full error object:', err);
        });

        socket.on('disconnect', (reason) => {
            console.log(
                'Socket.IO disconnected, reason: (from handler)',
                reason
            );
        });

        socket.on('connected', (data) => {
            console.log('Server acknowledged connection: (from handler)', data);
        });

        // MARK: Application-specific message listeners
        function handleDrawing(payload: Stroke) {
            setRemoteStrokes((prevLines) => [...prevLines, payload]);
        }

        function handleClearCanvas() {
            console.log('clear canvas!!!');

            setRemoteStrokes([]);
        }

        socket.on('drawing', handleDrawing);
        socket.on('clear', handleClearCanvas);

        return function cleanup() {
            socket.off('connect');
            socket.off('connect_error');
            socket.off('disconnect');
            socket.off('connected');
            socket.off('drawing', handleDrawing);
            socket.off('clear', handleClearCanvas);
            socket.disconnect();
        };
    }, [socket]);

    // Memoize emitLine to prevent unnecessary re-renders if passed as a prop
    const emitStroke = useCallback(
        (payload: Stroke) => {
            socket.emit('on_drawing', payload);
        },
        [socket]
    );

    const clearCanvas = useCallback(() => {
        socket.emit('clear_canvas');
    }, [socket]);

    return {
        remoteStrokes,
        emitStroke,
        clearCanvas,
    };
}
