import { useEffect, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import PersonIcon from '@mui/icons-material/Person';
import Button from '@mui/material/Button';
import DrawArea from '@/components/DrawArea';
import DrawTools from '@/components/DrawTools';
import { socket } from '@/socket';
import type { ILine, TTool } from 'types';
import useSocket from '@/hooks/useSocket';

export const Route = createFileRoute('/')({
    component: App,
    // loader: async () => {
    //     const res = await fetch('/api/auth/test');
    //     return await res.json();
    // },
});

function App() {
    // const { data } = Route.useLoaderData();
    const [tool, setTool] = useState<TTool>('pen');
    const [currentColour, setCurrentColour] = useState<string>('#183de7');
    const [allLines, setAllLines] = useState<ILine[]>([]);

    const { remoteLines, emitLine } = useSocket(socket);

    const handleClearStage = () => {
        setAllLines([]);
    };

    const handleColourChange = (colour: string) => {
        setCurrentColour(colour);
    };

    const handleToolChange = (tool: TTool) => {
        setTool(tool);
    };

    const handleSetAllLines = (lines: ILine[]) => {
        setAllLines(lines);
    };

    useEffect(() => {
        // When new remote lines come in, update the combined drawing lines
        // This effect will run whenever allRemoteLines changes.
        setAllLines(remoteLines);
    }, [remoteLines]);

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
                        onClear={handleClearStage}
                        onCurrentColourChange={handleColourChange}
                        onToolChange={handleToolChange}
                    />
                </div>
                <Button variant="outlined">
                    <PersonIcon />
                </Button>
            </header>

            <DrawArea
                currentColour={currentColour}
                lines={allLines}
                tool={tool}
                onSetLines={handleSetAllLines}
                emitLine={emitLine}
            />
        </main>
    );
}
