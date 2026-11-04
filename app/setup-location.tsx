import { useEffect, useRef, useState } from 'react';
import { Alert, Keyboard, StyleSheet, Text, TextInput, View } from 'react-native';
import MapView, { Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { LocateFixed, MapPin } from 'lucide-react-native';

import { AuthScreen, ContinueButton, authStyles } from '../components/auth-screen';
import { colors, fonts, fontSizes, radii, spacing } from '../constants/theme';
import { getLocation, saveLocation } from '../lib/storage';

// A manual starting point in Accra, used when GPS is unavailable.
const startingRegion: Region = { latitude: 5.6037, longitude: -0.187, latitudeDelta: 0.012, longitudeDelta: 0.012 };

export default function SetupLocationScreen() {
  const [region, setRegion] = useState(startingRegion);
  const [landmark, setLandmark] = useState('');
  const [chosen, setChosen] = useState(false);
  const [banner, setBanner] = useState('Finding your current location…');
  const [message, setMessage] = useState('');
  const [moving, setMoving] = useState(false);
  const [touchingMap, setTouchingMap] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resolved, setResolved] = useState<{ key: string; address: string } | null>(null);
  const userMovedMap = useRef(false);
  const coordinateKey = `${region.latitude},${region.longitude}`;
  const coordinates = `${region.latitude.toFixed(5)}, ${region.longitude.toFixed(5)}`;
  const address = resolved?.key === coordinateKey ? resolved.address : coordinates;

  useEffect(() => {
    let active = true;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    async function findLocation() {
      try {
        const saved = await getLocation();
        if (!active || userMovedMap.current) return;
        if (saved) {
          setRegion({ ...startingRegion, latitude: saved.latitude, longitude: saved.longitude });
          setLandmark(saved.landmark);
          setResolved({ key: `${saved.latitude},${saved.longitude}`, address: saved.address });
          setChosen(true);
          setBanner('Your saved pickup spot');
          return;
        }
        const permission = await Location.requestForegroundPermissionsAsync();
        if (!active || userMovedMap.current) return;
        if (!permission.granted) {
          setBanner('Choose your pickup spot');
          setMessage('That’s okay! You can still drag the map to put the pin at your pickup spot.');
          return;
        }
        // GPS may be slow indoors. Manual selection stays available throughout.
        const position = await Promise.race([
          Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
          new Promise<never>((_, reject) => {
            timeout = setTimeout(() => reject(new Error('GPS timeout')), 12000);
          }),
        ]);
        if (!active || userMovedMap.current) return;
        setRegion({ ...startingRegion, latitude: position.coords.latitude, longitude: position.coords.longitude });
        setChosen(true);
        setBanner('Using your current location');
      } catch {
        if (active && !userMovedMap.current) {
          setBanner('Choose your pickup spot');
          setMessage('We couldn’t find your location. Drag the map to choose your pickup spot instead.');
        }
      } finally { if (timeout) clearTimeout(timeout); }
    }
    void findLocation();
    return () => { active = false; if (timeout) clearTimeout(timeout); };
  }, []);

  useEffect(() => {
    if (!chosen) return;
    let active = true;
    // Wait until dragging stops, and ignore responses for a previous pin position.
    const timer = setTimeout(async () => {
      try {
        const [place] = await Location.reverseGeocodeAsync({ latitude: region.latitude, longitude: region.longitude });
        const street = [place?.streetNumber, place?.street].filter(Boolean).join(' ');
        const parts = [street || place?.name, place?.district, place?.city, place?.region].filter(Boolean);
        const foundAddress = [...new Set(parts)].join(', ');
        if (active && foundAddress) setResolved({ key: coordinateKey, address: foundAddress });
      } catch { /* The coordinates remain visible when an address is unavailable. */ }
    }, 500);
    return () => { active = false; clearTimeout(timer); };
  }, [chosen, coordinateKey, region.latitude, region.longitude]);

  function mapStopped(next: Region) {
    setMoving(false);
    if (!userMovedMap.current) return;
    setRegion(next);
    setChosen(true);
    setBanner('Your selected pickup spot');
    setMessage('');
  }

  async function save() {
    if (!chosen || moving || saving) return;
    setSaving(true);
    Keyboard.dismiss();
    try {
      await saveLocation({ latitude: region.latitude, longitude: region.longitude, address, landmark: landmark.trim() });
      router.push('/setup-waste');
    } catch {
      Alert.alert('Couldn’t save your location', 'Please try again. Your pickup spot is still on the screen.');
    } finally { setSaving(false); }
  }

  return (
    <AuthScreen
      step={1}
      title="Where is your waste?"
      description="Set this once. Every pickup will come to this spot."
      scrollEnabled={!touchingMap}
      footer={<ContinueButton label={saving ? 'Saving…' : 'Save my location'} disabled={!chosen || moving || saving} onPress={save} />}
    >
      <View style={styles.mapFrame}>
        <MapView
          style={StyleSheet.absoluteFill}
          region={region}
          rotateEnabled={false}
          pitchEnabled={false}
          onPanDrag={() => { userMovedMap.current = true; setMoving(true); }}
          onRegionChange={() => { if (userMovedMap.current) setMoving(true); }}
          onRegionChangeComplete={mapStopped}
          onTouchStart={() => setTouchingMap(true)}
          onTouchEnd={() => setTouchingMap(false)}
          onTouchCancel={() => setTouchingMap(false)}
          accessibilityLabel="Pickup map. Drag the map to choose your pickup location."
        />
        <View style={styles.pin} pointerEvents="none">
          <MapPin size={48} color={colors.primary} fill={colors.primary} strokeWidth={2} />
          <View style={styles.pinDot} />
        </View>
        <View style={styles.mapBadge} pointerEvents="none">
          <LocateFixed size={18} color={colors.primary} />
          <Text style={styles.badgeText}>{banner}</Text>
        </View>
        <View style={styles.mapHint} pointerEvents="none">
          <Text style={styles.badgeText}>Drag the map to move the pin</Text>
        </View>
      </View>
      {message ? <Text style={styles.helper}>{message}</Text> : null}
      <View style={styles.addressCard}>
        <MapPin size={25} color={colors.primary} />
        <View style={styles.addressText}>
          <Text style={styles.helper}>Your pickup spot</Text>
          <Text style={styles.address}>{chosen ? address : 'Move the pin to choose your spot'}</Text>
        </View>
      </View>
      <Text style={authStyles.label}>Help the collector find you <Text style={styles.helper}>(optional)</Text></Text>
      <TextInput
        style={authStyles.input}
        accessibilityLabel="Help the collector find you, optional landmark"
        value={landmark}
        onChangeText={setLandmark}
        placeholder="Blue gate opposite the church"
        placeholderTextColor={colors.textMuted}
        selectionColor={colors.primary}
        maxLength={200}
      />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  mapFrame: { height: 300, borderRadius: radii.bottomSheet, overflow: 'hidden', backgroundColor: colors.surfaceTint },
  pin: { position: 'absolute', left: '50%', top: '50%', width: 48, height: 48, transform: [{ translateX: -24 }, { translateY: -48 }] },
  pinDot: { position: 'absolute', left: 18, top: 12, width: 12, height: 12, borderRadius: radii.pill, backgroundColor: colors.accent, borderWidth: 2, borderColor: colors.surface },
  mapBadge: { position: 'absolute', top: 12, left: 12, right: 12, borderRadius: radii.pill, backgroundColor: colors.surface, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 6 },
  mapHint: { position: 'absolute', bottom: 10, alignSelf: 'center', borderRadius: radii.pill, backgroundColor: colors.surface, paddingHorizontal: 12, paddingVertical: 6 },
  badgeText: { flexShrink: 1, fontFamily: fonts.semiBold, fontSize: fontSizes.helper, color: colors.navy },
  addressCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.cardPadding, padding: spacing.cardPadding, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  addressText: { flex: 1, gap: 4 },
  helper: { fontFamily: fonts.regular, fontSize: fontSizes.helper, color: colors.textMuted },
  address: { fontFamily: fonts.semiBold, fontSize: fontSizes.body, color: colors.navy },
});
