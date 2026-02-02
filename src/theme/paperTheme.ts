import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { colors } from './colors';

// Custom Light Theme for React Native Paper
export const paperLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    primaryContainer: colors.primaryLight,
    secondary: colors.secondary,
    secondaryContainer: colors.secondaryLight,
    tertiary: colors.accentBlue,
    tertiaryContainer: colors.primaryLight,
    surface: colors.surface,
    surfaceVariant: colors.background,
    background: colors.background,
    error: colors.status.error,
    errorContainer: '#FFCDD2',
    onPrimary: colors.text.white,
    onSecondary: colors.text.white,
    onSurface: colors.text.primary,
    onSurfaceVariant: colors.text.secondary,
    onBackground: colors.text.primary,
    outline: colors.border,
    outlineVariant: colors.divider,
  },
  roundness: 12,
};

// Custom Dark Theme for React Native Paper (optional)
export const paperDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.primaryLight,
    primaryContainer: colors.primaryDark,
    secondary: colors.secondaryLight,
    secondaryContainer: colors.secondaryDark,
    tertiary: colors.accentBlue,
    surface: '#1E1E1E',
    surfaceVariant: '#2C2C2C',
    background: '#121212',
    error: colors.status.error,
  },
  roundness: 12,
};

export default paperLightTheme;
