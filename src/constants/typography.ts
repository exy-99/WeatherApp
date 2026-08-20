import { TextStyle } from 'react-native';

export const typography = {
  display: { fontSize: 24, lineHeight: 32, fontWeight: '700' } as TextStyle,
  title: { fontSize: 18, lineHeight: 26, fontWeight: '700' } as TextStyle,
  subtitle: { fontSize: 16, lineHeight: 24, fontWeight: '600' } as TextStyle,
  body: { fontSize: 14, lineHeight: 20, fontWeight: '400' } as TextStyle,
  bodyMedium: { fontSize: 14, lineHeight: 20, fontWeight: '600' } as TextStyle,
  label: { fontSize: 12, lineHeight: 16, fontWeight: '500' } as TextStyle,
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '400' } as TextStyle,
  largeNumber: { fontSize: 44, lineHeight: 48, fontWeight: '700' } as TextStyle,
} as const;