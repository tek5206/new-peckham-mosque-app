import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/colors';
import MosqueInfo from '../constants/mosqueInfo';
import { Radius, Shadows, Spacing, Typography } from '../constants/theme';
import { MosqueMark } from '../components/Logo';
import Card from '../components/Card';
import {
  fetchTodayPrayerTimes,
  getNextPrayer,
  formatCountdown,
} from '../services/prayerTimesService';
import { subscribeToAnnouncements } from '../services/announcementsService';

const QUICK_LINKS = [
  { key: 'donate', icon: 'heart', route: 'DonateTab', tab: true },
  { key: 'about', icon: 'information-circle', route: 'AboutScreen' },
  { key: 'contact', icon: 'call', route: 'ContactScreen' },
  { key: 'settings', icon: 'settings', route: 'SettingsScreen' },
];

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

  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.heroSafe} edges={['top']}>
        <View style={styles.hero}>
          {/* Decorative geometric motif, echoing the octagonal mosque emblem */}
          <View pointerEvents="none" style={styles.heroDecor}>
            <View style={[styles.ring, styles.ringOuter]} />
            <View style={[styles.ring, styles.ringInner]} />
          </View>

          <View style={styles.heroTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.greeting}>{t('home.greeting')}</Text>
              <Text style={styles.mosqueName}>{MosqueInfo.name}</Text>
              <Text style={styles.dateLine}>{today}</Text>
            </View>
            <MosqueMark size={48} ring style={styles.heroMark} />
          </View>
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.prayerCard}
          onPress={() => navigation.navigate('PrayerTimesTab')}
        >
          <View style={styles.prayerCardTopRow}>
            <Text style={styles.prayerLabel}>{t('home.nextPrayer')}</Text>
            <Ionicons name="chevron-forward-circle" size={20} color={Colors.goldLight} />
          </View>
          {nextPrayer ? (
            <>
              <Text style={styles.prayerName}>{t(`prayer.${nextPrayer.name.toLowerCase()}`)}</Text>
              <Text style={styles.prayerCountdown}>{countdown}</Text>
              <View style={styles.prayerSubRow}>
                <Ionicons name="time-outline" size={14} color={Colors.goldLight} />
                <Text style={styles.prayerSub}>
                  {t('home.todayAt')} {nextPrayer.time}
                </Text>
              </View>
            </>
          ) : (
            <Text style={styles.prayerSub}>{t('prayer.loading')}</Text>
          )}
        </TouchableOpacity>

        {latestAnnouncement && (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate('AnnouncementsTab')}
          >
            <Card style={styles.announcementCard}>
              <View style={styles.announcementHeaderRow}>
                <View style={styles.announcementIconWrap}>
                  <Ionicons name="megaphone" size={16} color={Colors.goldDark} />
                </View>
                <Text style={styles.announcementLabel}>{t('home.latestAnnouncement')}</Text>
              </View>
              <Text style={styles.announcementTitle}>{latestAnnouncement.title}</Text>
              <Text style={styles.announcementBody} numberOfLines={2}>
                {latestAnnouncement.body}
              </Text>
            </Card>
          </TouchableOpacity>
        )}

        <Text style={styles.quickLinksLabel}>{t('home.quickLinks')}</Text>
        <View style={styles.grid}>
          {QUICK_LINKS.map((link) => (
            <QuickLink
              key={link.key}
              icon={link.icon}
              label={link.key === 'donate' ? t('tabs.donate') : t(`home.${link.key}`)}
              onPress={() => navigation.navigate(link.route)}
            />
          ))}
        </View>

        <View style={styles.footer}>
          <Image
            source={require('../../assets/branding/icmg-logo.png')}
            style={styles.footerLogo}
            resizeMode="contain"
          />
          <Text style={styles.footerText}>{MosqueInfo.organisation}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function QuickLink({ label, icon, onPress }) {
  return (
    <TouchableOpacity activeOpacity={0.85} style={styles.quickLink} onPress={onPress}>
      <View style={styles.quickLinkIconWrap}>
        <Ionicons name={icon} size={20} color={Colors.primary} />
      </View>
      <Text style={styles.quickLinkText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  heroSafe: { backgroundColor: Colors.primaryDark },
  hero: {
    backgroundColor: Colors.primaryDark,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxxl + 14,
    overflow: 'hidden',
  },
  heroDecor: { position: 'absolute', top: -40, right: -40 },
  ring: { position: 'absolute', borderRadius: 999, borderWidth: 1.5 },
  ringOuter: {
    width: 200,
    height: 200,
    borderColor: 'rgba(201,162,75,0.18)',
    top: 0,
    right: 0,
  },
  ringInner: {
    width: 140,
    height: 140,
    borderColor: 'rgba(201,162,75,0.14)',
    top: 30,
    right: 30,
  },
  heroTop: { flexDirection: 'row', alignItems: 'flex-start' },
  heroMark: { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 999 },
  greeting: { ...Typography.eyebrow, color: Colors.gold, textTransform: 'uppercase' },
  mosqueName: { ...Typography.display, color: Colors.white, marginTop: 6 },
  dateLine: { ...Typography.body, color: Colors.textOnDarkMuted, marginTop: 4 },

  scroll: { flex: 1 },
  container: { padding: Spacing.xl, paddingTop: 0, paddingBottom: 48 },

  prayerCard: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    padding: 22,
    marginTop: -34,
    marginBottom: Spacing.lg,
    ...Shadows.raised,
  },
  prayerCardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  prayerLabel: { color: Colors.goldLight, fontWeight: '700', fontSize: 13 },
  prayerName: { color: Colors.white, fontSize: 22, fontWeight: '800', marginTop: 10 },
  prayerCountdown: { color: Colors.white, fontSize: 42, fontWeight: '800', marginTop: 4, letterSpacing: 0.5 },
  prayerSubRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 5 },
  prayerSub: { color: Colors.goldLight, fontSize: 13 },

  announcementCard: { marginBottom: Spacing.lg },
  announcementHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  announcementIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.goldLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  announcementLabel: { fontSize: 12.5, color: Colors.goldDark, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.4 },
  announcementTitle: { fontSize: 17, fontWeight: '800', color: Colors.text },
  announcementBody: { fontSize: 13.5, color: Colors.textMuted, marginTop: 4, lineHeight: 19 },

  quickLinksLabel: { ...Typography.h2, color: Colors.primaryDark, marginBottom: 12, marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  quickLink: {
    flexGrow: 1,
    minWidth: '45%',
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    paddingVertical: 20,
    alignItems: 'center',
    gap: 8,
    ...Shadows.card,
  },
  quickLinkIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLinkText: { color: Colors.primaryDark, fontWeight: '700', fontSize: 13.5 },

  footer: { alignItems: 'center', marginTop: Spacing.xxl, gap: 10, opacity: 0.85 },
  footerLogo: { width: 120, height: 30 },
  footerText: { fontSize: 11.5, color: Colors.textFaint, fontWeight: '600', textAlign: 'center' },
});
