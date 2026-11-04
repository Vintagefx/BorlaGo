import { useRef, useState } from 'react';
import type { ComponentRef } from 'react';
import { Keyboard, Text, TextInput } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { AuthScreen, ContinueButton, authStyles } from '../components/auth-screen';
import { saveFakeProfile } from '../constants/fake-auth';
import { colors } from '../constants/theme';

export default function YourNameScreen() {
  const { phone = '' } = useLocalSearchParams<{ phone: string }>();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const lastNameInput = useRef<ComponentRef<typeof TextInput>>(null);
  const isValid = firstName.trim().length > 0 && lastName.trim().length > 0;

  function saveName() {
    if (!isValid) return;
    saveFakeProfile(phone, firstName, lastName);
    Keyboard.dismiss();
    router.push({ pathname: '/setup-location', params: { phone } });
  }

  return (
    <AuthScreen
      title="What’s your name?"
      footer={<ContinueButton disabled={!isValid} onPress={saveName} />}
    >
      <Text style={authStyles.label}>First name</Text>
      <TextInput
        accessibilityLabel="First name"
        style={authStyles.input}
        value={firstName}
        onChangeText={setFirstName}
        placeholder="First name"
        placeholderTextColor={colors.textMuted}
        selectionColor={colors.primary}
        autoCapitalize="words"
        autoComplete="given-name"
        autoCorrect={false}
        returnKeyType="next"
        onSubmitEditing={() => lastNameInput.current?.focus()}
        submitBehavior="submit"
      />
      <Text style={authStyles.label}>Last name</Text>
      <TextInput
        ref={lastNameInput}
        accessibilityLabel="Last name"
        style={authStyles.input}
        value={lastName}
        onChangeText={setLastName}
        placeholder="Last name"
        placeholderTextColor={colors.textMuted}
        selectionColor={colors.primary}
        autoCapitalize="words"
        autoComplete="family-name"
        autoCorrect={false}
        returnKeyType="done"
        onSubmitEditing={saveName}
      />
    </AuthScreen>
  );
}
