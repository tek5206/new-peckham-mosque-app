import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/colors';
import { Radius, Shadows, Spacing, Typography } from '../constants/theme';
import PrayerRow from '../components/PrayerRow';
import ScreenHeader from '../components/ScreenHeader';
import {
  fetchTodayPrayerTimes,
  getNextPrayer,
  formatCountdown,
} from '../services/prayerTimesService';

const PRAYER_ORDER = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
const PRAYER_ICONS = {
  Fajr: 'partly-sunny-outline',
  Sunrise: 'sunny-outline',
  Dhuhr: 'sunny',
  Asr: 'cloudy-outline',
  Maghrib: 'moon-outline',
  Isha: 'moon',
};

export default function PrayerTimesScreen() {
  const { t } = useTranslation();
  const [timings, setTimings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState('--:--:--');
  const [nextPrayer, setNextPrayer] = useState(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchTodayPrayerTimes();
      setTimings(data.timings);
    } catch (e) {
      setError(t('prayer.error'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [t]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!timings) return;
    const tick = () => {
      const next = getNextPrayer(timings);
      setNextPrayer(next);
      setCountdown(formatCountdown(next.date));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [timings]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        }
      >
        <ScreenHeader
          eyebrow={t('prayer.calculationMethod')}
          title={t('prayer.title')}
          showMark
        />

        {loading ? (
          <ActivityIndicator color={Colors.primary} size="large" style={{ marginTop: 40 }} />
        ) : (
          <>
            {nextPrayer && (
              <View style={styles.countdownCard}>
                <View style={styles.countdownIconWrap}>
                  <Ionicons
                    name={PRAYER_ICONS[nextPrayer.name] || 'time-outline'}
                    size={22}
                    color={Colors.goldLight}
                  />
                </View>
                <Text style={styles.countdownLabel}>
                  {t('prayer.nextIn')} · {t(`prayer.${nextPrayer.name.toLowerCase()}`)}
                </Text>
                <Text style={styles.countdownValue}>{countdown}</Text>
              </View>
            )}

            {error && (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={16} color={Colors.danger} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <View style={styles.list}>
              {PRAYER_ORDER.map((key) => (
                <PrayerRow
                  key={key}
                  icon={PRAYER_ICONS[key]}
                  label={t(`prayer.${key.toLowerCase()}`)}
                  time={timings?.[key] || '--:--'}
                  isNext={nextPrayer?.name === key}
                />
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { padding: Spacing.xl, paddingBottom: 48 },
  countdownCard: {
    backgroundColor: Colors.primaryDark,
    borderRadius: Radius.xl,
    padding: 24,
    alignItems: 'center',
    marginBottom: Spacing.xl,
    ...Shadows.raised,
  },
  countdownIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  countdownLabel: { color: Colors.goldLight, fontSize: 13.5, marginBottom: 8, fontWeight: '700' },
  countdownValue: { color: Colors.white, fontSize: 40, fontWeight: '800', letterSpacing: 0.5 },
  list: { marginTop: 4, gap: 10 },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.dangerLight,
    borderRadius: Radius.sm,
    padding: 12,
    marginBottom: Spacing.lg,
  },
  errorText: { color: Colors.danger, ...Typography.caption },
});
