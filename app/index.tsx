import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, fontSizes, radii, sizes, spacing } from '../constants/theme';

// This is only a setup check. The Welcome screen comes in step 2.
export default function Index() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>BorlaGo</Text>
      <Pressable
        accessibilityRole="button"
        onPress={() => Alert.alert('BorlaGo', 'Your test button works!')}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Test button</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.screenPadding,
    gap: spacing.sectionGap,
    backgroundColor: colors.background,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.titleLarge,
    color: colors.navy,
    textAlign: 'center',
  },
  button: {
    minHeight: sizes.buttonHeight,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radii.button,
    backgroundColor: colors.primary,
  },
  buttonText: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.button,
    color: colors.surface,
  },
});
