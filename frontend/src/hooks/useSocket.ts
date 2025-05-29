import { useCallback, useEffect, useState } from 'react';
import type { Socket } from 'socket.io-client';
import type { ILine } from 'types';

export default function (socket: Socket) {
    const [remoteLines, setRemoteLines] = useState<ILine[]>([]);

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
        function handleReceiveLines(payload: ILine) {
            console.log('payload', payload);
            setRemoteLines((prevLines) => [...prevLines, payload]);
        }

        socket.on('receive_lines', handleReceiveLines);

        return function cleanup() {
            socket.off('connect');
            socket.off('connect_error');
            socket.off('disconnect');
            socket.off('connected');
            socket.off('receive_lines', handleReceiveLines);
            socket.disconnect();
        };
    }, [socket]);

    // Memoize emitLine to prevent unnecessary re-renders if passed as a prop
    const emitLine = useCallback(
        (payload: ILine) => {
            socket.emit('send_lines', payload);
        },
        [socket]
    ); // Dependency: socket

    return {
        remoteLines,
        emitLine,
    };
}
