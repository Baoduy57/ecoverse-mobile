import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const ROADMAP_CONSTANTS = {
    SCREEN_WIDTH,
    LEVEL_HEIGHT: 120,
    START_OFFSET_Y: 50,
    LESSONS_PER_UNIT: 7,
    SEPARATOR_HEIGHT: 60,
};
