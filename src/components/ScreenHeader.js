import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '../constants/colors';
import { Spacing, Typography } from '../constants/theme';
import { MosqueMark } from './Logo';

// A consistent header block for every secondary screen: small eyebrow,
// large title, optional subtitle, and a subtle brand mark — replaces the
// mismatched ad-hoc <Text style={styles.title}> headers each screen had.
export default function ScreenHeader({ eyebrow, title, subtitle, showMark = false, right }) {
  return (
    <View style={styles.wrap}>
      <View style={{ flex: 1 }}>
        {!!eyebrow && <Text style={styles.eyebrow}>{eyebrow}</Text>}
        <Text style={styles.title}>{title}</Text>
        {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {showMark && <MosqueMark size={38} />}
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  eyebrow: { ...Typography.eyebrow, color: Colors.gold, textTransform: 'uppercase', marginBottom: 4 },
  title: { ...Typography.display, color: Colors.primaryDark },
  subtitle: { ...Typography.body, color: Colors.textMuted, marginTop: 6, lineHeight: 20 },
});
