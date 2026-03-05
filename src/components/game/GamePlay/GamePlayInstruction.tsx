import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing } from '../../../theme';

interface GamePlayInstructionProps {
  feedbackAnimation: Animated.Value;
}

export default function GamePlayInstruction({ feedbackAnimation }: GamePlayInstructionProps) {
  return (
    <View style={styles.instructionContainer}>
      <Animated.View
        style={{
          opacity: feedbackAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0],
          }),
        }}
      >
        <Text style={styles.instructionText}>Kéo vào thùng rác đúng loại!</Text>
      </Animated.View>
      <Animated.View
        style={[
          styles.feedbackOverlay,
          {
            opacity: feedbackAnimation,
            transform: [
              {
                scale: feedbackAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1.2],
                }),
              },
            ],
          },
        ]}
        pointerEvents="none"
      >
        <MaterialCommunityIcons name="check-circle" size={80} color={colors.status.success} />
        <Text style={styles.feedbackText}>Chính xác! +300</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  instructionContainer: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    position: 'relative',
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
  },
  feedbackOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackText: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.status.success,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});
