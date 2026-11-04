import AsyncStorage from '@react-native-async-storage/async-storage';
import { Directory, File, Paths } from 'expo-file-system';

export type SavedLocation = {
  latitude: number;
  longitude: number;
  address: string;
  landmark: string;
};

export type WasteSize = 'Small bag' | 'Large bag' | 'Full bin' | 'Bulky item';
export type WasteType = 'General' | 'Plastics' | 'Garden' | 'Mixed';
export type UsualWaste = {
  size: WasteSize;
  quantity: number;
  type: WasteType;
  photoUri: string | null;
};

const locationKey = 'borlago:location';
const wasteKey = 'borlago:usual-waste';
const photoFolder = new Directory(Paths.document, 'borlago-photos');

function validLocation(value: SavedLocation) {
  return value && Number.isFinite(value.latitude) && Math.abs(value.latitude) <= 90
    && Number.isFinite(value.longitude) && Math.abs(value.longitude) <= 180
    && typeof value.address === 'string' && value.address.trim().length > 0
    && typeof value.landmark === 'string';
}

function validWaste(value: UsualWaste) {
  return value && ['Small bag', 'Large bag', 'Full bin', 'Bulky item'].includes(value.size)
    && ['General', 'Plastics', 'Garden', 'Mixed'].includes(value.type)
    && Number.isInteger(value.quantity) && value.quantity >= 1 && value.quantity <= 10
    && (value.photoUri === null || typeof value.photoUri === 'string');
}

export async function saveLocation(location: SavedLocation) {
  if (!validLocation(location)) throw new Error('Choose a valid pickup spot.');
  await AsyncStorage.setItem(locationKey, JSON.stringify(location));
}

export async function getLocation(): Promise<SavedLocation | null> {
  const text = await AsyncStorage.getItem(locationKey);
  if (!text) return null;
  try {
    const location = JSON.parse(text) as SavedLocation;
    return validLocation(location) ? location : null;
  } catch { return null; }
}

export async function saveUsualWaste(waste: UsualWaste) {
  if (!validWaste(waste)) throw new Error('Choose a size, quantity and type.');
  if (!await getLocation()) throw new Error('Save your location first.');
  let savedPhoto = waste.photoUri;
  let copiedFile: File | null = null;

  // Picker photos start in temporary storage. Keep our own copy permanently.
  if (savedPhoto && !savedPhoto.startsWith(photoFolder.uri.replace(/\/$/, '') + '/')) {
    photoFolder.create({ intermediates: true, idempotent: true });
    const source = new File(savedPhoto);
    copiedFile = new File(photoFolder, `waste-${Date.now()}${source.extension || '.jpg'}`);
    await source.copy(copiedFile);
    savedPhoto = copiedFile.uri;
  }
  try {
    await AsyncStorage.setItem(wasteKey, JSON.stringify({ ...waste, photoUri: savedPhoto }));
  } catch (error) {
    if (copiedFile?.exists) copiedFile.delete();
    throw error;
  }
}

export async function getUsualWaste(): Promise<UsualWaste | null> {
  const text = await AsyncStorage.getItem(wasteKey);
  if (!text) return null;
  try {
    const waste = JSON.parse(text) as UsualWaste;
    return validWaste(waste) ? waste : null;
  } catch { return null; }
}

// Setup is complete only when BOTH records have been saved successfully.
export async function isSetupDone() {
  const [location, waste] = await Promise.all([getLocation(), getUsualWaste()]);
  return location !== null && waste !== null;
}

export async function resetSetup() {
  await AsyncStorage.multiRemove([locationKey, wasteKey]);
  // Setup is already reset even if the phone cannot remove an old photo.
  try { if (photoFolder.exists) photoFolder.delete(); } catch { /* Retry cleanup on a later reset. */ }
}
