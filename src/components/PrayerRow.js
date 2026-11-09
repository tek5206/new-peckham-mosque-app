import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../constants/colors';

export default function PrayerRow({ label, time, isNext, isPast }) {
  return (
    <View style={[styles.row, isNext && styles.rowActive]}>
      <View style={styles.left}>
        {isNext ? <View style={styles.dot} /> : <View style={styles.dotPlaceholder} />}
        <Text style={[styles.label, isNext && styles.labelActive, isPast && styles.labelPast]}>
          {label}
        </Text>
      </View>
      <Text style={[styles.time, isNext && styles.timeActive, isPast && styles.labelPast]}>
        {time}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  rowActive: {
    backgroundColor: Colors.primary,
  },
  left: { flexDirection: 'row', alignItems: 'center' },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.gold,
    marginRight: 10,
  },
  dotPlaceholder: { width: 8, height: 8, marginRight: 10 },
  label: { fontSize: 16, fontWeight: '600', color: Colors.text },
  labelActive: { color: Colors.white },
  labelPast: { color: Colors.textMuted },
  time: { fontSize: 16, fontWeight: '700', color: Colors.text },
  timeActive: { color: Colors.white },
});
