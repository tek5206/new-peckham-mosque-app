import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/colors';
import MosqueInfo from '../constants/mosqueInfo';
import { Radius, Spacing, Typography } from '../constants/theme';
import ScreenHeader from '../components/ScreenHeader';
import Card from '../components/Card';
import Button from '../components/Button';

const SOCIAL_META = {
  facebook: { icon: 'logo-facebook', color: '#1877F2' },
  instagram: { icon: 'logo-instagram', color: '#C13584' },
  youtube: { icon: 'logo-youtube', color: '#FF0000' },
  tiktok: { icon: 'logo-tiktok', color: '#111111' },
  whatsapp: { icon: 'logo-whatsapp', color: '#25D366' },
};

function InfoRow({ icon, label, value, onPress, last }) {
  return (
    <TouchableOpacity
      style={[styles.infoRow, !last && styles.infoRowDivider]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
    >
      <View style={styles.infoIconWrap}>
        <Ionicons name={icon} size={18} color={Colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
      {onPress && <Ionicons name="chevron-forward" size={18} color={Colors.textFaint} />}
    </TouchableOpacity>
  );
}

export default function ContactScreen() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const update = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const openMaps = () => {
    const { latitude, longitude } = MosqueInfo.coordinates;
    const url = Platform.select({
      ios: `maps:0,0?q=${MosqueInfo.name}@${latitude},${longitude}`,
      android: `geo:0,0?q=${latitude},${longitude}(${MosqueInfo.name})`,
    });
    Linking.openURL(url);
  };

  const sendMessage = () => {
    if (!form.name || !form.email || !form.message) {
      Alert.alert('', t('contact.sendMessage'));
      return;
    }
    const subject = encodeURIComponent(form.subject || t('contact.sendMessage'));
    const body = encodeURIComponent(
      `${t('contact.yourName')}: ${form.name}\n${t('contact.yourEmail')}: ${form.email}\n${t(
        'contact.yourPhone'
      )}: ${form.phone}\n\n${form.message}`
    );
    Linking.openURL(`mailto:${MosqueInfo.email}?subject=${subject}&body=${body}`);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <ScreenHeader eyebrow={MosqueInfo.name} title={t('contact.title')} showMark />

        <Card padded={false} style={styles.card}>
          <InfoRow
            icon="location-outline"
            label={t('contact.address')}
            value={MosqueInfo.address}
            onPress={openMaps}
          />
          <InfoRow
            icon="call-outline"
            label={`${t('contact.phone')} (${t('contact.phoneHours')})`}
            value={MosqueInfo.phone}
            onPress={() => Linking.openURL(`tel:${MosqueInfo.phone.replace(/\s/g, '')}`)}
          />
          <InfoRow
            icon="mail-outline"
            label={t('contact.email')}
            value={MosqueInfo.email}
            onPress={() => Linking.openURL(`mailto:${MosqueInfo.email}`)}
            last
          />
        </Card>

        <Button
          title={t('contact.openMaps')}
          variant="secondary"
          onPress={openMaps}
          icon={<Ionicons name="map-outline" size={18} color={Colors.primaryDark} />}
          style={{ marginTop: Spacing.lg, marginBottom: Spacing.xl }}
        />

        <Text style={styles.sectionLabel}>{t('contact.social')}</Text>
        <View style={styles.socialRow}>
          {Object.entries(MosqueInfo.social).map(([key, url]) => {
            const meta = SOCIAL_META[key] || { icon: 'link-outline', color: Colors.primary };
            return (
              <TouchableOpacity
                key={key}
                style={styles.socialChip}
                activeOpacity={0.8}
                onPress={() => Linking.openURL(url)}
              >
                <Ionicons name={meta.icon} size={16} color={meta.color} />
                <Text style={styles.socialChipText}>{key}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>{t('contact.sendMessage')}</Text>
        <Card style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder={t('contact.yourName')}
            placeholderTextColor={Colors.textFaint}
            value={form.name}
            onChangeText={update('name')}
          />
          <TextInput
            style={styles.input}
            placeholder={t('contact.yourEmail')}
            placeholderTextColor={Colors.textFaint}
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={update('email')}
          />
          <TextInput
            style={styles.input}
            placeholder={t('contact.yourPhone')}
            placeholderTextColor={Colors.textFaint}
            keyboardType="phone-pad"
            value={form.phone}
            onChangeText={update('phone')}
          />
          <TextInput
            style={styles.input}
            placeholder={t('contact.subject')}
            placeholderTextColor={Colors.textFaint}
            value={form.subject}
            onChangeText={update('subject')}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={t('contact.message')}
            placeholderTextColor={Colors.textFaint}
            multiline
            numberOfLines={4}
            value={form.message}
            onChangeText={update('message')}
          />
          <Button
            title={t('contact.send')}
            onPress={sendMessage}
            icon={<Ionicons name="paper-plane-outline" size={17} color={Colors.white} />}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { padding: Spacing.xl, paddingBottom: 60 },
  card: { overflow: 'hidden' },
  infoRow: { flexDirection: 'row', alignItems: 'center', padding: 15, gap: 13 },
  infoRowDivider: { borderBottomWidth: 1, borderBottomColor: Colors.divider },
  infoIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLabel: { fontSize: 11.5, color: Colors.textMuted, fontWeight: '600' },
  infoValue: { fontSize: 15, fontWeight: '700', color: Colors.text, marginTop: 1 },
  sectionLabel: { ...Typography.h2, color: Colors.primaryDark, marginBottom: 12 },
  socialRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginBottom: Spacing.xl },
  socialChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: Colors.card,
    borderRadius: Radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  socialChipText: { color: Colors.text, fontWeight: '700', fontSize: 12.5, textTransform: 'capitalize' },
  form: { gap: 0 },
  input: {
    backgroundColor: Colors.primarySoft,
    borderRadius: Radius.sm,
    padding: 13,
    marginBottom: 12,
    fontSize: 15,
    color: Colors.text,
  },
  textArea: { height: 100, textAlignVertical: 'top' },
});
