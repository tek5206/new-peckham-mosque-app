import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/colors';
import MosqueInfo from '../constants/mosqueInfo';

function Section({ title, body }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionBody}>{body}</Text>
    </View>
  );
}

export default function AboutScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{t('about.title')}</Text>
        <Text style={styles.mosqueName}>{MosqueInfo.name}</Text>

        <Section title={t('about.orgTitle')} body={t('about.orgBody')} />
        <Section title={t('about.sheikhTitle')} body={t('about.sheikhBody')} />
        <Section title={t('about.servicesTitle')} body={t('about.servicesBody')} />

        <Text style={styles.disclaimer}>{t('about.disclaimer')}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { padding: 20, paddingBottom: 60 },
  title: { fontSize: 26, fontWeight: '800', color: Colors.primaryDark },
  mosqueName: { fontSize: 15, color: Colors.gold, fontWeight: '700', marginTop: 2, marginBottom: 20 },
  section: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: Colors.primaryDark, marginBottom: 8 },
  sectionBody: { fontSize: 14, color: Colors.text, lineHeight: 21 },
  disclaimer: { fontSize: 11, color: Colors.textMuted, marginTop: 10, fontStyle: 'italic' },
});
