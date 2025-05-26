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
        socket.connect();
        // --- DIAGNOSTIC LOGS START ---
        console.log('useEffect is running!'); // 1. Confirm useEffect execution
        console.log('Socket instance from useEffect:', socket); // 2. Check the imported socket object
        console.log(
            'Socket connection status (at useEffect start):',
            socket.connected
        ); // 3. Check initial connection status
        console.log('Socket target URI (from useEffect):', socket.io.uri); // 4. Confirm the target URL
        // --- DIAGNOSTIC LOGS END ---

        // 1. Connection lifecycle events
        socket.on('connect', () => {
            console.log('Socket.IO connected! (from handler)'); // This should log if successful
        });

        socket.on('connect_error', (err) => {
            console.error(
                'Socket.IO Connection error! (from handler):',
                err.message
            ); // **THIS IS THE MOST IMPORTANT LOG TO CHECK!**
            console.error('Full error object:', err); // Log the full error for more details
        });

        socket.on('disconnect', (reason) => {
            console.log(
                'Socket.IO disconnected, reason: (from handler)',
                reason
            );
        });

        // 2. Custom server-acknowledged connection event (if your server emits it)
        socket.on('connected', (data) => {
            console.log('Server acknowledged connection: (from handler)', data);
        });

        // 3. Application-specific message listeners
        const handleReceiveMessage = (incomingData) => {
            setMessages((prevMessages) => [...prevMessages, incomingData]);
        };
        socket.on('recieve_message', handleReceiveMessage);

        // --- Cleanup function ---
        return function cleanup() {
            console.log('useEffect cleanup running!'); // Confirm cleanup execution
            socket.off('connect');
            socket.off('connect_error');
            socket.off('disconnect');
            socket.off('connected');
            socket.off('recieve_message', handleReceiveMessage);
            socket.disconnect();
        };
    }, []); // Empty dependency array: runs once on mount, cleans up on unmount

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
