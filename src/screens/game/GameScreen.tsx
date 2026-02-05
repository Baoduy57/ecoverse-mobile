import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../../theme';
import TopHeaderBar from '../../components/game/TopHeaderBar';
import CurrentStageCard from '../../components/game/CurrentStageCard';
import LearningPathNode from '../../components/game/LearningPathNode';
import type { Level } from '../../types/game';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const LEVEL_HEIGHT = 120; // Vertical spacing between nodes
const START_OFFSET_Y = 50;

// Mock Data
const LEARNING_PATH: Level[] = [
  {
    id: 1,
    title: 'BASICS',
    icon: 'check-all',
    status: 'completed',
    bestScore: '100%',
    description: 'Learn fundamental eco-friendly practices and waste sorting basics.',
    playsCount: 12,
    completionRate: 100,
  },
  {
    id: 2,
    title: 'RECYCLING',
    icon: 'recycle',
    status: 'completed',
    bestScore: '95%',
    description: 'Master the art of recycling different materials correctly.',
    playsCount: 8,
    completionRate: 95,
  },
  {
    id: 3,
    title: 'COMPOSTING',
    icon: 'sprout',
    status: 'current',
    isCurrent: true,
    description: 'Discover how to turn organic waste into valuable compost for your garden.',
    playsCount: 3,
    completionRate: 60,
  },
  {
    id: 4,
    title: 'REDUCE',
    icon: 'minus-circle',
    status: 'locked',
    description: 'Learn strategies to reduce waste in your daily life.',
  },
  {
    id: 5,
    title: 'REUSE',
    icon: 'refresh',
    status: 'locked',
    description: 'Creative ways to reuse items before throwing them away.',
  },
  {
    id: 6,
    title: 'ECO SHOPPING',
    icon: 'shopping',
    status: 'locked',
    description: 'Make sustainable choices when shopping for groceries and products.',
  },
  {
    id: 7,
    title: 'ENERGY',
    icon: 'lightning-bolt',
    status: 'locked',
    description: 'Save energy and reduce your carbon footprint at home.',
  },
  {
    id: 8,
    title: 'WATER',
    icon: 'water',
    status: 'locked',
    description: 'Conserve water with smart habits and techniques.',
  },
  {
    id: 9,
    title: 'TRANSPORT',
    icon: 'bike',
    status: 'locked',
    description: 'Choose eco-friendly transportation options.',
  },
  {
    id: 10,
    title: 'EXPERT',
    icon: 'trophy',
    status: 'locked',
    description: 'Become an eco-warrior and inspire others!',
  },
];

// Helper: Calculate node position with wavy pattern
const getNodePosition = (index: number) => {
  const y = START_OFFSET_Y + index * LEVEL_HEIGHT;
  // Sine wave with smooth frequency for natural roadmap feel
  const x = SCREEN_WIDTH / 2 + (SCREEN_WIDTH * 0.3) * Math.sin(index * 0.8);
  return { x, y };
};

export default function GameScreen() {
  const [selectedStage, setSelectedStage] = useState<Level>(
    LEARNING_PATH.find((l) => l.isCurrent) || LEARNING_PATH[0]
  );

  // Generate SVG Path
  const pathData = useMemo(() => {
    let d = `M${getNodePosition(0).x} ${getNodePosition(0).y}`;
    for (let i = 0; i < LEARNING_PATH.length - 1; i++) {
      const p1 = getNodePosition(i);
      const p2 = getNodePosition(i + 1);

      // Bezier control points for smooth curves
      const cp1x = p1.x;
      const cp1y = p1.y + LEVEL_HEIGHT / 2;
      const cp2x = p2.x;
      const cp2y = p2.y - LEVEL_HEIGHT / 2;

      d += ` C${cp1x} ${cp1y} ${cp2x} ${cp2y} ${p2.x} ${p2.y}`;
    }
    return d;
  }, []);

  // Generate completed path (green solid line)
  const completedPathData = useMemo(() => {
    const currentIndex = LEARNING_PATH.findIndex((l) => l.status === 'current');
    if (currentIndex <= 0) return '';

    let d = `M${getNodePosition(0).x} ${getNodePosition(0).y}`;
    for (let i = 0; i < currentIndex; i++) {
      const p1 = getNodePosition(i);
      const p2 = getNodePosition(i + 1);

      const cp1x = p1.x;
      const cp1y = p1.y + LEVEL_HEIGHT / 2;
      const cp2x = p2.x;
      const cp2y = p2.y - LEVEL_HEIGHT / 2;

      d += ` C${cp1x} ${cp1y} ${cp2x} ${cp2y} ${p2.x} ${p2.y}`;
    }
    return d;
  }, []);

  const handleLevelPress = (level: Level) => {
    if (level.status === 'locked') {
      Alert.alert('Locked', 'Complete previous levels to unlock this stage!');
      return;
    }
    setSelectedStage(level);
  };

  const handlePlayPress = () => {
    Alert.alert('Start Game', `Starting ${selectedStage.title} level!`);
    // TODO: Navigate to game/lesson screen
  };

  const handleBackPress = () => {
    // TODO: Navigate back
  };

  const contentHeight = START_OFFSET_Y + LEARNING_PATH.length * LEVEL_HEIGHT + 100;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top Header */}
      <TopHeaderBar
        onBack={handleBackPress}
        stats={{
          missions: 7,
          streak: 124,
          ecoPoints: 850,
        }}
      />

      {/* Current Stage Card */}
      <CurrentStageCard stage={selectedStage} onPlay={handlePlayPress} />

      {/* Learning Path */}
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { height: contentHeight }]}
        showsVerticalScrollIndicator={false}
      >
        {/* SVG Path Background */}
        <Svg style={StyleSheet.absoluteFill} height={contentHeight} width={SCREEN_WIDTH}>
          {/* Locked path (gray dashed) */}
          <Path
            d={pathData}
            stroke={colors.text.disabled}
            strokeWidth="6"
            strokeDasharray="10, 10"
            fill="none"
          />
          {/* Completed path (green solid) */}
          {completedPathData && (
            <Path
              d={completedPathData}
              stroke={colors.primaryDark}
              strokeWidth="6"
              fill="none"
            />
          )}
        </Svg>

        {/* Nodes */}
        {LEARNING_PATH.map((level, index) => (
          <LearningPathNode
            key={level.id}
            level={level}
            position={getNodePosition(index)}
            onPress={handleLevelPress}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9', // Light pastel green - softer than #B8E6C9
  },
  scrollContent: {
    paddingBottom: 50,
  },
  title: {
    color: colors.text.primary,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
