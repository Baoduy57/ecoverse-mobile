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
  dragHint: {
    alignItems: 'center',
    bottom: 48,
    position: 'absolute',
  },
  dragHintText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
  draggableItem: {
    height: 300,
    width: CARD_WIDTH,
  },
  itemCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 24,
    elevation: 6,
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  itemContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  itemHintText: {
    color: colors.text.secondary,
    fontSize: 13,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
  itemIconArea: {
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    height: ICON_AREA,
    justifyContent: 'center',
    marginBottom: spacing.md,
    width: ICON_AREA,
  },
  itemLabelBadge: {
    backgroundColor: '#FFE082',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    position: 'absolute',
    top: spacing.sm,
  },
  itemLabelText: {
    color: colors.text.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  itemName: {
    color: colors.text.primary,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  itemNameEn: {
    color: colors.text.secondary,
    fontSize: 14,
    textAlign: 'center',
  },
});
