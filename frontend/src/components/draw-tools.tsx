import type { Tool } from 'types';
import ColourPicker from '@/components/colour-picker';
import { StrokeSelect } from './stroke-select';
import EditIcon from '@mui/icons-material/Edit';
import AutoFixOffIcon from '@mui/icons-material/AutoFixOff';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';

import Button from '@mui/material/Button';
import { ButtonGroup } from '@mui/material';
import type React from 'react';

interface DrawToolsProps {
    tool: Tool;
    onToolChange: React.Dispatch<React.SetStateAction<Tool>>;
    currentColour: string;
    onColourChange: React.Dispatch<React.SetStateAction<string>>;
    brushSize: number;
    onBrushSizeChange: React.Dispatch<React.SetStateAction<number>>;
    onClear: () => void;
    onRedo: () => void;
    onUndo: () => void;
}

export default function DrawTools({
    tool,
    currentColour,
    brushSize,
    onToolChange,
    onColourChange,
    onBrushSizeChange,
    onClear,
    onRedo,
    onUndo,
}: DrawToolsProps) {
    return (
        <>
            <ToggleButtonGroup
                value={tool}
                exclusive
                onChange={(_, value) => onToolChange(value)}
                aria-label="text alignment"
            >
                <ToggleButton value="pen" aria-label="left aligned">
                    <EditIcon />
                </ToggleButton>
                <ToggleButton value="eraser" aria-label="centered">
                    <AutoFixOffIcon />
                </ToggleButton>
            </ToggleButtonGroup>

            <ButtonGroup>
                <Button size="large" className="size-12" onClick={onUndo}>
                    <UndoIcon />
                </Button>
                <Button size="large" className="size-12" onClick={onRedo}>
                    <RedoIcon />
                </Button>
            </ButtonGroup>

            <ColourPicker colour={currentColour} onChange={onColourChange} />

            <StrokeSelect brushSize={brushSize} onSelect={onBrushSizeChange} />

            <Button
                variant="outlined"
                size="large"
                color="error"
                onClick={onClear}
            >
                Clear
            </Button>
        </>
    );
}
