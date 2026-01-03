import React, { useState, useEffect } from 'react';
import './GameLayout.css';
import MapRenderer from '../game/MapRenderer';
import Player from '../game/Player';
import BattleScreen from '../battle/BattleScreen';
import { usePlayerMovement } from '../../hooks/usePlayerMovement';
import { useGameState } from '../../hooks/useGameState';
import { soundManager } from '../../game/SoundManager';
import { CONSTANTS } from '../../game/constants';

const GameLayout: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isBattling, setIsBattling] = useState(false);

    const { playerState, gainExp, takeDamage, healFull } = useGameState();

    // BGM Control
    useEffect(() => {
        if (isPlaying && !isBattling) {
            soundManager.playBGM('FIELD');
        } else if (!isPlaying) {
            soundManager.stopBGM();
        }
    }, [isPlaying, isBattling]);

    // Check for random encounter on every move
    const handleMove = () => {
        // 10% chance of encounter
        if (Math.random() < 0.1) {
            setTimeout(() => {
                setIsBattling(true);
            }, 200);
        }
    };

    const { position, direction } = usePlayerMovement({ x: 1, y: 1 }, !isBattling ? handleMove : undefined);

    // Camera Logic
    const { TILE_SIZE, MAP_WIDTH, MAP_HEIGHT } = CONSTANTS;
    const VIEWPORT_WIDTH = 800;
    const VIEWPORT_HEIGHT = 600;

    const mapPixelWidth = MAP_WIDTH * TILE_SIZE;
    const mapPixelHeight = MAP_HEIGHT * TILE_SIZE;

    let camX = position.x * TILE_SIZE - VIEWPORT_WIDTH / 2 + TILE_SIZE / 2;
    let camY = position.y * TILE_SIZE - VIEWPORT_HEIGHT / 2 + TILE_SIZE / 2;

    camX = Math.max(0, Math.min(camX, mapPixelWidth - VIEWPORT_WIDTH));
    camY = Math.max(0, Math.min(camY, mapPixelHeight - VIEWPORT_HEIGHT));

    const handleBattleEnd = (win: boolean) => {
        setIsBattling(false);
        if (!win) {
            healFull();
            setIsPlaying(false); // Return to title screen on defeat
        }
    };

    const handleStart = () => {
        setIsPlaying(true);
        soundManager.playBGM('FIELD');
    };

    return (
        <div className="game-container">
            <div className="game-screen">
                {!isPlaying ? (
                    <div className="start-screen">
                        <h1 className="title-text">ミスティック・クエスト</h1>
                        <p className="subtitle-text">伝説の始まり</p>
                        <button className="start-button" onClick={handleStart}>
                            冒険を始める
                        </button>
                    </div>
                ) : isBattling ? (
                    <BattleScreen
                        playerState={playerState}
                        onTakeDamage={takeDamage}
                        onGainExp={gainExp}
                        onBattleEnd={handleBattleEnd}
                    />
                ) : (
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            transform: `translate(${-camX}px, ${-camY}px)`,
                            transition: 'transform 0.2s linear'
                        }}
                    >
                        <MapRenderer />
                        <Player position={position} direction={direction} />
                    </div>
                )}
            </div>
            <div className="game-ui">
                <div style={{ display: 'flex', gap: '2rem' }}>
                    <div>
                        <span style={{ color: '#94a3b8' }}>LV: </span>
                        <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>{playerState.level}</span>
                    </div>
                    <div>
                        <span style={{ color: '#94a3b8' }}>HP: </span>
                        <span style={{ color: playerState.currentHp < playerState.maxHp * 0.3 ? '#ef4444' : '#4ade80', fontWeight: 'bold' }}>
                            {playerState.currentHp} / {playerState.maxHp}
                        </span>
                    </div>
                    <div>
                        <span style={{ color: '#94a3b8' }}>EXP: </span>
                        <span>{playerState.currentExp} / {playerState.nextLevelExp}</span>
                    </div>
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#64748b' }}>
                    現在地: {position.x}, {position.y}
                </div>
            </div>
        </div>
    );
};

export default GameLayout;
