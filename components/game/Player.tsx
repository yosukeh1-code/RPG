import React from 'react';
import { CONSTANTS } from '../../game/constants';
import type { Position } from '../../game/constants';
import './Player.css';

type PlayerProps = {
    position: Position;
    direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
};

const Player: React.FC<PlayerProps> = ({ position, direction }) => {
    return (
        <div
            className={`player player-${direction.toLowerCase()}`}
            style={{
                width: CONSTANTS.TILE_SIZE,
                height: CONSTANTS.TILE_SIZE,
                transform: `translate(${position.x * CONSTANTS.TILE_SIZE}px, ${position.y * CONSTANTS.TILE_SIZE}px)`,
            }}
        >
            <div className="player-sprite" />
        </div>
    );
};

export default Player;
