import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/colors';
import { Radius, Shadows, Spacing, Typography } from '../constants/theme';
import { applyLanguage, loadStoredLanguage } from '../i18n';
import {
  getNotificationPreference,
  setNotificationPreference,
} from '../services/notificationService';
import ScreenHeader from '../components/ScreenHeader';
import Card from '../components/Card';
import { MosqueMark } from '../components/Logo';

const LANGUAGES = [
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
];

export default function SettingsScreen() {
  const { t } = useTranslation();
  const [language, setLanguage] = useState('tr');
  const [notifEnabled, setNotifEnabled] = useState(true);

  useEffect(() => {
    loadStoredLanguage().then(setLanguage);
    getNotificationPreference().then(setNotifEnabled);
  }, []);

  const onSelectLanguage = async (code) => {
    setLanguage(code);
    await applyLanguage(code);
  };

  const onToggleNotifications = async (value) => {
    setNotifEnabled(value);
    await setNotificationPreference(value);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <ScreenHeader title={t('settings.title')} showMark />

        <Text style={styles.sectionLabel}>{t('settings.language')}</Text>
        <Card padded={false} style={styles.card}>
          {LANGUAGES.map((lang, idx) => (
            <TouchableOpacity
              key={lang.code}
              style={[styles.langRow, idx < LANGUAGES.length - 1 && styles.rowDivider]}
              onPress={() => onSelectLanguage(lang.code)}
              activeOpacity={0.7}
            >
              <Text style={styles.flag}>{lang.flag}</Text>
              <Text style={styles.langLabel}>{lang.label}</Text>
              {language === lang.code ? (
                <View style={styles.radioActive}>
                  <Ionicons name="checkmark" size={13} color={Colors.white} />
                </View>
              ) : (
                <View style={styles.radio} />
              )}
            </TouchableOpacity>
          ))}
        </Card>

        <Text style={styles.sectionLabel}>{t('settings.notifications')}</Text>
        <Card style={styles.card}>
          <View style={styles.switchRow}>
            <View style={styles.switchIconWrap}>
              <Ionicons name="notifications-outline" size={18} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.langLabel}>{t('announcements.notifyMe')}</Text>
              <Text style={styles.switchDesc}>{t('settings.notificationsDesc')}</Text>
            </View>
            <Switch
              value={notifEnabled}
              onValueChange={onToggleNotifications}
              trackColor={{ true: Colors.primary, false: Colors.border }}
              thumbColor={Colors.white}
            />
          </View>
        </Card>

        <View style={styles.footer}>
          <MosqueMark size={40} />
          <Text style={styles.footerTitle}>{t('tabs.home')}</Text>
          <Text style={styles.version}>{t('settings.version')} 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { padding: Spacing.xl, paddingBottom: 60 },
  sectionLabel: { ...Typography.h3, color: Colors.primaryDark, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.4, opacity: 0.8 },
  card: { marginBottom: Spacing.xl, overflow: 'hidden' },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
  },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: Colors.divider },
  flag: { fontSize: 20 },
  langLabel: { fontSize: 15, color: Colors.text, fontWeight: '700', flex: 1 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: Colors.border },
  radioActive: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 13 },
  switchIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchDesc: { fontSize: 12, color: Colors.textMuted, marginTop: 3 },
  footer: { alignItems: 'center', marginTop: Spacing.lg, gap: 6 },
  footerTitle: { fontSize: 13, fontWeight: '800', color: Colors.primaryDark, marginTop: 4 },
  version: { textAlign: 'center', color: Colors.textFaint, fontSize: 12, fontWeight: '600' },
});
