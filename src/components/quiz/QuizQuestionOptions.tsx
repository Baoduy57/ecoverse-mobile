import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from 'react-native-paper';
import { borderRadius, colors, spacing } from '../../theme';

type QuizQuestionOptionsProps = {
  options: string[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
};

const getOptionLabel = (index: number) => String.fromCharCode(65 + index);

export default function QuizQuestionOptions({
  options,
  selectedIndex,
  onSelect,
}: QuizQuestionOptionsProps) {
  return (
    <View style={styles.container}>
      {options.map((option, index) => {
        const isSelected = selectedIndex === index;

        return (
          <TouchableOpacity
            key={`option-${index}`}
            style={[styles.option, isSelected && styles.optionSelected]}
            activeOpacity={0.7}
            onPress={() => onSelect(index)}
          >
            <View style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
              <Text style={[styles.optionLabelText, isSelected && styles.optionLabelTextSelected]}>
                {getOptionLabel(index)}
              </Text>
            </View>
            <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
              {option}
            </Text>
            {isSelected ? (
              <MaterialCommunityIcons name="check-circle" size={24} color={colors.primary} />
            ) : (
              <View style={styles.unselectedRadio} />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  option: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    borderWidth: 2,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  optionLabel: {
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: borderRadius.full,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  optionLabelSelected: {
    backgroundColor: colors.primary,
  },
  optionLabelText: {
    color: colors.text.secondary,
    fontSize: 14,
    fontWeight: '800',
  },
  optionLabelTextSelected: {
    color: colors.text.white,
  },
  optionSelected: {
    backgroundColor: '#F0FDF4',
    borderColor: colors.primary,
    borderWidth: 2,
  },
  optionText: {
    color: colors.text.primary,
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  optionTextSelected: {
    color: colors.primaryDark,
    fontWeight: '800',
  },
  unselectedRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CBD5E1',
  },
});
