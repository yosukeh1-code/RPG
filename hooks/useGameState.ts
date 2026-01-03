import { useState, useCallback } from 'react';
import { LEVEL_TABLE } from '../game/types';
import { soundManager } from '../game/SoundManager';

export interface PlayerState {
    level: number;
    currentHp: number;
    maxHp: number;
    attack: number;
    currentExp: number;
    nextLevelExp: number;
}

const INITIAL_PLAYER_STATE: PlayerState = {
    level: 1,
    currentHp: 20,
    maxHp: 20,
    attack: 3,
    currentExp: 0,
    nextLevelExp: LEVEL_TABLE[1]
};

export const useGameState = () => {
    const [playerState, setPlayerState] = useState<PlayerState>(INITIAL_PLAYER_STATE);

    const gainExp = useCallback((amount: number): boolean => {
        let leveledUp = false;

        setPlayerState((prev) => {
            let newExp = prev.currentExp + amount;
            let newLevel = prev.level;
            let newMaxHp = prev.maxHp;
            let newAttack = prev.attack;
            let newCurrentHp = prev.currentHp;

            // Level up logic (can level up multiple times)
            while (newLevel < LEVEL_TABLE.length && newExp >= LEVEL_TABLE[newLevel]) {
                newLevel++;
                newMaxHp += 5 + Math.floor(Math.random() * 3); // +5~7 HP
                newAttack += 1 + Math.floor(Math.random() * 2); // +1~2 ATK
                newCurrentHp = newMaxHp; // Full heal on level up
                leveledUp = true;
            }

            if (leveledUp) {
                soundManager.playSE('LEVEL_UP');
            }

            return {
                level: newLevel,
                currentHp: newCurrentHp,
                maxHp: newMaxHp,
                attack: newAttack,
                currentExp: newExp,
                nextLevelExp: LEVEL_TABLE[newLevel] || 9999
            };
        });

        return leveledUp;
    }, []);

    const takeDamage = useCallback((amount: number) => {
        setPlayerState(prev => ({
            ...prev,
            currentHp: Math.max(0, prev.currentHp - amount)
        }));
    }, []);

    const healFull = useCallback(() => {
        setPlayerState(prev => ({
            ...prev,
            currentHp: prev.maxHp
        }));
    }, []);

    return {
        playerState,
        gainExp,
        takeDamage,
        healFull
    };
};
