import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export default function Card({ children, className = '', style }: CardProps) {
  return (
    <View
      className={`bg-white rounded-2xl p-4 ${className}`}
      style={[
        {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.05,
          shadowRadius: 12,
          elevation: 2,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}