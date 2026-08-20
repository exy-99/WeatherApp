import React from 'react';
import { Pressable, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from '../ui/Icon';
import { colors } from '../../constants/colors';

interface AppHeaderProps {
  onSettingsPress?: () => void;
  onNotificationsPress?: () => void;
}

function AppHeader({ onSettingsPress, onNotificationsPress }: AppHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-5 py-2">
      <View className="flex-row items-center">
        <LinearGradient
          colors={colors.primaryGradient}
          className="h-9 w-9 items-center justify-center rounded-2xl"
        >
          <Icon name="cloud-outline" size={22} color={colors.white} />
        </LinearGradient>
        <Text className="ml-2 text-lg font-bold" style={{ color: colors.textPrimary }}>
          WeatherApp
        </Text>
      </View>
      <View className="flex-row items-center">
        <Pressable
          hitSlop={8}
          style={({ pressed }) => (pressed ? { opacity: 0.6 } : undefined)}
        >
          <View
            className="h-9 w-9 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.primaryLight }}
          >
            <Icon name="person-outline" size={20} color={colors.textPrimary} />
          </View>
        </Pressable>
        <Pressable
          onPress={onNotificationsPress}
          hitSlop={8}
          className="relative ml-3"
          style={({ pressed }) => (pressed ? { opacity: 0.6 } : undefined)}
        >
          <Icon name="notifications-outline" size={24} color={colors.textSecondary} />
          <View
            className="absolute right-0 top-0 h-2 w-2 rounded-full"
            style={{ backgroundColor: colors.destructive }}
          />
        </Pressable>
        <Pressable
          onPress={onSettingsPress}
          hitSlop={8}
          className="ml-3"
          style={({ pressed }) => (pressed ? { opacity: 0.6 } : undefined)}
        >
          <Icon name="settings-outline" size={24} color={colors.textSecondary} />
        </Pressable>
      </View>
    </View>
  );
}

export default AppHeader;