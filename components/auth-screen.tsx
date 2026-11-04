import { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRight, ChevronLeft } from 'lucide-react-native';

import { colors, fonts, fontSizes, radii, sizes, spacing } from '../constants/theme';

type AuthScreenProps = {
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  step?: 1 | 2;
  showBack?: boolean;
  scrollEnabled?: boolean;
};

// Shared layout keeps the back arrow, keyboard handling and spacing consistent.
export function AuthScreen({ title, description, children, footer, step, showBack = true, scrollEnabled = true }: AuthScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView style={styles.fill} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView scrollEnabled={scrollEnabled} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
          <View style={styles.header}>
          {showBack ? <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.canGoBack() ? router.back() : router.replace('/')}
            style={styles.backButton}
          >
            <ChevronLeft size={26} color={colors.navy} strokeWidth={2} />
          </Pressable> : null}
          {step ? <View style={styles.progress}>
            <Text style={styles.stepText}>Step {step} of 2 · one-time setup</Text>
            <View style={styles.progressBars}>
              <View style={[styles.progressBar, styles.completedBar]} />
              <View style={[styles.progressBar, step === 2 && styles.completedBar]} />
            </View>
          </View> : null}
          </View>
          <Text style={[styles.title, step && styles.setupTitle]}>{title}</Text>
          {description ? <Text style={styles.description}>{description}</Text> : null}
          <View style={[styles.form, step && styles.setupForm]}>{children}</View>
          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export function ContinueButton({ disabled = false, onPress, label = 'Continue' }: { disabled?: boolean; onPress: () => void; label?: string }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.continueButton, (disabled || pressed) && styles.faded]}
    >
      <Text style={styles.continueText}>{label}</Text>
      <ArrowRight size={24} color={colors.accent} strokeWidth={2} />
    </Pressable>
  );
}

// The phone, code and name screens share these text and input styles.
export const authStyles = StyleSheet.create({
  label: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.section,
    color: colors.navy,
  },
  input: {
    minHeight: sizes.inputHeight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.input,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.cardPadding,
    paddingVertical: 10,
    fontFamily: fonts.regular,
    fontSize: fontSizes.body,
    color: colors.navy,
  },
});

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  fill: { flex: 1 },
  content: {
    flexGrow: 1,
    padding: spacing.screenPadding,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: spacing.screenPadding },
  progress: { flex: 1, gap: 8 },
  stepText: { fontFamily: fonts.semiBold, fontSize: fontSizes.helper, color: colors.textMuted },
  progressBars: { flexDirection: 'row', gap: 6 },
  progressBar: { flex: 1, height: 5, borderRadius: radii.pill, backgroundColor: colors.border },
  completedBar: { backgroundColor: colors.accent },
  setupTitle: { fontSize: fontSizes.title, lineHeight: 33 },
  setupForm: { marginTop: spacing.screenPadding },
  backButton: {
    width: sizes.minimumTouchTarget,
    height: sizes.minimumTouchTarget,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.titleLarge,
    lineHeight: 40,
    letterSpacing: -0.8,
    color: colors.navy,
  },
  description: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.body,
    lineHeight: 24,
    color: colors.textMuted,
    marginTop: spacing.sectionGap,
  },
  form: {
    gap: spacing.sectionGap,
    marginTop: spacing.screenPadding + spacing.sectionGap,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: spacing.screenPadding * 2,
  },
  continueButton: {
    minHeight: sizes.buttonHeight,
    borderRadius: radii.button,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sectionGap,
    padding: spacing.cardPadding,
  },
  continueText: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.button,
    color: colors.surface,
  },
  faded: { opacity: 0.45 },
});
