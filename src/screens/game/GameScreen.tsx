import React, { useState, useMemo, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Alert, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme';
import TopHeaderBar from '../../components/game/TopHeaderBar';
import CurrentStageCard from '../../components/game/CurrentStageCard';
import LearningPathNode from '../../components/game/LearningPathNode';
import BackgroundDecorations from '../../components/game/BackgroundDecorations';
import UnitSeparator from '../../components/game/UnitSeparator';
import type { Level } from '../../types/game';
import { StatusBar } from 'expo-status-bar';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const LEVEL_HEIGHT = 120; // Vertical spacing between nodes
const START_OFFSET_Y = 50;
const LESSONS_PER_UNIT = 7; // Number of lessons per unit
const SEPARATOR_HEIGHT = 60; // Height of separator between units

const LEARNING_PATH: Level[] = [
  {
    id: 1,
    title: 'Cơ Bản',
    icon: 'check-all',
    status: 'completed',
    bestScore: '100%',
    description: 'Học cách phân loại rác đúng cách!',
    playsCount: 12,
    completionRate: 100,
  },
  {
    id: 2,
    title: 'Tái Chế',
    icon: 'recycle',
    status: 'completed',
    bestScore: '95%',
    description: 'Biến rác thành đồ hữu ích!',
    playsCount: 8,
    completionRate: 95,
  },
  {
    id: 3,
    title: 'Ủ Phân',
    icon: 'sprout',
    status: 'current',
    isCurrent: true,
    description: 'Cùng mình ủ rác hữu cơ nhé!',
    playsCount: 3,
    completionRate: 60,
  },
  {
    id: 4,
    title: 'Giảm Rác',
    icon: 'minus-circle',
    status: 'locked',
    description: 'Giảm rác từng ngày!',
  },
  {
    id: 5,
    title: 'Tái Dùng',
    icon: 'refresh',
    status: 'locked',
    description: 'Tái sử dụng đồ cũ thật sáng tạo!',
  },
  {
    id: 6,
    title: 'Mua Sắm',
    icon: 'shopping',
    status: 'locked',
    description: 'Mua sắm thông minh, bảo vệ môi trường!',
  },
  {
    id: 7,
    title: 'Tiết Điện',
    icon: 'lightning-bolt',
    status: 'locked',
    description: 'Tiết kiệm điện mỗi ngày!',
  },
  {
    id: 8,
    title: 'Nước Sạch',
    icon: 'water',
    status: 'locked',
    description: 'Nước sạch quý giá lắm!',
  },
  {
    id: 9,
    title: 'Di Chuyển',
    icon: 'bike',
    status: 'locked',
    description: 'Đi xe đạp vui khỏe!',
  },
  {
    id: 10,
    title: 'Chuyên Gia',
    icon: 'trophy',
    status: 'locked',
    description: 'Trở thành chiến binh môi trường!',
  },
];

// Helper: Calculate node position with wavy pattern and unit offsets
const getNodePosition = (index: number) => {
  const unitIndex = Math.floor(index / LESSONS_PER_UNIT);
  const unitOffset = unitIndex * SEPARATOR_HEIGHT;

  const y = START_OFFSET_Y + index * LEVEL_HEIGHT + unitOffset;
  // Sine wave with smooth frequency for natural roadmap feel
  const x = SCREEN_WIDTH / 2 + SCREEN_WIDTH * 0.3 * Math.sin(index * 0.8);
  return { x, y };
};

export default function GameScreen() {
  const [selectedStage, setSelectedStage] = useState<Level>(
    LEARNING_PATH.find(l => l.isCurrent) || LEARNING_PATH[0]
  );

  // Animations
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const floatAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Floating animation for decorative icons
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim1, {
          toValue: -20,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim1, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim2, {
          toValue: -15,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim2, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim3, {
          toValue: -10,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim3, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Calculate which unit is currently unlocked (contains current node)
  const currentLevelIndex = LEARNING_PATH.findIndex(l => l.status === 'current');
  const currentUnitIndex =
    currentLevelIndex >= 0 ? Math.floor(currentLevelIndex / LESSONS_PER_UNIT) : 0;

  // Generate SVG Path segments (one per unit, breaking at separators)
  const pathSegments = useMemo(() => {
    const segments: string[] = [];
    const numberOfUnits = Math.ceil(LEARNING_PATH.length / LESSONS_PER_UNIT);

    for (let unitIndex = 0; unitIndex < numberOfUnits; unitIndex++) {
      const startIdx = unitIndex * LESSONS_PER_UNIT;
      const endIdx = Math.min(startIdx + LESSONS_PER_UNIT, LEARNING_PATH.length);

      if (startIdx >= LEARNING_PATH.length) break;

      let d = `M${getNodePosition(startIdx).x} ${getNodePosition(startIdx).y}`;

      for (let i = startIdx; i < endIdx - 1; i++) {
        const p1 = getNodePosition(i);
        const p2 = getNodePosition(i + 1);

        // Bezier control points for smooth curves
        const cp1x = p1.x;
        const cp1y = p1.y + LEVEL_HEIGHT / 2;
        const cp2x = p2.x;
        const cp2y = p2.y - LEVEL_HEIGHT / 2;

        d += ` C${cp1x} ${cp1y} ${cp2x} ${cp2y} ${p2.x} ${p2.y}`;
      }

      segments.push(d);
    }

    return segments;
  }, []);

  // Generate completed path segments (green solid line)
  const completedPathSegments = useMemo(() => {
    const segments: string[] = [];
    const currentIndex = LEARNING_PATH.findIndex(l => l.status === 'current');
    if (currentIndex <= 0) return segments;

    const numberOfUnits = Math.ceil(currentIndex / LESSONS_PER_UNIT);

    for (let unitIndex = 0; unitIndex < numberOfUnits; unitIndex++) {
      const startIdx = unitIndex * LESSONS_PER_UNIT;
      const endIdx = Math.min(startIdx + LESSONS_PER_UNIT, currentIndex + 1);

      if (startIdx >= currentIndex) break;

      let d = `M${getNodePosition(startIdx).x} ${getNodePosition(startIdx).y}`;

      for (let i = startIdx; i < endIdx - 1; i++) {
        const p1 = getNodePosition(i);
        const p2 = getNodePosition(i + 1);

        const cp1x = p1.x;
        const cp1y = p1.y + LEVEL_HEIGHT / 2;
        const cp2x = p2.x;
        const cp2y = p2.y - LEVEL_HEIGHT / 2;

        d += ` C${cp1x} ${cp1y} ${cp2x} ${cp2y} ${p2.x} ${p2.y}`;
      }

      segments.push(d);
    }

    return segments;
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

  const numberOfSeparators = Math.floor(LEARNING_PATH.length / LESSONS_PER_UNIT);
  const contentHeight =
    START_OFFSET_Y +
    LEARNING_PATH.length * LEVEL_HEIGHT +
    numberOfSeparators * SEPARATOR_HEIGHT +
    100;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor={colors.background} translucent={false} />

      {/* Background Decorative Elements */}
      <View style={styles.bgDecorativeTop} />
      <View style={styles.bgDecorativeRight} />
      <View style={styles.bgDecorativeBottom} />

      {/* Floating Icons */}
      <Animated.View style={[styles.floatingIcon1, { transform: [{ translateY: floatAnim1 }] }]}>
        <MaterialCommunityIcons name="leaf" size={100} color="rgba(129, 199, 132, 0.3)" />
      </Animated.View>

      <Animated.View style={[styles.floatingIcon2, { transform: [{ translateY: floatAnim2 }] }]}>
        <MaterialCommunityIcons name="recycle" size={80} color="rgba(129, 199, 132, 0.3)" />
      </Animated.View>

      <Animated.View style={[styles.floatingIcon3, { transform: [{ translateY: floatAnim3 }] }]}>
        <MaterialCommunityIcons name="cloud" size={60} color="rgba(144, 202, 249, 0.4)" />
      </Animated.View>

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Top Header */}
        <TopHeaderBar
          onBack={handleBackPress}
          stats={{
            missions: 7,
            streak: 124,
            ecoPoints: 850,
          }}
        />

        {/* Game Content Container with Green Background */}
        <View style={styles.gameContent}>
          {/* Current Stage Card */}
          <CurrentStageCard stage={selectedStage} onPlay={handlePlayPress} />

          {/* Learning Path */}
          <ScrollView
            contentContainerStyle={[styles.scrollContent, { height: contentHeight }]}
            showsVerticalScrollIndicator={false}
          >
            {/* Background Decorations */}
            <BackgroundDecorations width={SCREEN_WIDTH} height={contentHeight} />

            {/* SVG Path Background */}
            <Svg style={StyleSheet.absoluteFill} height={contentHeight} width={SCREEN_WIDTH}>
              {/* Locked path segments (gray dashed) */}
              {pathSegments.map((pathData, index) => (
                <Path
                  key={`locked-${index}`}
                  d={pathData}
                  stroke={colors.text.disabled}
                  strokeWidth="6"
                  strokeDasharray="10, 10"
                  strokeLinecap="round"
                  fill="none"
                />
              ))}

              {/* Completed path segments (green solid) */}
              {completedPathSegments.map((pathData, index) => (
                <Path
                  key={`completed-${index}`}
                  d={pathData}
                  stroke={colors.primaryDark}
                  strokeWidth="6"
                  strokeLinecap="round"
                  fill="none"
                />
              ))}
            </Svg>

            {/* Unit Separators */}
            {Array.from({ length: numberOfSeparators }).map((_, unitIndex) => {
              const lastNodeInUnit = (unitIndex + 1) * LESSONS_PER_UNIT - 1;
              const separatorY = getNodePosition(lastNodeInUnit).y + LEVEL_HEIGHT / 2 + 10;

              return (
                <UnitSeparator
                  key={`separator-${unitIndex}`}
                  y={separatorY}
                  width={SCREEN_WIDTH}
                  unitIndex={unitIndex}
                />
              );
            })}

            {/* Nodes */}
            {LEARNING_PATH.map((level, index) => {
              const nodeUnitIndex = Math.floor(index / LESSONS_PER_UNIT);
              const isUnitUnlocked = nodeUnitIndex <= currentUnitIndex;

              return (
                <LearningPathNode
                  key={level.id}
                  level={level}
                  position={getNodePosition(index)}
                  onPress={handleLevelPress}
                  isUnitUnlocked={isUnitUnlocked}
                />
              );
            })}
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
    position: 'relative',
  },
  // Background decorative elements
  bgDecorativeTop: {
    backgroundColor: '#dbe6e0',
    borderRadius: 9999,
    height: '40%',
    left: '-10%',
    opacity: 0.6,
    position: 'absolute',
    top: '-10%',
    width: '70%',
  },
  bgDecorativeRight: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 9999,
    height: '50%',
    position: 'absolute',
    right: '-20%',
    top: '40%',
    width: '80%',
  },
  bgDecorativeBottom: {
    backgroundColor: '#dbe6e0',
    borderRadius: 9999,
    bottom: '-10%',
    height: '40%',
    left: '10%',
    opacity: 0.5,
    position: 'absolute',
    width: '60%',
  },
  // Floating icons
  floatingIcon1: {
    position: 'absolute',
    right: -20,
    top: '15%',
    zIndex: 0,
  },
  floatingIcon2: {
    bottom: '20%',
    left: -30,
    position: 'absolute',
    zIndex: 0,
  },
  floatingIcon3: {
    left: '5%',
    position: 'absolute',
    top: '40%',
    zIndex: 0,
  },
  safeArea: {
    flex: 1,
    zIndex: 10,
  },
  gameContent: {
    flex: 1,
    backgroundColor: 'transparent',
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
