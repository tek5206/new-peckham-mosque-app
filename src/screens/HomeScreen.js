import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/colors';
import MosqueInfo from '../constants/mosqueInfo';
import {
  fetchTodayPrayerTimes,
  getNextPrayer,
  formatCountdown,
} from '../services/prayerTimesService';
import { subscribeToAnnouncements } from '../services/announcementsService';

export default function HomeScreen({ navigation }) {
  const { t } = useTranslation();
  const [nextPrayer, setNextPrayer] = useState(null);
  const [countdown, setCountdown] = useState('--:--:--');
  const [latestAnnouncement, setLatestAnnouncement] = useState(null);

  useEffect(() => {
    let timings;
    fetchTodayPrayerTimes()
      .then((data) => {
        timings = data.timings;
      })
      .catch(() => {});

    const interval = setInterval(() => {
      if (timings) {
        const next = getNextPrayer(timings);
        setNextPrayer(next);
        setCountdown(formatCountdown(next.date));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToAnnouncements(
      (items) => setLatestAnnouncement(items[0] || null),
      () => {}
    );
    return unsubscribe;
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.greeting}>{t('home.greeting')}</Text>
          <Text style={styles.mosqueName}>{MosqueInfo.name}</Text>
        </View>

        <TouchableOpacity
          style={styles.prayerCard}
          onPress={() => navigation.navigate('PrayerTimesTab')}
        >
          <Text style={styles.prayerLabel}>{t('home.nextPrayer')}</Text>
          {nextPrayer ? (
            <>
              <Text style={styles.prayerName}>{t(`prayer.${nextPrayer.name.toLowerCase()}`)}</Text>
              <Text style={styles.prayerCountdown}>{countdown}</Text>
              <Text style={styles.prayerSub}>
                {t('home.todayAt')} {nextPrayer.time}
              </Text>
            </>
          ) : (
            <Text style={styles.prayerSub}>{t('prayer.loading')}</Text>
          )}
        </TouchableOpacity>

        {latestAnnouncement && (
          <TouchableOpacity
            style={styles.announcementCard}
            onPress={() => navigation.navigate('AnnouncementsTab')}
          >
            <Text style={styles.announcementLabel}>{t('home.latestAnnouncement')}</Text>
            <Text style={styles.announcementTitle}>{latestAnnouncement.title}</Text>
            <Text style={styles.announcementBody} numberOfLines={2}>
              {latestAnnouncement.body}
            </Text>
          </TouchableOpacity>
        )}

        <Text style={styles.quickLinksLabel}>{t('home.quickLinks')}</Text>
        <View style={styles.grid}>
          <QuickLink label={t('tabs.donate')} onPress={() => navigation.navigate('DonateTab')} />
          <QuickLink label={t('home.about')} onPress={() => navigation.navigate('AboutScreen')} />
          <QuickLink label={t('home.contact')} onPress={() => navigation.navigate('ContactScreen')} />
          <QuickLink label={t('home.settings')} onPress={() => navigation.navigate('SettingsScreen')} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function QuickLink({ label, onPress }) {
  return (
    <TouchableOpacity style={styles.quickLink} onPress={onPress}>
      <Text style={styles.quickLinkText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { padding: 20, paddingBottom: 40 },
  hero: { marginBottom: 20 },
  greeting: { fontSize: 15, color: Colors.gold, fontWeight: '700' },
  mosqueName: { fontSize: 26, fontWeight: '800', color: Colors.primaryDark, marginTop: 2 },
  prayerCard: {
    backgroundColor: Colors.primaryDark,
    borderRadius: 18,
    padding: 22,
    marginBottom: 16,
  },
  prayerLabel: { color: Colors.goldLight, fontWeight: '700', fontSize: 13, marginBottom: 6 },
  prayerName: { color: Colors.white, fontSize: 22, fontWeight: '800' },
  prayerCountdown: { color: Colors.white, fontSize: 38, fontWeight: '800', marginTop: 6, letterSpacing: 1 },
  prayerSub: { color: Colors.goldLight, marginTop: 6, fontSize: 13 },
  announcementCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  announcementLabel: { fontSize: 12, color: Colors.gold, fontWeight: '700', marginBottom: 4 },
  announcementTitle: { fontSize: 16, fontWeight: '700', color: Colors.text },
  announcementBody: { fontSize: 13, color: Colors.textMuted, marginTop: 4 },
  quickLinksLabel: { fontSize: 15, fontWeight: '800', color: Colors.primaryDark, marginBottom: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  quickLink: {
    flexGrow: 1,
    minWidth: '45%',
    backgroundColor: Colors.primaryLight,
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
  },
  quickLinkText: { color: Colors.primaryDark, fontWeight: '700' },
});
