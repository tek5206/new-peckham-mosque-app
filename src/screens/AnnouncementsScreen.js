import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/colors';
import AnnouncementCard from '../components/AnnouncementCard';
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
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('announcements.title')}</Text>
      </View>
      <FlatList
        data={announcements}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <AnnouncementCard item={item} />}
        ListEmptyComponent={
          loaded ? <Text style={styles.empty}>{t('announcements.empty')}</Text> : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  title: { fontSize: 26, fontWeight: '800', color: Colors.primaryDark },
  list: { paddingHorizontal: 20, paddingBottom: 40 },
  empty: { textAlign: 'center', color: Colors.textMuted, marginTop: 60, fontSize: 15 },
});
