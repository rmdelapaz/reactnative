import { Outfit_600SemiBold } from '@expo-google-fonts/outfit/600SemiBold';
import { Outfit_700Bold } from '@expo-google-fonts/outfit/700Bold';

// The font files the app loads before its first screen. Each key becomes a fontFamily name.
export const fontFiles = { Outfit_600SemiBold, Outfit_700Bold };

// Headings use Outfit; everything else stays in the phone's own font.
// A custom font has one family per weight: the weight is in the name, not in fontWeight.
export const fonts = {
  title: 'Outfit_700Bold',
  heading: 'Outfit_600SemiBold',
} as const satisfies Record<string, keyof typeof fontFiles>;
