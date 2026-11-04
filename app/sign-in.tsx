import { useState } from 'react';
import { Keyboard, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { AuthScreen, ContinueButton, authStyles } from '../components/auth-screen';
import { colors, fonts, fontSizes, spacing } from '../constants/theme';

export default function SignInScreen() {
  const [phone, setPhone] = useState('');
  const isValid = phone.length === 9;

  function continueToCode() {
    if (!isValid) return;
    Keyboard.dismiss();
    router.push({ pathname: '/verify', params: { phone } });
  }

  return (
    <AuthScreen
      title="What’s your number?"
      description="We’ll send a 4-digit code by SMS to confirm it’s you."
      footer={<ContinueButton disabled={!isValid} onPress={continueToCode} />}
    >
      <Text style={authStyles.label}>Phone number</Text>
      <View style={styles.phoneRow}>
        <View style={[authStyles.input, styles.countryCode]}>
          <Text style={styles.countryText}>+233</Text>
        </View>
        <TextInput
          accessibilityLabel="Phone number, 9 digits without +233"
          style={[authStyles.input, styles.phoneInput]}
          value={phone}
          onChangeText={(text) => setPhone(text.replace(/\D/g, '').slice(0, 9))}
          keyboardType="number-pad"
          maxLength={9}
          placeholder="24 123 4567"
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.primary}
          autoComplete="tel-national"
        />
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  phoneRow: { flexDirection: 'row', gap: spacing.sectionGap / 2 },
  phoneInput: { flex: 1, minWidth: 0 },
  countryCode: { justifyContent: 'center', alignItems: 'center', minWidth: 90 },
  countryText: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.body,
    color: colors.navy,
  },
});
