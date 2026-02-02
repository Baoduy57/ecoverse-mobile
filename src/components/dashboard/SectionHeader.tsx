import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '../../theme';

interface SectionHeaderProps {
  title: string;
  linkText?: string;
  onLinkPress?: () => void;
}

export default function SectionHeader({ title, linkText, onLinkPress }: SectionHeaderProps) {
  return (
    <View style={styles.sectionHeader}>
      <Text variant="titleMedium" style={styles.sectionTitle}>
        {title}
      </Text>
      {linkText && (
        <Text style={styles.sectionLink} onPress={onLinkPress}>
          {linkText}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  sectionLink: {
    color: colors.primary,
    fontSize: 14,
  },
});
