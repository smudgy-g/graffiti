'use client';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import CircleIcon from '@mui/icons-material/Circle';

interface Props {
    brushSize: number;
    onSelect: (width: number) => void;
}

export const StrokeSelect = ({ brushSize, onSelect }: Props) => {
    const items = [
        { size: 6, value: 2 },
        { size: 10, value: 4 },
        { size: 14, value: 8 },
        { size: 18, value: 12 },
    ];

    const handleChange = (event: SelectChangeEvent) => {
        onSelect(Number(event.target.value));
    };
    return (
        <Box>
            <FormControl fullWidth>
                <InputLabel id="stroke-width-select-label">Size</InputLabel>
                <Select
                    labelId="stroke-width-select-label"
                    id="stroke-width-select"
                    value={String(brushSize)}
                    label="Age"
                    onChange={handleChange}
                >
                    {items.map((i) => (
                        <MenuItem
                            key={i.value}
                            value={i.value}
                            className="h-10"
                        >
                            <CircleIcon
                                sx={{ fontSize: i.size }}
                                className="mx-auto"
                            />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
};
