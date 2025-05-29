import { useRef } from 'react';
import IconButton from '@mui/material/IconButton';
import ColorizeIcon from '@mui/icons-material/Colorize';

export default function CustomColourPicker({ colour, onChange }: any) {
    const colorInputRef = useRef<HTMLInputElement>(null);

    const openColourPicker = () => {
        if (colorInputRef.current) {
            colorInputRef.current.click();
        }
    };

    return (
        <div
            className="relative outline-2 rounded-full"
            style={{ outlineColor: colour }}
        >
            <IconButton onClick={openColourPicker} size="large">
                <ColorizeIcon />
            </IconButton>

            {/* The hidden native color input */}
            <input
                ref={colorInputRef}
                type="color"
                name="color"
                id="color"
                onChange={(e) => onChange(e.target.value)}
                value={colour}
                className="sr-only"
                aria-label="Color picker"
            />

            {/* Optional: Display the currently selected color */}
            <div
                className="w-4 h-4 rounded-full absolute right-0 bottom-0"
                style={{ backgroundColor: colour }}
                title={`Selected color: ${colour}`}
            ></div>
        </div>
    );
}
