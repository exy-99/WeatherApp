import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants/colors';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export default function Icon({ name, size = 24, color = colors.textSecondary, style }: IconProps) {
  return <Ionicons name={name} size={size} color={color} style={style} />;
}