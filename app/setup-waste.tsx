import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { Armchair, Camera, Check, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react-native';

import { AuthScreen, ContinueButton, authStyles } from '../components/auth-screen';
import { colors, fonts, fontSizes, radii, sizes, spacing } from '../constants/theme';
import { getLocation, getUsualWaste, saveUsualWaste, WasteSize, WasteType } from '../lib/storage';

const sizeOptions: { name: WasteSize; description: string; icon: typeof ShoppingBag }[] = [
  { name: 'Small bag', description: '1 shopping bag', icon: ShoppingBag },
  { name: 'Large bag', description: 'Rice-sack size', icon: ShoppingBag },
  { name: 'Full bin', description: 'A wheelie or drum bin', icon: Trash2 },
  { name: 'Bulky item', description: 'Furniture, appliances', icon: Armchair },
];
const wasteTypes: WasteType[] = ['General', 'Plastics', 'Garden', 'Mixed'];

export default function SetupWasteScreen() {
  const [size, setSize] = useState<WasteSize | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [type, setType] = useState<WasteType | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [picking, setPicking] = useState(false);

  useEffect(() => {
    let active = true;
    getUsualWaste().then((saved) => {
      if (!active || !saved) return;
      setSize(saved.size);
      setQuantity(saved.quantity);
      setType(saved.type);
      setPhotoUri(saved.photoUri);
    }).catch(() => {
      if (active) Alert.alert('Couldn’t load your usual waste', 'You can choose your usual waste again below.');
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function pickPhoto() {
    if (picking || saving) return;
    setPicking(true);
    try {
      // The system photo picker gives access to the selected photo only.
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.6 });
      if (!result.canceled) setPhotoUri(result.assets[0].uri);
    } catch {
      Alert.alert('Couldn’t open your photos', 'You can try again or continue without a photo.');
    } finally { setPicking(false); }
  }

  async function finish() {
    if (!size || !type || saving || loading || picking) return;
    setSaving(true);
    try {
      if (!await getLocation()) {
        Alert.alert('Choose your pickup spot first', 'Please save your location before finishing setup.');
        router.replace('/setup-location');
        return;
      }
      await saveUsualWaste({ size, quantity, type, photoUri });
      // Remove the setup screens so Back does not reopen a completed setup.
      router.dismissAll();
      router.replace('/home');
    } catch {
      Alert.alert('Couldn’t save your usual waste', 'Please try again. Your choices are still here.');
    } finally { setSaving(false); }
  }

  return (
    <AuthScreen
      step={2}
      title="What does your usual waste look like?"
      description="We’ll remember it. Next time, you just tap Find Collector."
      footer={<ContinueButton label={saving ? 'Saving…' : 'Save and finish'} disabled={!size || !type || loading || saving || picking} onPress={finish} />}
    >
      <Text style={authStyles.label}>Size</Text>
      <View style={styles.sizeGrid}>
        {sizeOptions.map((option) => {
          const selected = size === option.name;
          const Icon = option.icon;
          return (
            <Pressable
              key={option.name}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              accessibilityLabel={`${option.name}, ${option.description}`}
              disabled={loading || saving}
              onPress={() => setSize(option.name)}
              style={[styles.sizeCard, selected && styles.selectedCard]}
            >
              <Icon size={24} color={selected ? colors.primary : colors.navy} strokeWidth={2} />
              {selected ? <View style={styles.tick}><Check size={15} color={colors.surface} strokeWidth={3} /></View> : null}
              <Text style={styles.cardTitle}>{option.name}</Text>
              <Text style={styles.helper}>{option.description}</Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.quantityRow}>
        <View style={styles.quantityLabel}>
          <Text style={authStyles.label}>How many?</Text>
          <Text style={styles.helper}>On a normal pickup day</Text>
        </View>
        <Pressable
          accessibilityRole="button" accessibilityLabel="Decrease quantity"
          accessibilityState={{ disabled: quantity === 1 }}
          disabled={quantity === 1 || saving || loading}
          onPress={() => setQuantity((value) => Math.max(1, value - 1))}
          style={[styles.quantityButton, quantity === 1 && styles.faded]}
        ><Minus size={22} color={colors.navy} /></Pressable>
        <Text accessibilityLiveRegion="polite" style={styles.quantity}>{quantity}</Text>
        <Pressable
          accessibilityRole="button" accessibilityLabel="Increase quantity"
          accessibilityState={{ disabled: quantity === 10 }}
          disabled={quantity === 10 || saving || loading}
          onPress={() => setQuantity((value) => Math.min(10, value + 1))}
          style={[styles.quantityButton, styles.addButton, quantity === 10 && styles.faded]}
        ><Plus size={22} color={colors.surface} /></Pressable>
      </View>
      <Text style={authStyles.label}>Type of waste</Text>
      <View style={styles.pills}>
        {wasteTypes.map((option) => {
          const selected = type === option;
          return (
            <Pressable
              key={option} accessibilityRole="radio" accessibilityState={{ checked: selected }}
              onPress={() => setType(option)} disabled={saving || loading}
              style={[styles.pill, selected && styles.selectedPill]}
            >
              {selected ? <View style={styles.orangeDot} /> : null}
              <Text style={[styles.pillText, selected && styles.selectedPillText]}>{option}</Text>
            </Pressable>
          );
        })}
      </View>
      <Pressable accessibilityRole="button" disabled={picking || saving || loading} onPress={pickPhoto} style={styles.photoButton}>
        <Camera size={22} color={colors.primary} />
        <Text style={styles.photoText}>{picking ? 'Opening photos…' : photoUri ? 'Change photo' : 'Add a photo of it (optional)'}</Text>
      </Pressable>
      {photoUri ? <View style={styles.photoFrame}>
        <Image source={{ uri: photoUri }} contentFit="cover" style={styles.photo} accessibilityLabel="Your usual waste photo" />
        <Pressable accessibilityRole="button" accessibilityLabel="Remove photo" disabled={saving} onPress={() => setPhotoUri(null)} style={styles.removePhoto}>
          <X size={20} color={colors.navy} />
        </Pressable>
      </View> : null}
      <Text style={[styles.helper, styles.profileNote]}>You can change this anytime in Profile.</Text>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  sizeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  sizeCard: { width: '48%', flexGrow: 1, minHeight: 112, padding: 12, gap: 4, borderRadius: radii.card, borderWidth: 2, borderColor: colors.border, backgroundColor: colors.surface },
  selectedCard: { borderColor: colors.primary, backgroundColor: colors.surfaceTint },
  tick: { position: 'absolute', right: 10, top: 10, width: 23, height: 23, borderRadius: radii.pill, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontFamily: fonts.bold, fontSize: fontSizes.body, color: colors.navy },
  helper: { fontFamily: fonts.regular, fontSize: fontSizes.helper, color: colors.textMuted },
  quantityRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  quantityLabel: { flex: 1, gap: 4 },
  quantityButton: { width: sizes.minimumTouchTarget, height: sizes.minimumTouchTarget, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  addButton: { backgroundColor: colors.primary, borderColor: colors.primary },
  quantity: { minWidth: 24, textAlign: 'center', fontFamily: fonts.extraBold, fontSize: fontSizes.title, color: colors.navy },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: { minHeight: sizes.minimumTouchTarget, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  selectedPill: { backgroundColor: colors.primary, borderColor: colors.primary },
  pillText: { fontFamily: fonts.semiBold, fontSize: fontSizes.body, color: colors.navy },
  selectedPillText: { color: colors.surface },
  orangeDot: { width: 7, height: 7, borderRadius: radii.pill, backgroundColor: colors.accent },
  photoButton: { minHeight: sizes.inputHeight, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.primary, borderRadius: radii.input, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 10 },
  photoText: { flexShrink: 1, fontFamily: fonts.semiBold, fontSize: fontSizes.body, color: colors.primary },
  photoFrame: { borderRadius: radii.card, overflow: 'hidden' },
  photo: { width: '100%', height: 150 },
  removePhoto: { position: 'absolute', right: 8, top: 8, width: sizes.minimumTouchTarget, height: sizes.minimumTouchTarget, backgroundColor: colors.surface, borderRadius: radii.pill, alignItems: 'center', justifyContent: 'center' },
  profileNote: { textAlign: 'center' },
  faded: { opacity: 0.45 },
});
