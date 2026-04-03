import React from 'react';
import { View, StyleSheet, Animated, Dimensions, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../../theme';
import type { WasteItem } from '../../../data/dragDropGameData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = Math.min(SCREEN_WIDTH - spacing.xl * 2, 320); // slightly wider
const ICON_AREA = 220;

interface GamePlayItemCardProps {
  item: WasteItem;
  pan: Animated.ValueXY;
  scale: Animated.Value;
  opacity: Animated.Value;
  panHandlers: object;
  feedbackAnimation: Animated.Value;
  isDragging: boolean;
  hintAnimation: Animated.Value;
}

export default function GamePlayItemCard({
  item,
  pan,
  scale,
  opacity,
  panHandlers,
  feedbackAnimation,
  isDragging,
  hintAnimation,
}: GamePlayItemCardProps) {
  return (
    <View style={styles.itemContainer}>
      <Animated.View
        {...panHandlers}
        style={[
          styles.draggableItem,
          {
            opacity,
            transform: [{ translateX: pan.x }, { translateY: pan.y }, { scale }],
          },
        ]}
      >
        <View style={styles.itemCard}>
          {/* Top Pill */}
          <View style={styles.itemLabelBadge}>
            <Text style={styles.itemLabelText}>PHÂN LOẠI TỚ!</Text>
          </View>

          {/* Image/Icon Area */}
          <View style={styles.itemIconArea}>
            {item.image ? (
              <Image source={item.image} style={styles.imageContent} resizeMode="cover" />
            ) : (
              <MaterialCommunityIcons
                name={item.icon as any}
                size={120}
                color={colors.text.primary}
              />
            )}
          </View>

          {/* Texts */}
          <Text style={styles.itemName}>{item.name}</Text>
          {item.hint ? (
            <Text style={styles.itemHintText}>{item.hint}</Text>
          ) : null}
        </View>
      </Animated.View>

      {/* Drag Hint (underneath card) */}
      <View style={styles.dragHintWrapper}>
        <Animated.View
          style={[
            styles.dragHint,
            {
              opacity: isDragging ? 0 : hintAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 1],
              }),
              transform: [
                {
                  translateY: hintAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 6],
                  }),
                },
              ],
            },
          ]}
          pointerEvents="none"
        >
          <MaterialCommunityIcons name="gesture-swipe" size={24} color="#66BB6A" />
          <Text style={styles.dragHintText}>KÉO THẢ ĐỂ GHI ĐIỂM</Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dragHint: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  dragHintText: {
    color: '#388E3C', // darker green
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  dragHintWrapper: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  draggableItem: {
    alignSelf: 'center',
    width: CARD_WIDTH,
  },
  imageContent: {
    borderRadius: 16,
    height: '100%',
    width: '100%',
  },
  itemCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 32, // Large rounded corners
    elevation: 8,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  itemContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingBottom: spacing['2xl'], // pushes entire block up
  },
  itemHintText: {
    color: '#757575',
    fontSize: 16,
    marginTop: spacing.xs,
  },
  itemIconArea: {
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    height: ICON_AREA,
    justifyContent: 'center',
    marginBottom: spacing.lg,
    marginTop: spacing.md,
    width: '100%', // full width of inner padding
  },
  itemLabelBadge: {
    backgroundColor: '#E8F5E9',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  itemLabelText: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  itemName: {
    color: '#212121',
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
  },
});
