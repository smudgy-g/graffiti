import React from 'react';

interface HistoryControls<T> {
    index: number;
    history: T[];
    setHistory: React.Dispatch<React.SetStateAction<T[]>>;
    undo: () => void;
    redo: () => void;
}

type UseStateHistoryReturn<T> = [T, (newState: T) => void, HistoryControls<T>];

function useStateHistory<T>(
    initialValue?: T | (() => T)
): UseStateHistoryReturn<T> {
    const [history, setHistory] = React.useState<T[]>(() =>
        initialValue === undefined
            ? []
            : [initialValue instanceof Function ? initialValue() : initialValue]
    );
    const [index, setIndex] = React.useState(0);

    const state = history[index];

    function setState(newState: T) {
        setHistory((prevHistory) =>
            prevHistory.slice(0, index + 1).concat(newState)
        );
        setIndex((prevIndex) => prevIndex + 1);
    }

    function undo() {
        if (index > 0) {
            console.log('undo: setting index', index - 1);

            setIndex((prevIndex) => prevIndex - 1);
        }
    }

    function redo() {
        if (index < history.length - 1) {
            console.log('redo: setting index', index + 1);
            setIndex((prevIndex) => prevIndex + 1);
        }
    }

    return [
        state,
        setState,
        {
            index,
            history,
            setHistory,
            undo,
            redo,
        },
    ];
}

export default useStateHistory;
