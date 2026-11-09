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
import Colors from '../constants/colors';
import PrayerRow from '../components/PrayerRow';
import {
  fetchTodayPrayerTimes,
  getNextPrayer,
  formatCountdown,
} from '../services/prayerTimesService';

const PRAYER_ORDER = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

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
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={styles.title}>{t('prayer.title')}</Text>
        <Text style={styles.method}>{t('prayer.calculationMethod')}</Text>

        {loading ? (
          <ActivityIndicator color={Colors.primary} size="large" style={{ marginTop: 40 }} />
        ) : (
          <>
            {nextPrayer && (
              <View style={styles.countdownCard}>
                <Text style={styles.countdownLabel}>
                  {t('prayer.nextIn')} · {t(`prayer.${nextPrayer.name.toLowerCase()}`)}
                </Text>
                <Text style={styles.countdownValue}>{countdown}</Text>
              </View>
            )}

            {error && <Text style={styles.errorText}>{error}</Text>}

            <View style={styles.list}>
              {PRAYER_ORDER.map((key) => (
                <PrayerRow
                  key={key}
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
  container: { padding: 20 },
  title: { fontSize: 26, fontWeight: '800', color: Colors.primaryDark, marginBottom: 4 },
  method: { fontSize: 12, color: Colors.textMuted, marginBottom: 16 },
  countdownCard: {
    backgroundColor: Colors.primaryDark,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  countdownLabel: { color: Colors.goldLight, fontSize: 14, marginBottom: 6, fontWeight: '600' },
  countdownValue: { color: Colors.white, fontSize: 36, fontWeight: '800', letterSpacing: 1 },
  list: { marginTop: 4 },
  errorText: { color: Colors.danger, marginBottom: 12, textAlign: 'center' },
});
