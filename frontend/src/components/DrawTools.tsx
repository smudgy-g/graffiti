import type { TTool } from 'types';
// import { useRef } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import AutoFixOffIcon from '@mui/icons-material/AutoFixOff';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import ColourPicker from './ui/ColourPicker';
// import Popover from '@mui/material/Popover';

interface DrawToolsProps {
    tool: TTool;
    onToolChange: (newTool: TTool) => void;
    currentColour: string;
    onCurrentColourChange: (newColour: string) => void;
    onClear: () => void;
}

export default ({
    tool,
    currentColour,
    onToolChange,
    onCurrentColourChange,
    onClear,
}: DrawToolsProps) => {
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

            <ColourPicker
                colour={currentColour}
                onChange={onCurrentColourChange}
            />

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
};
