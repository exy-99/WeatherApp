import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import {
  X,
  MapPin,
  ChevronRight,
  Droplets,
  Wind,
  Gauge,
  Umbrella,
  Eye,
  Cloud,
  Thermometer,
  Sun,
} from 'lucide-react-native';
import { colors } from '../../constants/colors';

// Map of icon names to Lucide components
const iconMap: Record<string, React.ComponentType<any>> = {
  X,
  MapPin,
  ChevronRight,
  Droplets,
  Wind,
  Gauge,
  Umbrella,
  Eye,
  Cloud,
  Thermometer,
  Sun,
};

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export default function Icon({ name, size = 24, color = colors.textSecondary, style }: IconProps) {
  const LucideIcon = iconMap[name];
  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found in icon map`);
    return null;
  }
  return <LucideIcon size={size} color={color} style={style} />;
}