import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import Colors from '../constants/colors';

const CATEGORY_COLORS = {
  event: Colors.primary,
  meeting: Colors.gold,
  fundraiser: Colors.danger,
  general: Colors.textMuted,
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

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View
          style={[
            styles.categoryDot,
            { backgroundColor: CATEGORY_COLORS[item.category] || Colors.textMuted },
          ]}
        />
        <Text style={styles.title}>{item.title}</Text>
        {isRecent(item.createdAt) && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{t('announcements.newBadge')}</Text>
          </View>
        )}
      </View>
      <Text style={styles.body}>{item.body}</Text>
      {!!dateStr && <Text style={styles.date}>{dateStr}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  categoryDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  title: { fontSize: 16, fontWeight: '700', color: Colors.text, flex: 1 },
  badge: { backgroundColor: Colors.gold, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { color: Colors.white, fontSize: 11, fontWeight: '700' },
  body: { fontSize: 14, color: Colors.textMuted, lineHeight: 20 },
  date: { fontSize: 12, color: Colors.textMuted, marginTop: 8, textAlign: 'right' },
});
