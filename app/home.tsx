import { useCallback, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Image } from 'expo-image';

import { AuthScreen } from '../components/auth-screen';
import { colors, fonts, fontSizes, radii, sizes, spacing } from '../constants/theme';
import { getLocation, getUsualWaste, resetSetup, SavedLocation, UsualWaste } from '../lib/storage';

// This only proves that setup is saved. The real Home screen is the next step.
export default function HomeScreen() {
  const [location, setLocation] = useState<SavedLocation | null>(null);
  const [waste, setWaste] = useState<UsualWaste | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [resetting, setResetting] = useState(false);

  useFocusEffect(useCallback(() => {
    let active = true;
    setLoading(true);
    Promise.all([getLocation(), getUsualWaste()]).then(([savedLocation, savedWaste]) => {
      if (!active) return;
      if (!savedLocation || !savedWaste) { router.replace('/'); return; }
      setLocation(savedLocation);
      setWaste(savedWaste);
      setError('');
    }).catch(() => { if (active) setError('Couldn’t load your setup. Please reopen the app to try again.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []));

  async function reset() {
    if (resetting) return;
    setResetting(true);
    try {
      await resetSetup();
      router.dismissAll();
      router.replace('/');
    } catch { Alert.alert('Couldn’t reset setup', 'Please try again.'); }
    finally { setResetting(false); }
  }

  return (
    <AuthScreen title="Home" description="Your setup is saved on this phone." showBack={false}>
      {loading ? <Text style={styles.text}>Loading your setup…</Text> : error ? <Text style={styles.text}>{error}</Text> : <>
        <Text style={styles.label}>Your pickup spot</Text>
        <Text style={styles.text}>{location?.address}</Text>
        {location?.landmark ? <Text style={styles.text}>{location.landmark}</Text> : null}
        <Text style={styles.label}>Your usual waste</Text>
        <Text style={styles.text}>{waste?.quantity} × {waste?.size} · {waste?.type}</Text>
        {waste?.photoUri ? <Image source={{ uri: waste.photoUri }} contentFit="cover" style={styles.photo} accessibilityLabel="Saved usual waste photo" /> : null}
      </>}
      <View>
        <Pressable accessibilityRole="button" disabled={resetting} onPress={reset} style={styles.resetButton}>
          <Text style={styles.resetText}>{resetting ? 'Resetting…' : 'Reset setup (for testing)'}</Text>
        </Pressable>
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  label: { fontFamily: fonts.bold, fontSize: fontSizes.section, color: colors.navy },
  text: { fontFamily: fonts.regular, fontSize: fontSizes.body, color: colors.textMuted },
  photo: { width: '100%', height: 150, borderRadius: radii.card },
  resetButton: { minHeight: sizes.minimumTouchTarget, justifyContent: 'center', paddingVertical: spacing.sectionGap },
  resetText: { fontFamily: fonts.medium, fontSize: fontSizes.helper, color: colors.primary },
});
