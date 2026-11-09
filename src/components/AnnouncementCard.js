import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/colors';
import { Radius, Shadows } from '../constants/theme';

const CATEGORY_META = {
  event: { color: Colors.primary, icon: 'calendar-outline' },
  meeting: { color: Colors.goldDark, icon: 'people-outline' },
  fundraiser: { color: Colors.danger, icon: 'hand-left-outline' },
  general: { color: Colors.textMuted, icon: 'information-circle-outline' },
};

function isRecent(createdAt) {
  if (!createdAt?.toDate) return false;
  const diffHours = (Date.now() - createdAt.toDate().getTime()) / 36e5;
  return diffHours < 48;
}

export default function AnnouncementCard({ item }) {
  const { t } = useTranslation();
  const dateStr = item.createdAt?.toDate
    ? item.createdAt.toDate().toLocaleDateString()
    : '';
  const meta = CATEGORY_META[item.category] || CATEGORY_META.general;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={[styles.categoryIconWrap, { backgroundColor: `${meta.color}1A` }]}>
          <Ionicons name={meta.icon} size={15} color={meta.color} />
        </View>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        {isRecent(item.createdAt) && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{t('announcements.newBadge')}</Text>
          </View>
        )}
      </View>
      <Text style={styles.body}>{item.body}</Text>
      {!!dateStr && (
        <View style={styles.footerRow}>
          <Ionicons name="time-outline" size={12} color={Colors.textFaint} />
          <Text style={styles.date}>{dateStr}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: 16,
    marginBottom: 12,
    ...Shadows.card,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 10 },
  categoryIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 16, fontWeight: '800', color: Colors.text, flex: 1 },
  badge: { backgroundColor: Colors.gold, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { color: Colors.white, fontSize: 10.5, fontWeight: '800' },
  body: { fontSize: 14, color: Colors.textMuted, lineHeight: 20 },
  footerRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 10 },
  date: { fontSize: 11.5, color: Colors.textFaint, fontWeight: '600' },
});
