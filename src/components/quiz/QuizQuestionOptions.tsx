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
            activeOpacity={0.75}
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
              <MaterialCommunityIcons name="check-circle" size={22} color={colors.primary} />
            ) : null}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  option: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    borderWidth: 2,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  optionLabel: {
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: borderRadius.full,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  optionLabelSelected: {
    backgroundColor: '#DCFCE7',
  },
  optionLabelText: {
    color: colors.text.secondary,
    fontSize: 13,
    fontWeight: '800',
  },
  optionLabelTextSelected: {
    color: colors.primary,
  },
  optionSelected: {
    backgroundColor: 'rgba(76, 175, 80, 0.08)',
    borderColor: '#4CAF50',
  },
  optionText: {
    color: colors.text.primary,
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  optionTextSelected: {
    color: colors.primary,
  },
});
