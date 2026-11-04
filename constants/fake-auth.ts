// Temporary records live only in memory. Restarting the app clears them.
// This lets us try both new and returning users without a backend.
type FakeProfile = { firstName: string; lastName: string };

const profiles = new Map<string, FakeProfile>();

export function hasFakeProfile(phone: string) {
  return profiles.has(phone);
}

export function saveFakeProfile(phone: string, firstName: string, lastName: string) {
  profiles.set(phone, { firstName: firstName.trim(), lastName: lastName.trim() });
}

export const fakeVerificationCode = '1234';
