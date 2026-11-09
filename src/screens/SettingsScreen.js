import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/colors';
import { applyLanguage, loadStoredLanguage } from '../i18n';
import {
  getNotificationPreference,
  setNotificationPreference,
} from '../services/notificationService';

const LANGUAGES = [
  { code: 'tr', label: 'Türkçe' },
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'العربية' },
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
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{t('settings.title')}</Text>

        <Text style={styles.sectionLabel}>{t('settings.language')}</Text>
        <View style={styles.card}>
          {LANGUAGES.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={styles.langRow}
              onPress={() => onSelectLanguage(lang.code)}
            >
              <Text style={styles.langLabel}>{lang.label}</Text>
              <View style={[styles.radio, language === lang.code && styles.radioActive]} />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>{t('settings.notifications')}</Text>
        <View style={styles.card}>
          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.langLabel}>{t('announcements.notifyMe')}</Text>
              <Text style={styles.switchDesc}>{t('settings.notificationsDesc')}</Text>
            </View>
            <Switch
              value={notifEnabled}
              onValueChange={onToggleNotifications}
              trackColor={{ true: Colors.primary }}
            />
          </View>
        </View>

        <Text style={styles.version}>{t('settings.version')}: 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { padding: 20, paddingBottom: 60 },
  title: { fontSize: 26, fontWeight: '800', color: Colors.primaryDark, marginBottom: 20 },
  sectionLabel: { fontSize: 14, fontWeight: '800', color: Colors.primaryDark, marginBottom: 10 },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 24,
    overflow: 'hidden',
  },
  langRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  langLabel: { fontSize: 15, color: Colors.text, fontWeight: '600' },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: Colors.border },
  radioActive: { borderColor: Colors.primary, backgroundColor: Colors.primary },
  switchRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  switchDesc: { fontSize: 12, color: Colors.textMuted, marginTop: 4 },
  version: { textAlign: 'center', color: Colors.textMuted, fontSize: 12 },
});
