import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/colors';
import { Spacing } from '../constants/theme';
import AnnouncementCard from '../components/AnnouncementCard';
import ScreenHeader from '../components/ScreenHeader';
import { subscribeToAnnouncements } from '../services/announcementsService';

export default function AnnouncementsScreen() {
  const { t } = useTranslation();
  const [announcements, setAnnouncements] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToAnnouncements(
      (items) => {
        setAnnouncements(items);
        setLoaded(true);
      },
      (err) => {
        console.warn('Announcements error (check Firebase config):', err.message);
        setLoaded(true);
      }
    );
    return unsubscribe;
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <ScreenHeader eyebrow={t('tabs.home')} title={t('announcements.title')} showMark />
      </View>
      <FlatList
        data={announcements}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <AnnouncementCard item={item} />}
        ListEmptyComponent={
          loaded ? (
            <View style={styles.empty}>
              <Ionicons name="megaphone-outline" size={34} color={Colors.textFaint} />
              <Text style={styles.emptyText}>{t('announcements.empty')}</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg },
  list: { paddingHorizontal: Spacing.xl, paddingBottom: 48 },
  empty: { alignItems: 'center', marginTop: 70, gap: 12 },
  emptyText: { textAlign: 'center', color: Colors.textMuted, fontSize: 14.5 },
});
