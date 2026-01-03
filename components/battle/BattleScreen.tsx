import React, { useEffect } from 'react';
import './BattleScreen.css';
import { useBattle } from '../../hooks/useBattle';
import type { PlayerState } from '../../hooks/useGameState';

// Import images directly to ensure Vite processes them
import slimeImg from '../../assets/sprites/slime.png';
import goblinImg from '../../assets/sprites/goblin.png';
import dragonImg from '../../assets/sprites/dragon.png';

const SPRITES: Record<string, string> = {
    'slime.png': slimeImg,
    'goblin.png': goblinImg,
    'dragon.png': dragonImg,
};

type BattleScreenProps = {
    playerState: PlayerState;
    onTakeDamage: (amount: number) => void;
    onGainExp: (amount: number) => boolean;
    onBattleEnd: (win: boolean) => void;
};

const BattleScreen: React.FC<BattleScreenProps> = ({
    playerState,
    onTakeDamage,
    onGainExp,
    onBattleEnd
}) => {
    const {
        enemy,
        enemyHp,
        battleState,
        battleLog,
        playerAttack,
        runAway,
        finishBattle
    } = useBattle(playerState, onTakeDamage, onGainExp, onBattleEnd);

    // Handle victory/defeat auto-close
    useEffect(() => {
        if (battleState === 'VICTORY' || battleState === 'DEFEAT' || battleState === 'LEVEL_UP') {
            const timer = setTimeout(() => {
                finishBattle();
            }, 2500); // Slightly longer to see results
            return () => clearTimeout(timer);
        }
    }, [battleState, finishBattle]);

    return (
        <div className="battle-screen">
            <div className="battle-area">
                <div className="enemy-container">
                    <div
                        className={`enemy-sprite ${battleState === 'VICTORY' ? 'defeated' : ''}`}
                        style={{ backgroundImage: `url(${SPRITES[enemy.sprite]})` }}
                    />
                    <div className="hp-bar-container">
                        <div className="hp-bar" style={{ width: `${(enemyHp / enemy.maxHp) * 100}%` }} />
                    </div>
                    <p className="enemy-name">{enemy.name} (HP: {enemyHp})</p>
                </div>
            </div>

            <div className="battle-ui">
                <div className="battle-log">
                    {battleLog.map((log, index) => (
                        <div key={index}>{log}</div>
                    ))}
                </div>

                <div className="battle-controls">
                    <div className="player-status">
                        <div className="status-row">
                            <span className="hp-label">LV.</span>
                            <span className="hp-value">{playerState.level}</span>
                        </div>
                        <div className="status-row">
                            <span className="hp-label">HP:</span>
                            <span className={`hp-value ${playerState.currentHp < playerState.maxHp * 0.3 ? 'low-hp' : ''}`}>
                                {playerState.currentHp} / {playerState.maxHp}
                            </span>
                        </div>
                    </div>
                    <div className="action-buttons">
                        <button
                            onClick={playerAttack}
                            disabled={battleState !== 'PLAYER_TURN'}
                            className="attack-btn"
                        >
                            たたかう
                        </button>
                        <button
                            onClick={runAway}
                            disabled={battleState !== 'PLAYER_TURN'}
                            className="run-btn"
                        >
                            にげる
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BattleScreen;
