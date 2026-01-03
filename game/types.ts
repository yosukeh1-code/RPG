export type EnemyType = 'SLIME' | 'GOBLIN' | 'DRAGON';

export interface EnemyStats {
    id: EnemyType;
    name: string;
    maxHp: number;
    attack: number;
    exp: number;
    sprite: string;
}

export const ENEMIES: Record<EnemyType, EnemyStats> = {
    SLIME: {
        id: 'SLIME',
        name: 'スライム',
        maxHp: 10,
        attack: 2,
        exp: 3,
        sprite: 'slime.png'
    },
    GOBLIN: {
        id: 'GOBLIN',
        name: 'ゴブリン',
        maxHp: 25,
        attack: 5,
        exp: 8,
        sprite: 'goblin.png'
    },
    DRAGON: {
        id: 'DRAGON',
        name: 'ドラゴン',
        maxHp: 80,
        attack: 12,
        exp: 25,
        sprite: 'dragon.png'
    }
};

export const LEVEL_TABLE = [
    0,      // Lv1
    10,     // Lv2
    30,     // Lv3
    60,     // Lv4
    100,    // Lv5
    150,    // Lv6
    210,    // Lv7
    280,    // Lv8
    360,    // Lv9
    450     // Lv10
];
