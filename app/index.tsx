import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { router, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts, fontSizes, radii, sizes, spacing } from '../constants/theme';
import { isSetupDone } from '../lib/storage';

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const [checkingSetup, setCheckingSetup] = useState(true);
  const [storageError, setStorageError] = useState(false);

  useFocusEffect(useCallback(() => {
    let active = true;
    setCheckingSetup(true);
    setStorageError(false);
    isSetupDone().then((done) => {
      if (!active) return;
      if (done) router.replace('/home');
      else setCheckingSetup(false);
    }).catch(() => {
      if (active) { setStorageError(true); setCheckingSetup(false); }
    });
    return () => { active = false; };
  }, []));

  if (checkingSetup) return <View style={styles.background} />;

  return (
    <View style={styles.background}>
      <Image
        source={require('../assets/images/welcome-hero-centered.png')}
        contentFit="cover"
        contentPosition="center"
        style={StyleSheet.absoluteFill}
        accessible={false}
      />
      <StatusBar style="light" />
      {/* The picture fills the screen; the text stays clear of the notch. */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: Math.max(insets.top + spacing.sectionGap, height * 0.097),
            paddingBottom: Math.max(insets.bottom, spacing.screenPadding),
          },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.logo} accessible accessibilityLabel="BorlaGo">
            <Image
              source={require('../assets/images/logo-mark-welcome.svg')}
              contentFit="contain"
              style={styles.logoMark}
            />
            <Text style={styles.logoWord}>
              Borla<Text style={styles.logoGo}>Go</Text>
            </Text>
          </View>
          <Text style={styles.tagline}>Tap. Picked up. Gone.</Text>
        </View>

        <View style={styles.footer}>
          {storageError ? <Text style={styles.collectorText}>We couldn’t read your saved setup. Please reopen the app to try again.</Text> : null}
          <Text style={styles.headline}>
            {'Your borla, collected\nfrom your door.'}
          </Text>
          <Pressable
            accessibilityRole="button"
            disabled={storageError}
            onPress={() => router.push('/sign-in')}
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          >
            <Text style={styles.buttonText}>Continue</Text>
            <Text style={styles.buttonArrow} accessible={false}>→</Text>
          </Pressable>
          <Pressable
            accessibilityRole="link"
            onPress={() => { /* Collector registration comes later. */ }}
            style={styles.collectorLink}
          >
            <Text style={styles.collectorText}>
              Are you a collector? <Text style={styles.joinText}>Join here</Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colors.welcomeBlue,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenPadding,
    gap: 200,
  },
  header: {
    alignItems: 'center',
    gap: spacing.sectionGap / 2,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sectionGap / 2, // 8 between the cropped icon and the word.
  },
  logoMark: {
    width: 54,
    height: 56,
  },
  logoWord: {
    fontFamily: fonts.extraBold,
    fontSize: fontSizes.welcomeLogo,
    lineHeight: 66,
    letterSpacing: -2,
    color: colors.surface,
  },
  logoGo: {
    color: colors.accent,
  },
  tagline: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.button,
    color: colors.surface,
    textAlign: 'center',
  },
  footer: {
    gap: spacing.sectionGap,
  },
  headline: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.welcomeHeadline,
    lineHeight: 29,
    color: colors.surface,
    textAlign: 'center',
    marginBottom: spacing.sectionGap / 2,
  },
  button: {
    minHeight: sizes.buttonHeight,
    paddingVertical: spacing.sectionGap / 2,
    paddingHorizontal: spacing.screenPadding,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sectionGap,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
  },
  pressed: {
    opacity: 0.85,
  },
  buttonText: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.button,
    color: colors.primary,
  },
  buttonArrow: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.titleLarge,
    lineHeight: 36,
    color: colors.primary,
  },
  collectorLink: {
    minHeight: sizes.minimumTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  collectorText: {
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.body,
    color: colors.surface,
    textAlign: 'center',
  },
  joinText: {
    color: colors.accent,
  },
});
