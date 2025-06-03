import React from 'react';
import type { Stroke, Tool } from 'types';

interface DrawAreaProps {
    tool: Tool;
    currentColour: string;
    lines: Stroke[];
    brushSize: number;
    onSetLines: (lines: Stroke[]) => void;
    emitLine: (line: Stroke) => void;
}

interface ReturnType {
    handleMouseDown: (e: any) => void;
    handleMouseMove: (e: any) => void;
    handleMouseUp: () => void;
}

function useDraw({
    currentColour,
    emitLine,
    lines,
    onSetLines,
    brushSize,
    tool,
}: DrawAreaProps): ReturnType {
    const isDrawing = React.useRef<boolean>(false);

    const handleMouseDown = (e: any) => {
        isDrawing.current = true;
        const pos = e.target.getStage().getPointerPosition();
        onSetLines([
            ...lines,
            {
                tool,
                points: [pos.x, pos.y],
                stroke: currentColour,
                brushSize: brushSize,
            },
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

    return {
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
    };
}

export default useDraw;
