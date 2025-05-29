import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import type { TTool, ILine } from 'types';

interface DrawAreaProps {
    tool: TTool;
    // onToolChange: (newTool: TTool) => void;
    currentColour: string;
    // onCurrentColourChange: (newColour: string) => void;
    // onClear: () => void;
    lines: ILine[];
    onSetLines: (lines: ILine[]) => void;
    emitLine: (line: ILine) => void;
}
export default ({
    currentColour,
    lines,
    tool,
    onSetLines,
    emitLine,
}: DrawAreaProps) => {
    const isDrawing = useRef<boolean>(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
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
        onSetLines([
            ...lines,
            { tool, points: [pos.x, pos.y], stroke: currentColour },
        ]);
    };

    const handleMouseMove = (e: any) => {
        // no drawing - skipping
        if (!isDrawing.current) {
            return;
        }
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
        let lastLine = lines[lines.length - 1];
        // add point
        lastLine.points = lastLine.points.concat([point.x, point.y]) as [
            number,
            number,
        ];

        // replace last
        lines.splice(lines.length - 1, 1, lastLine);
        onSetLines(lines.concat());
        emitLine(lastLine);
    };

    const handleMouseUp = () => {
        isDrawing.current = false;
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
                className="cursor-crosshair"
            >
                <Layer>
                    {lines.map((line, i) => (
                        <Line
                            key={i}
                            points={line.points}
                            stroke={line.stroke}
                            strokeWidth={line.tool === 'eraser' ? 10 : 5}
                            tension={0.5}
                            lineCap="round"
                            lineJoin="round"
                            globalCompositeOperation={
                                line.tool === 'eraser'
                                    ? 'destination-out'
                                    : 'source-over'
                            }
                        />
                    ))}
                </Layer>
            </Stage>
        </div>
    );
};
