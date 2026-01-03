import { CONSTANTS } from './constants';

// 0: Grass, 1: Wall/Tree, 2: Water
export const TILE_TYPES = {
    GRASS: 0,
    WALL: 1,
    WATER: 2,
};

// Procedurally generated-like map (manual for now but larger)
const generateMap = () => {
    const map: number[][] = [];
    const { MAP_WIDTH, MAP_HEIGHT } = CONSTANTS;

    for (let y = 0; y < MAP_HEIGHT; y++) {
        const row: number[] = [];
        for (let x = 0; x < MAP_WIDTH; x++) {
            // Borders
            if (x === 0 || x === MAP_WIDTH - 1 || y === 0 || y === MAP_HEIGHT - 1) {
                row.push(1);
                continue;
            }

            // Random terrain generation
            const rand = Math.random();

            // Lake in the middle
            const dx = x - MAP_WIDTH / 2;
            const dy = y - MAP_HEIGHT / 2;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 5) {
                row.push(2); // Water
            } else if (dist < 6 && rand > 0.3) {
                row.push(0); // Grass around water
            } else if (rand > 0.92) {
                row.push(1); // Random trees
            } else if (rand > 0.88 && rand <= 0.92) {
                row.push(2); // Small puddles
            } else {
                row.push(0); // Grass
            }
        }
        map.push(row);
    }

    // Ensure starting position is clear
    map[1][1] = 0;
    map[1][2] = 0;
    map[2][1] = 0;

    return map;
};

export const INITIAL_MAP: number[][] = generateMap();

export const getTileType = (x: number, y: number): number | null => {
    if (y < 0 || y >= INITIAL_MAP.length || x < 0 || x >= INITIAL_MAP[0].length) {
        return null;
    }
    return INITIAL_MAP[y][x];
};

export const isWalkable = (x: number, y: number): boolean => {
    const tile = getTileType(x, y);
    return tile === TILE_TYPES.GRASS;
};
