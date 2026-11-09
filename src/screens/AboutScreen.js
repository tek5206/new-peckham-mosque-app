import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/colors';
import MosqueInfo from '../constants/mosqueInfo';
import { Radius, Shadows, Spacing, Typography } from '../constants/theme';
import { MosqueMark, IcmgWordmark } from '../components/Logo';
import Card from '../components/Card';
import ScreenHeader from '../components/ScreenHeader';

const SECTIONS = [
  { key: 'org', icon: 'business-outline' },
  { key: 'sheikh', icon: 'person-outline' },
  { key: 'services', icon: 'sparkles-outline' },
];

function Section({ icon, title, body }) {
  return (
    <Card style={styles.section}>
      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionIconWrap}>
          <Ionicons name={icon} size={17} color={Colors.primary} />
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <Text style={styles.sectionBody}>{body}</Text>
    </Card>
  );
}

export default function AboutScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <ScreenHeader eyebrow={MosqueInfo.name} title={t('about.title')} />

        <View style={styles.brandBand}>
          <MosqueMark size={64} ring />
          <View style={styles.brandDivider} />
          <IcmgWordmark width={150} />
        </View>

        {SECTIONS.map((s) => (
          <Section
            key={s.key}
            icon={s.icon}
            title={t(`about.${s.key}Title`)}
            body={t(`about.${s.key}Body`)}
          />
        ))}

        <View style={styles.disclaimerBox}>
          <Ionicons name="information-circle-outline" size={15} color={Colors.textMuted} />
          <Text style={styles.disclaimer}>{t('about.disclaimer')}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { padding: Spacing.xl, paddingBottom: 60 },
  brandBand: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    paddingVertical: 26,
    marginBottom: Spacing.xl,
    gap: Spacing.lg,
    ...Shadows.card,
  },
  brandDivider: { width: 1, height: 40, backgroundColor: Colors.border },
  section: { marginBottom: Spacing.md },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  sectionIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: { ...Typography.h2, color: Colors.primaryDark, flex: 1 },
  sectionBody: { fontSize: 14.5, color: Colors.text, lineHeight: 22 },
  disclaimerBox: {
    flexDirection: 'row',
    gap: 8,
    marginTop: Spacing.sm,
    paddingHorizontal: 4,
  },
  disclaimer: { flex: 1, fontSize: 11.5, color: Colors.textMuted, fontStyle: 'italic', lineHeight: 16 },
});
