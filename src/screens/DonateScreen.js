import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStripe } from '@stripe/stripe-react-native';
import Colors from '../constants/colors';
import { createPaymentIntent, createSubscription } from '../services/donationService';

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
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{t('donate.title')}</Text>
        <Text style={styles.subtitle}>{t('donate.subtitle')}</Text>

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
        <TextInput
          style={styles.input}
          placeholder="£"
          keyboardType="numeric"
          value={customAmount}
          onChangeText={setCustomAmount}
        />

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

        <TouchableOpacity style={styles.donateBtn} onPress={handleDonate} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.donateBtnText}>
              {t('donate.donateNow')} · £{effectiveAmount || 0}
            </Text>
          )}
        </TouchableOpacity>

        <Text style={styles.note}>{t('donate.secureNote')}</Text>
        {frequency === 'monthly' && <Text style={styles.note}>{t('donate.cancelAnytime')}</Text>}

        <TouchableOpacity onPress={() => Linking.openURL('https://hasene.org.uk')}>
          <Text style={styles.haseneLink}>{t('donate.haseneNote')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { padding: 20, paddingBottom: 60 },
  title: { fontSize: 26, fontWeight: '800', color: Colors.primaryDark },
  subtitle: { fontSize: 14, color: Colors.textMuted, marginTop: 6, marginBottom: 20 },
  toggleRow: { flexDirection: 'row', backgroundColor: Colors.primaryLight, borderRadius: 12, padding: 4, marginBottom: 20 },
  toggleBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  toggleBtnActive: { backgroundColor: Colors.primary },
  toggleText: { fontWeight: '600', color: Colors.primaryDark },
  toggleTextActive: { color: Colors.white },
  label: { fontSize: 14, fontWeight: '700', color: Colors.text, marginBottom: 8, marginTop: 6 },
  amountRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  amountChip: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  amountChipActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  amountChipText: { fontWeight: '700', color: Colors.text },
  amountChipTextActive: { color: Colors.white },
  input: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    fontSize: 15,
  },
  donateBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  donateBtnText: { color: Colors.white, fontWeight: '800', fontSize: 16 },
  note: { fontSize: 12, color: Colors.textMuted, marginTop: 14, textAlign: 'center' },
  haseneLink: { fontSize: 13, color: Colors.primary, marginTop: 18, textAlign: 'center', fontWeight: '600' },
});
