import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStripe } from '@stripe/stripe-react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/colors';
import { Radius, Shadows, Spacing, Typography } from '../constants/theme';
import { createPaymentIntent, createSubscription } from '../services/donationService';
import ScreenHeader from '../components/ScreenHeader';
import Card from '../components/Card';
import Button from '../components/Button';

const PRESET_AMOUNTS = [10, 20, 50, 100];

export default function DonateScreen() {
  const { t } = useTranslation();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [frequency, setFrequency] = useState('monthly'); // 'oneTime' | 'monthly'
  const [amount, setAmount] = useState(20);
  const [customAmount, setCustomAmount] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const effectiveAmount = customAmount ? Number(customAmount) : amount;

  const handleDonate = async () => {
    if (!effectiveAmount || effectiveAmount <= 0) {
      Alert.alert('', t('donate.chooseAmount'));
      return;
    }
    if (frequency === 'monthly' && !email) {
      Alert.alert('', t('contact.yourEmail'));
      return;
    }

    setLoading(true);
    try {
      const amountPence = Math.round(effectiveAmount * 100);
      let clientSecret;

      if (frequency === 'monthly') {
        const res = await createSubscription({ amountPence, email, name });
        clientSecret = res.clientSecret;
      } else {
        const res = await createPaymentIntent({ amountPence });
        clientSecret = res.clientSecret;
      }

      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: 'New Peckham Mosque',
        paymentIntentClientSecret: clientSecret,
        allowsDelayedPaymentMethods: false,
      });
      if (initError) throw initError;

      const { error: presentError } = await presentPaymentSheet();
      if (presentError) {
        if (presentError.code !== 'Canceled') {
          Alert.alert(t('donate.paymentFailed'), presentError.message);
        }
      } else {
        Alert.alert(t('donate.thankYouTitle'), t('donate.thankYouBody'));
      }
    } catch (e) {
      Alert.alert(t('donate.paymentFailed'), e.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <ScreenHeader eyebrow={t('donate.subtitle')} title={t('donate.title')} showMark />

        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.toggleBtn, frequency === 'oneTime' && styles.toggleBtnActive]}
            onPress={() => setFrequency('oneTime')}
          >
            <Text style={[styles.toggleText, frequency === 'oneTime' && styles.toggleTextActive]}>
              {t('donate.oneTime')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, frequency === 'monthly' && styles.toggleBtnActive]}
            onPress={() => setFrequency('monthly')}
          >
            <Text style={[styles.toggleText, frequency === 'monthly' && styles.toggleTextActive]}>
              {t('donate.monthly')}
            </Text>
          </TouchableOpacity>
        </View>

        <Card style={styles.amountCard}>
          <Text style={styles.label}>{t('donate.chooseAmount')}</Text>
          <View style={styles.amountRow}>
            {PRESET_AMOUNTS.map((val) => (
              <TouchableOpacity
                key={val}
                style={[
                  styles.amountChip,
                  amount === val && !customAmount && styles.amountChipActive,
                ]}
                onPress={() => {
                  setAmount(val);
                  setCustomAmount('');
                }}
              >
                <Text
                  style={[
                    styles.amountChipText,
                    amount === val && !customAmount && styles.amountChipTextActive,
                  ]}
                >
                  £{val}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>{t('donate.customAmount')}</Text>
          <View style={styles.inputWrap}>
            <Text style={styles.inputPrefix}>£</Text>
            <TextInput
              style={styles.inputWithPrefix}
              placeholder="0"
              placeholderTextColor={Colors.textFaint}
              keyboardType="numeric"
              value={customAmount}
              onChangeText={setCustomAmount}
            />
          </View>

          {frequency === 'monthly' && (
            <>
              <Text style={styles.label}>{t('contact.yourName')}</Text>
              <TextInput style={styles.input} value={name} onChangeText={setName} />
              <Text style={styles.label}>{t('contact.yourEmail')}</Text>
              <TextInput
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </>
          )}
        </Card>

        <Button
          title={`${t('donate.donateNow')} · £${effectiveAmount || 0}`}
          onPress={handleDonate}
          loading={loading}
          icon={!loading && <Ionicons name="heart" size={18} color={Colors.white} />}
          style={{ marginTop: Spacing.lg }}
        />

        <View style={styles.noteRow}>
          <Ionicons name="shield-checkmark-outline" size={14} color={Colors.textMuted} />
          <Text style={styles.note}>{t('donate.secureNote')}</Text>
        </View>
        {frequency === 'monthly' && (
          <Text style={[styles.note, { textAlign: 'center' }]}>{t('donate.cancelAnytime')}</Text>
        )}

        <TouchableOpacity onPress={() => Linking.openURL('https://hasene.org.uk')}>
          <Text style={styles.haseneLink}>{t('donate.haseneNote')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { padding: Spacing.xl, paddingBottom: 60 },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.md,
    padding: 4,
    marginBottom: Spacing.lg,
  },
  toggleBtn: { flex: 1, paddingVertical: 11, borderRadius: 10, alignItems: 'center' },
  toggleBtnActive: { backgroundColor: Colors.primary, ...Shadows.floating },
  toggleText: { fontWeight: '700', color: Colors.primaryDark },
  toggleTextActive: { color: Colors.white },
  amountCard: { marginBottom: 0 },
  label: { ...Typography.caption, color: Colors.text, marginBottom: 10, marginTop: 6, textTransform: 'uppercase', letterSpacing: 0.3 },
  amountRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 6 },
  amountChip: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primarySoft,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  amountChipActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  amountChipText: { fontWeight: '700', color: Colors.text },
  amountChipTextActive: { color: Colors.white },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primarySoft,
    borderRadius: Radius.sm,
    marginBottom: 6,
    paddingHorizontal: 14,
  },
  inputPrefix: { fontSize: 16, fontWeight: '800', color: Colors.textMuted, marginRight: 4 },
  inputWithPrefix: { flex: 1, paddingVertical: 12, fontSize: 16, fontWeight: '700', color: Colors.text },
  input: {
    backgroundColor: Colors.primarySoft,
    borderRadius: Radius.sm,
    padding: 13,
    marginBottom: 6,
    fontSize: 15,
    color: Colors.text,
  },
  noteRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 18 },
  note: { fontSize: 12, color: Colors.textMuted },
  haseneLink: { fontSize: 13, color: Colors.primary, marginTop: 18, textAlign: 'center', fontWeight: '700' },
});
