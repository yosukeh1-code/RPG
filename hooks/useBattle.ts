import { useState, useCallback, useEffect } from 'react';
import { ENEMIES } from '../game/types';
import type { EnemyStats, EnemyType } from '../game/types';
import type { PlayerState } from './useGameState';
import { soundManager } from '../game/SoundManager';

export type BattleState = 'PLAYER_TURN' | 'ENEMY_TURN' | 'VICTORY' | 'DEFEAT' | 'LEVEL_UP';

export const useBattle = (
    playerState: PlayerState,
    onTakeDamage: (amount: number) => void,
    onGainExp: (amount: number) => boolean,
    onBattleEnd: (win: boolean) => void
) => {
    const [enemy, setEnemy] = useState<EnemyStats>(ENEMIES.SLIME);
    const [enemyHp, setEnemyHp] = useState(10);
    const [battleState, setBattleState] = useState<BattleState>('PLAYER_TURN');
    const [battleLog, setBattleLog] = useState<string[]>([]);

    // Initialize battle
    useEffect(() => {
        // Random enemy selection based on random weight or just simple random for now
        const rand = Math.random();
        let selectedEnemy: EnemyType = 'SLIME';

        if (rand > 0.9) selectedEnemy = 'DRAGON';
        else if (rand > 0.6) selectedEnemy = 'GOBLIN';

        const enemyData = ENEMIES[selectedEnemy];
        setEnemy(enemyData);
        setEnemyHp(enemyData.maxHp);
        setBattleLog([`あ！ 野生の ${enemyData.name} が あらわれた！`]);
        setBattleState('PLAYER_TURN');
        soundManager.playBGM('BATTLE');

        return () => {
            soundManager.playBGM('FIELD');
        };
    }, []);

    const addLog = (message: string) => {
        setBattleLog((prev) => [...prev.slice(-3), message]);
    };

    const enemyAttack = useCallback(() => {
        setTimeout(() => {
            // Damage calc: Enemy Atk +/- variance - (Player Def? No Def yet)
            const baseDamage = enemy.attack;
            const variance = Math.floor(Math.random() * 3) - 1;
            const damage = Math.max(1, baseDamage + variance);

            onTakeDamage(damage);
            soundManager.playSE('DAMAGE');

            if (playerState.currentHp - damage <= 0) {
                setBattleState('DEFEAT');
                addLog(`${enemy.name} の こうげき！ ${damage} のダメージを受け、目の前が真っ暗になった...`);
            } else {
                setBattleState('PLAYER_TURN');
                addLog(`${enemy.name} の こうげき！ ${damage} のダメージを受けた！`);
            }
        }, 1000);
    }, [enemy, playerState.currentHp, onTakeDamage]);

    const playerAttack = useCallback(() => {
        if (battleState !== 'PLAYER_TURN') return;

        soundManager.playSE('ATTACK');

        const baseDamage = playerState.attack;
        const variance = Math.floor(Math.random() * 3);
        const damage = Math.max(1, baseDamage + variance);

        setEnemyHp((prev) => {
            const newHp = Math.max(0, prev - damage);
            if (newHp === 0) {
                setBattleState('VICTORY');
                addLog(`勇者の こうげき！ ${enemy.name} に ${damage} のダメージ！ ${enemy.name} を たおした！`);
                soundManager.playSE('WIN');

                // Gain Exp
                setTimeout(() => {
                    const leveledUp = onGainExp(enemy.exp);
                    if (leveledUp) {
                        addLog(`レベルがあがった！ (Lv.${playerState.level + 1})`);
                        setBattleState('LEVEL_UP'); // Keep open for a bit
                    }
                }, 500);

            } else {
                setBattleState('ENEMY_TURN');
                addLog(`勇者の こうげき！ ${enemy.name} に ${damage} のダメージ！`);
                enemyAttack();
            }
            return newHp;
        });
    }, [battleState, enemy, playerState.attack, playerState.level, enemyAttack, onGainExp]);

    const runAway = useCallback(() => {
        if (battleState !== 'PLAYER_TURN') return;
        addLog('うまく にげきれた！');
        setTimeout(() => {
            onBattleEnd(false);
        }, 1000);
    }, [battleState, onBattleEnd]);

    const finishBattle = useCallback(() => {
        onBattleEnd(true);
    }, [onBattleEnd]);

    return {
        enemy,
        enemyHp,
        battleState,
        battleLog,
        playerAttack,
        runAway,
        finishBattle
    };
};
