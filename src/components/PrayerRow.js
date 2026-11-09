import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/colors';
import { Radius, Shadows } from '../constants/theme';

export default function PrayerRow({ label, time, icon, isNext, isPast }) {
  return (
    <View style={[styles.row, isNext && styles.rowActive]}>
      <View style={styles.left}>
        <View style={[styles.iconWrap, isNext && styles.iconWrapActive]}>
          <Ionicons
            name={icon || 'time-outline'}
            size={17}
            color={isNext ? Colors.white : Colors.primary}
          />
        </View>
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
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: Radius.md,
    backgroundColor: Colors.card,
    ...Shadows.card,
  },
  rowActive: {
    backgroundColor: Colors.primary,
    shadowOpacity: 0,
    elevation: 2,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: { backgroundColor: 'rgba(255,255,255,0.16)' },
  label: { fontSize: 15.5, fontWeight: '700', color: Colors.text },
  labelActive: { color: Colors.white },
  labelPast: { color: Colors.textFaint },
  time: { fontSize: 15.5, fontWeight: '800', color: Colors.text },
  timeActive: { color: Colors.white },
});
