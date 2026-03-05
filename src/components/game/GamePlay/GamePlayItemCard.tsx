import React from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../../theme';
import type { WasteItem } from '../../../data/dragDropGameData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = Math.min(SCREEN_WIDTH - spacing.lg * 4, 240);
const ICON_SIZE = 100;
const ICON_AREA = 150;

interface GamePlayItemCardProps {
  item: WasteItem;
  pan: Animated.ValueXY;
  scale: Animated.Value;
  panHandlers: object;
  feedbackAnimation: Animated.Value;
  isDragging: boolean;
  hintAnimation: Animated.Value;
}

export default function GamePlayItemCard({
  item,
  pan,
  scale,
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
            transform: [{ translateX: pan.x }, { translateY: pan.y }, { scale }],
          },
        ]}
      >
        <View style={styles.itemCard}>
          <View style={styles.itemLabelBadge}>
            <Text style={styles.itemLabelText}>Phân loại tới!</Text>
          </View>
          <View style={styles.itemIconArea}>
            <MaterialCommunityIcons
              name={item.icon as any}
              size={ICON_SIZE}
              color={colors.text.primary}
            />
          </View>
          <Text style={styles.itemName}>{item.name}</Text>
          {item.hint ? (
            <Text style={styles.itemHintText}>{item.hint}</Text>
          ) : (
            <Text style={styles.itemNameEn}>{item.nameEn}</Text>
          )}
        </View>
      </Animated.View>

      {!isDragging && (
        <Animated.View
          style={[
            styles.dragHint,
            {
              opacity: hintAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 1],
              }),
              transform: [
                {
                  translateY: hintAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 8],
                  }),
                },
              ],
            },
          ]}
          pointerEvents="none"
        >
          <MaterialCommunityIcons name="gesture-swipe-down" size={28} color={colors.primary} />
          <Text style={styles.dragHintText}>Kéo xuống</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  draggableItem: {
    width: CARD_WIDTH,
    height: 300,
  },
  itemCard: {
    flex: 1,
    borderRadius: 24,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  itemLabelBadge: {
    position: 'absolute',
    top: spacing.sm,
    backgroundColor: '#FFE082',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  itemLabelText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text.primary,
  },
  itemIconArea: {
    width: ICON_AREA,
    height: ICON_AREA,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  itemName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  itemNameEn: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  itemHintText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  dragHint: {
    position: 'absolute',
    bottom: 48,
    alignItems: 'center',
  },
  dragHintText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
    marginTop: spacing.xs,
  },
});
