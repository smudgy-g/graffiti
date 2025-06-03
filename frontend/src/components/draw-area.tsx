import React from 'react';
import { Stage, Layer, Line } from 'react-konva';
import type { Tool, Stroke } from 'types';

interface DrawAreaProps {
    localStrokes: Stroke[];
    remoteStrokes: Stroke[];
    tool: Tool;
    currentColour: string;
    brushSize: number;
    onSetLocalStrokes: React.Dispatch<React.SetStateAction<Stroke[]>>;
    emitStroke: (stroke: Stroke) => void;
    currentLocalStrokeIndex: number;
    setCurrentLocalStrokeIndex: React.Dispatch<React.SetStateAction<number>>;
}

export default function ({
    localStrokes,
    remoteStrokes,
    currentColour,
    tool,
    brushSize,
    currentLocalStrokeIndex,
    onSetLocalStrokes,
    emitStroke,
    setCurrentLocalStrokeIndex,
}: DrawAreaProps) {
    const isDrawing = React.useRef<boolean>(false);
    const [activeDrawingStroke, setActiveDrawingStroke] =
        React.useState<Stroke | null>(null);

    const containerRef = React.useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

    React.useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight,
                });
            }
        };
        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => {
            window.removeEventListener('resize', updateDimensions);
        };
    }, []);

    const handleMouseDown = (e: any) => {
        isDrawing.current = true;
        const pos = e.target.getStage().getPointerPosition();

        setActiveDrawingStroke({
            id: crypto.randomUUID(),
            tool,
            points: [pos.x, pos.y],
            stroke: currentColour,
            strokeWidth: brushSize,
        });
    };

    const handleMouseMove = (e: any) => {
        if (!isDrawing.current) {
            return;
        }
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();

        setActiveDrawingStroke((prev) => {
            if (!prev) return null;
            return {
                ...prev,
                points: [...prev.points, point.x, point.y],
            };
        });
    };

    const handleMouseUp = () => {
        if (!isDrawing.current || !activeDrawingStroke) return;

        isDrawing.current = false;
        if (activeDrawingStroke.points.length > 2) {
            onSetLocalStrokes((prev) => {
                const newHistory = prev.slice(0, currentLocalStrokeIndex + 1);
                return [...newHistory, activeDrawingStroke];
            });
            setCurrentLocalStrokeIndex((prev) => prev + 1);
            emitStroke(activeDrawingStroke);
        }
        setActiveDrawingStroke(null);
    };

    const handleMouseLeave = () => {
        if (isDrawing.current) {
            handleMouseUp();
        }
    };

    return (
        <div ref={containerRef} className="flex-grow w-full">
            <Stage
                width={dimensions.width}
                height={dimensions.height}
                onMouseDown={handleMouseDown}
                onMousemove={handleMouseMove}
                onMouseup={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchMove={handleMouseMove}
                onTouchEnd={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                className="cursor-crosshair"
            >
                <Layer>
                    {remoteStrokes.map((stroke) => (
                        <Line
                            key={stroke.id}
                            points={stroke.points}
                            stroke={stroke.stroke}
                            strokeWidth={stroke.strokeWidth}
                            tension={0.5}
                            lineCap="round"
                            lineJoin="round"
                            globalCompositeOperation={
                                stroke.tool === 'eraser'
                                    ? 'destination-out'
                                    : 'source-over'
                            }
                        />
                    ))}
                </Layer>
                <Layer>
                    {/* Only render local strokes up to the currentLocalStrokeIndex for undo/redo */}
                    {localStrokes
                        .slice(0, currentLocalStrokeIndex + 1)
                        .map((stroke) => (
                            <Line
                                key={stroke.id}
                                points={stroke.points}
                                stroke={stroke.stroke}
                                strokeWidth={stroke.strokeWidth}
                                tension={0.5}
                                lineCap="round"
                                lineJoin="round"
                                globalCompositeOperation={
                                    stroke.tool === 'eraser'
                                        ? 'destination-out'
                                        : 'source-over'
                                }
                            />
                        ))}
                    {/* Render the actively drawn line for immediate feedback (not yet in history) */}
                    {activeDrawingStroke && (
                        <Line
                            points={activeDrawingStroke.points}
                            stroke={activeDrawingStroke.stroke}
                            strokeWidth={activeDrawingStroke.strokeWidth}
                            tension={0.5}
                            lineCap="round"
                            lineJoin="round"
                            globalCompositeOperation={
                                activeDrawingStroke.tool === 'eraser'
                                    ? 'destination-out'
                                    : 'source-over'
                            }
                        />
                    )}
                </Layer>
            </Stage>
        </div>
    );
}
