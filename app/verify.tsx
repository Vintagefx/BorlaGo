import { useEffect, useRef, useState } from 'react';
import type { ComponentRef } from 'react';
import { Keyboard, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { AuthScreen, ContinueButton, authStyles } from '../components/auth-screen';
import { fakeVerificationCode, hasFakeProfile } from '../constants/fake-auth';
import { colors, fonts, fontSizes, radii, sizes, spacing } from '../constants/theme';

export default function VerifyScreen() {
  const { phone = '' } = useLocalSearchParams<{ phone: string }>();
  const [digits, setDigits] = useState(['', '', '', '']);
  const [activeBox, setActiveBox] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [resendAt, setResendAt] = useState(() => Date.now() + 30000);
  const inputs = useRef<(ComponentRef<typeof TextInput> | null)[]>([]);
  const isComplete = digits.every((digit) => digit.length === 1);
  const formattedPhone = `${phone.slice(0, 2)} ${phone.slice(2, 5)} ${phone.slice(5)}`;

  useEffect(() => {
    // Use the clock so the countdown catches up after the app is in the background.
    const timer = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((resendAt - Date.now()) / 1000));
      setSecondsLeft(remaining);
      if (remaining === 0) clearInterval(timer);
    }, 250);
    return () => clearInterval(timer);
  }, [resendAt]);

  function updateDigit(index: number, text: string) {
    const numbers = text.replace(/\D/g, '');
    if (text && !numbers) return;
    const next = [...digits];
    next[index] = '';
    // Also allow a four-digit code to be pasted into the first box.
    for (let offset = 0; offset < numbers.length && index + offset < 4; offset++) {
      next[index + offset] = numbers[offset];
    }
    setDigits(next);
    setError('');
    if (numbers) inputs.current[Math.min(index + numbers.length, 3)]?.focus();
  }

  function verifyCode() {
    if (!isComplete) return;
    if (digits.join('') !== fakeVerificationCode) {
      setError('That code is not right. Try again.');
      setDigits(['', '', '', '']);
      inputs.current[0]?.focus();
      return;
    }
    Keyboard.dismiss();
    // Returning users already have a name in this temporary app session.
    router.push({
      pathname: hasFakeProfile(phone) ? '/setup-location' : '/your-name',
      params: { phone },
    });
  }

  function resendCode() {
    if (secondsLeft > 0) return;
    setDigits(['', '', '', '']);
    setError('');
    setSecondsLeft(30);
    setResendAt(Date.now() + 30000);
    inputs.current[0]?.focus();
  }

  return (
    <AuthScreen
      title="Enter the code"
      description={`We sent a code to +233 ${formattedPhone}`}
      footer={<ContinueButton disabled={!isComplete} onPress={verifyCode} />}
    >
      <Text style={authStyles.label}>Enter the code</Text>
      <View style={styles.codeRow}>
        {digits.map((digit, index) => (
          <TextInput
            key={index}
            ref={(input) => { inputs.current[index] = input; }}
            accessibilityLabel={`Code digit ${index + 1} of 4`}
            value={digit}
            onChangeText={(text) => updateDigit(index, text)}
            onFocus={() => setActiveBox(index)}
            onBlur={() => setActiveBox(null)}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
                inputs.current[index - 1]?.focus();
              }
            }}
            keyboardType="number-pad"
            autoFocus={index === 0}
            maxLength={4}
            selectTextOnFocus
            autoCorrect={false}
            selectionColor={colors.accent}
            style={[
              styles.codeInput,
              digit ? styles.filledBox : null,
              activeBox === index ? styles.activeBox : null,
            ]}
          />
        ))}
      </View>
      {error ? <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={styles.error}>{error}</Text> : null}
      <View style={styles.resendRow}>
        <Text style={styles.helper}>Didn’t get it?</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: secondsLeft > 0 }}
          disabled={secondsLeft > 0}
          onPress={resendCode}
          style={styles.resendButton}
        >
          <Text style={styles.resendText}>
            {secondsLeft > 0 ? `Resend in 0:${String(secondsLeft).padStart(2, '0')}` : 'Resend code'}
          </Text>
        </Pressable>
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  codeRow: { flexDirection: 'row', gap: spacing.sectionGap / 2 },
  codeInput: {
    flex: 1,
    minWidth: 0,
    minHeight: 64,
    borderWidth: 1,
    borderRadius: radii.input,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    fontFamily: fonts.bold,
    fontSize: fontSizes.title,
    color: colors.navy,
    textAlign: 'center',
    paddingVertical: spacing.sectionGap / 2,
  },
  filledBox: { borderColor: colors.primary, borderWidth: 2 },
  activeBox: { borderColor: colors.accent, borderWidth: 2 },
  error: { fontFamily: fonts.regular, fontSize: fontSizes.helper, color: colors.danger },
  resendRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 4 },
  helper: { fontFamily: fonts.regular, fontSize: fontSizes.helper, color: colors.textMuted },
  resendButton: { minHeight: sizes.minimumTouchTarget, justifyContent: 'center' },
  resendText: { fontFamily: fonts.semiBold, fontSize: fontSizes.helper, color: colors.primary },
});
