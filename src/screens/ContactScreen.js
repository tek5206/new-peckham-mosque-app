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
import Colors from '../constants/colors';
import MosqueInfo from '../constants/mosqueInfo';

function InfoRow({ icon, label, value, onPress }) {
  return (
    <TouchableOpacity style={styles.infoRow} onPress={onPress} disabled={!onPress}>
      <Text style={styles.infoIcon}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
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
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{t('contact.title')}</Text>

        <View style={styles.card}>
          <InfoRow icon="📍" label={t('contact.address')} value={MosqueInfo.address} onPress={openMaps} />
          <InfoRow
            icon="📞"
            label={`${t('contact.phone')} (${t('contact.phoneHours')})`}
            value={MosqueInfo.phone}
            onPress={() => Linking.openURL(`tel:${MosqueInfo.phone.replace(/\s/g, '')}`)}
          />
          <InfoRow
            icon="✉️"
            label={t('contact.email')}
            value={MosqueInfo.email}
            onPress={() => Linking.openURL(`mailto:${MosqueInfo.email}`)}
          />
        </View>

        <TouchableOpacity style={styles.mapsBtn} onPress={openMaps}>
          <Text style={styles.mapsBtnText}>{t('contact.openMaps')}</Text>
        </TouchableOpacity>

        <Text style={styles.sectionLabel}>{t('contact.social')}</Text>
        <View style={styles.socialRow}>
          {Object.entries(MosqueInfo.social).map(([key, url]) => (
            <TouchableOpacity key={key} style={styles.socialChip} onPress={() => Linking.openURL(url)}>
              <Text style={styles.socialChipText}>{key}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>{t('contact.sendMessage')}</Text>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder={t('contact.yourName')}
            value={form.name}
            onChangeText={update('name')}
          />
          <TextInput
            style={styles.input}
            placeholder={t('contact.yourEmail')}
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={update('email')}
          />
          <TextInput
            style={styles.input}
            placeholder={t('contact.yourPhone')}
            keyboardType="phone-pad"
            value={form.phone}
            onChangeText={update('phone')}
          />
          <TextInput
            style={styles.input}
            placeholder={t('contact.subject')}
            value={form.subject}
            onChangeText={update('subject')}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={t('contact.message')}
            multiline
            numberOfLines={4}
            value={form.message}
            onChangeText={update('message')}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
            <Text style={styles.sendBtnText}>{t('contact.send')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { padding: 20, paddingBottom: 60 },
  title: { fontSize: 26, fontWeight: '800', color: Colors.primaryDark, marginBottom: 16 },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 14,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  infoIcon: { fontSize: 20 },
  infoLabel: { fontSize: 12, color: Colors.textMuted },
  infoValue: { fontSize: 15, fontWeight: '600', color: Colors.text },
  mapsBtn: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  mapsBtnText: { color: Colors.primaryDark, fontWeight: '700' },
  sectionLabel: { fontSize: 15, fontWeight: '800', color: Colors.primaryDark, marginBottom: 10 },
  socialRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  socialChip: {
    backgroundColor: Colors.gold,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  socialChipText: { color: Colors.white, fontWeight: '700', fontSize: 12, textTransform: 'capitalize' },
  form: { gap: 0 },
  input: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 15,
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  sendBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  sendBtnText: { color: Colors.white, fontWeight: '800', fontSize: 15 },
});
