import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/theme';

interface GameCardProps {
  title: string;
  icon: string;
  buttonText: string;
  buttonIcon: string;
  backgroundColor: string;
  onPress?: () => void;
}

export default function GameCard({
  title,
  icon,
  buttonText,
  buttonIcon,
  backgroundColor,
  onPress,
}: GameCardProps) {
  return (
    <Card style={[styles.gameCard, { backgroundColor }]}>
      <View style={styles.gameCardContent}>
        <View style={styles.gameIconContainer}>
          <MaterialCommunityIcons name={icon as any} size={32} color={colors.text.white} />
        </View>
        <Text variant="titleMedium" style={styles.gameCardTitle}>
          {title}
        </Text>
        <Button
          mode="contained"
          compact={true}
          style={styles.gameCardButton}
          labelStyle={styles.gameCardButtonLabel}
          icon={buttonIcon}
          onPress={onPress}
        >
          {buttonText}
        </Button>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  gameCard: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
  },
  gameCardContent: {
    padding: 20,
    minHeight: 180,
  },
  gameIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  gameCardTitle: {
    color: colors.text.white,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  gameCardButton: {
    backgroundColor: colors.surface,
    borderRadius: 20,
  },
  gameCardButtonLabel: {
    color: colors.text.primary,
    fontSize: 12,
  },
});
