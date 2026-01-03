import { useState, useEffect, useCallback } from 'react';
import type { Position } from '../game/constants';
import { isWalkable } from '../game/mapData';

export const usePlayerMovement = (initialPosition: Position, onMove?: () => void) => {
    const [position, setPosition] = useState<Position>(initialPosition);
    const [direction, setDirection] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('DOWN');

    const move = useCallback((dx: number, dy: number) => {
        setPosition((prev) => {
            const newX = prev.x + dx;
            const newY = prev.y + dy;

            if (isWalkable(newX, newY)) {
                if (onMove) onMove();
                return { x: newX, y: newY };
            }
            return prev;
        });
    }, [onMove]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        switch (e.key) {
            case 'ArrowUp':
            case 'w':
                setDirection('UP');
                move(0, -1);
                break;
            case 'ArrowDown':
            case 's':
                setDirection('DOWN');
                move(0, 1);
                break;
            case 'ArrowLeft':
            case 'a':
                setDirection('LEFT');
                move(-1, 0);
                break;
            case 'ArrowRight':
            case 'd':
                setDirection('RIGHT');
                move(1, 0);
                break;
            default:
                break;
        }
    }, [move]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    return { position, direction };
};
