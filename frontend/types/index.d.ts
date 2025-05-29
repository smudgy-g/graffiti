export type TTool = 'pen' | 'eraser';

export interface ILine {
    tool: Tool;
    points: [number, number]; //[x, y]
    stroke: string; // line colour
}
