import React from 'react';
import { StyleSheet, View } from 'react-native';
import Colors from '../constants/colors';
import { Radius, Shadows } from '../constants/theme';

// A single, consistent elevated-card surface used everywhere instead of
// ad-hoc bordered Views, so the whole app reads as one design system.
export default function Card({ style, children, padded = true, ...rest }) {
  return (
    <View style={[styles.card, padded && styles.padded, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    ...Shadows.card,
  },
  padded: { padding: 18 },
});
