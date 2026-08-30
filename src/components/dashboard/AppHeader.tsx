import React from 'react';
import {  Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from '../ui/Icon';
import { colors } from '../../constants/colors';



function AppHeader() {
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
          Weather-App
        </Text>
      </View>
    </View>
  );
}

export default AppHeader;