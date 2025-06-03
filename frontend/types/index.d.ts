export type Tool = 'pen' | 'eraser';

export interface Stroke {
    id: string;
    tool: Tool;
    points: number[];
    stroke: string;
    strokeWidth: number;
}
