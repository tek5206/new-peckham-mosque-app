// Shared design tokens so every screen reads as one coherent, professionally
// crafted product instead of a collection of one-off styles.
import { Platform } from 'react-native';
import Colors from './colors';

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 36,
};

export const Radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  pill: 999,
};

export const Typography = {
  display: { fontSize: 30, fontWeight: '800', letterSpacing: -0.3 },
  h1: { fontSize: 24, fontWeight: '800', letterSpacing: -0.2 },
  h2: { fontSize: 18, fontWeight: '800', letterSpacing: -0.1 },
  h3: { fontSize: 15, fontWeight: '700' },
  body: { fontSize: 15, fontWeight: '400' },
  bodyStrong: { fontSize: 15, fontWeight: '700' },
  caption: { fontSize: 12.5, fontWeight: '600' },
  eyebrow: { fontSize: 11.5, fontWeight: '800', letterSpacing: 1.1 },
};

// Soft, low-contrast elevation — reads as premium rather than flat-bordered.
export const Shadows = {
  card: Platform.select({
    ios: {
      shadowColor: Colors.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
    },
    android: { elevation: 3 },
    default: {},
  }),
  raised: Platform.select({
    ios: {
      shadowColor: Colors.shadow,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.16,
      shadowRadius: 24,
    },
    android: { elevation: 8 },
    default: {},
  }),
  floating: Platform.select({
    ios: {
      shadowColor: Colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 10,
    },
    android: { elevation: 5 },
    default: {},
  }),
};

export default { Spacing, Radius, Typography, Shadows };
