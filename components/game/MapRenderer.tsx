import React from 'react';
import { CONSTANTS } from '../../game/constants';
import { INITIAL_MAP } from '../../game/mapData';
import './MapRenderer.css';

const MapRenderer: React.FC = () => {
    return (
        <div
            className="map-grid"
            style={{
                width: INITIAL_MAP[0].length * CONSTANTS.TILE_SIZE,
                height: INITIAL_MAP.length * CONSTANTS.TILE_SIZE,
                gridTemplateColumns: `repeat(${INITIAL_MAP[0].length}, ${CONSTANTS.TILE_SIZE}px)`,
            }}
        >
            {INITIAL_MAP.map((row, y) => (
                row.map((tileType, x) => (
                    <div
                        key={`${x}-${y}`}
                        className={`tile tile-${tileType}`}
                        style={{ width: CONSTANTS.TILE_SIZE, height: CONSTANTS.TILE_SIZE }}
                    />
                ))
            ))}
        </div>
    );
};

export default MapRenderer;
