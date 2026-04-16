import { ROADMAP_CONSTANTS } from '../constants/roadmap';
import type { Level } from '../types/game';

const { SCREEN_WIDTH, LEVEL_HEIGHT, START_OFFSET_Y, LESSONS_PER_UNIT, SEPARATOR_HEIGHT } = ROADMAP_CONSTANTS;

/**
 * Calculate node position with wavy pattern and unit offsets
 */
export const getNodePosition = (index: number) => {
    const unitIndex = Math.floor(index / LESSONS_PER_UNIT);
    const unitOffset = unitIndex * SEPARATOR_HEIGHT;

    const y = START_OFFSET_Y + index * LEVEL_HEIGHT + unitOffset;
    // Sine wave with smooth frequency for natural roadmap feel
    const x = SCREEN_WIDTH / 2 + SCREEN_WIDTH * 0.3 * Math.sin(index * 0.8);
    return { x, y };
};

/**
 * Generate mock levels for preloading demonstration
 * In a real app, this might be a fallback or used to transform API data
 */
export const generateLevels = (startIndex: number, count: number): Level[] => {
    return Array.from({ length: count }).map((_, i) => {
        const index = startIndex + i;
        return {
            id: `mock-${index}`,
            title: `Màn ${index + 1}`,
            icon: index % 2 === 0 ? 'tree' : 'recycle',
            status: 'locked',
            description: `Khám phá và phân loại rác tại khu vực ${index + 1}`,
            itemCount: 5,
        };
    });
};
