import { socket } from '@/socket';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/')({
    component: App,
    loader: async () => {
        const res = await fetch('/api/auth/test');
        return await res.json();
    },
});

function App() {
    const { data } = Route.useLoaderData();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<any[]>([]);

    const handleText = (e: any) => {
        const inputMessage = e.target.value;
        setMessage(inputMessage);
    };

    const handleSubmit = () => {
        if (!message) {
            return;
        }
        socket.emit('send_message', message);
        setMessage('');
    };

    useEffect(() => {
        // Connection lifecycle events
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

        // Application-specific message listeners
        const handleReceiveMessage = (incomingData: string) => {
            setMessages((prevMessages) => [...prevMessages, incomingData]);
        };
        socket.on('recieve_message', handleReceiveMessage);

        return function cleanup() {
            socket.off('connect');
            socket.off('connect_error');
            socket.off('disconnect');
            socket.off('connected');
            socket.off('recieve_message', handleReceiveMessage);
            socket.disconnect();
        };
    }, []);

    return (
        <div className="text-center">
            <main className="min-h-screen flex flex-col space-y-4 items-center justify-center bg-[#282c34] text-white">
                <p>{data}</p>

                <input type="text" value={message} onChange={handleText} />
                <button onClick={handleSubmit}>submit</button>
                <ul className="list-disc">
                    {messages.map((msg, i) => {
                        return <li key={i}>{msg}</li>;
                    })}
                </ul>
            </main>
        </div>
    );
}
