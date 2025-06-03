import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import DrawArea from '@/components/draw-area';
import DrawTools from '@/components/draw-tools';
import { socket } from '@/lib/socket';
import type { Stroke, Tool } from 'types';
import useSocket from '@/hooks/useSocket';
import { Button } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
// import useStateHistory from '@/hooks/useStateHistory';

export const Route = createFileRoute('/')({
    component: App,
    // loader: async () => {
    //     const res = await fetch('/api/auth/test');
    //     return await res.json();
    // },
});

function App() {
    // const { data } = Route.useLoaderData();
    const [tool, setTool] = React.useState<Tool>('pen');
    const [currentColour, setCurrentColour] = React.useState<string>('#183de7');
    const [brushSize, setBrushSize] = React.useState<number>(2);

    const [localStrokes, setLocalStrokes] = React.useState<Stroke[]>([]);
    const [currentLocalStrokeIndex, setCurrentLocalStrokeIndex] =
        React.useState(-1);

    const { remoteStrokes, emitStroke, clearCanvas } = useSocket(socket);

    const undo = () => {
        setCurrentLocalStrokeIndex((prev) => Math.max(-1, prev - 1));
    };

    const redo = () => {
        setCurrentLocalStrokeIndex((prev) =>
            Math.min(localStrokes.length - 1, prev + 1)
        );
    };

    const handleClearCanvas = () => {
        clearCanvas();
        setLocalStrokes([]);
        setCurrentLocalStrokeIndex(-1);
    };

    return (
        <main className="h-screen flex flex-col items-center bg-white text-slate-950">
            <header className="p-4 flex items-center gap-6 border-b w-full justify-between">
                <h1 className="text-4xl font-semibold logo text-shadow-lg">
                    Graffiti
                </h1>
                <div className="flex items-center gap-6">
                    <DrawTools
                        tool={tool}
                        currentColour={currentColour}
                        brushSize={brushSize}
                        onColourChange={setCurrentColour}
                        onToolChange={setTool}
                        onBrushSizeChange={setBrushSize}
                        onClear={handleClearCanvas}
                        onRedo={redo}
                        onUndo={undo}
                    />
                </div>
                <Button variant="outlined">
                    <PersonIcon />
                </Button>
            </header>

            <DrawArea
                remoteStrokes={remoteStrokes}
                localStrokes={localStrokes}
                currentColour={currentColour}
                tool={tool}
                brushSize={brushSize}
                onSetLocalStrokes={setLocalStrokes}
                emitStroke={emitStroke}
                currentLocalStrokeIndex={currentLocalStrokeIndex}
                setCurrentLocalStrokeIndex={setCurrentLocalStrokeIndex}
            />
        </main>
    );
}
