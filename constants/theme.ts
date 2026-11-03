// Shared design values from design/DESIGN.md.
export const colors = {
  primary: '#1F6FEB',
  navy: '#0E1F45',
  accent: '#F7931E',
  welcomeBlue: '#1E56C3',
  background: '#F3F6FC',
  surface: '#FFFFFF',
  surfaceTint: '#EAF1FE',
  border: '#DCE3F0',
  textMuted: '#5A6478',
  danger: '#B42318',
  warningBg: '#FFF0DD',
  warningText: '#9A4F00',
} as const;

// Use these font families on Text and TextInput instead of fontWeight.
export const fonts = {
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semiBold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
  extraBold: 'Poppins_800ExtraBold',
} as const;

export const fontSizes = {
  helper: 13,
  sectionSmall: 14,
  body: 15,
  section: 16,
  button: 18,
  title: 26,
  titleLarge: 30,
  number: 26,
  numberLarge: 44,
} as const;

export const spacing = {
  cardPadding: 14,
  sectionGap: 16,
  screenPadding: 20,
} as const;

export const radii = {
  input: 14,
  card: 16,
  cardLarge: 18,
  button: 18,
  bottomSheet: 26,
  pill: 999,
} as const;

export const sizes = {
  minimumTouchTarget: 44,
  inputHeight: 50,
  buttonHeight: 58,
} as const;
