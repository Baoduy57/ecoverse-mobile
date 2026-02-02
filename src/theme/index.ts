import { colors, opacity } from './colors';
import { typography } from './typography';
import { spacing, borderRadius, shadows, containerPadding } from './spacing';

export const theme = {
  colors,
  opacity,
  typography,
  spacing,
  borderRadius,
  shadows,
  containerPadding,
};

export type Theme = typeof theme;

// Export individual modules
export * from './colors';
export * from './typography';
export * from './spacing';
export * from './paperTheme';

export default theme;
