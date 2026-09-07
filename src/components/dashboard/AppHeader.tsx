import React from 'react';
import { Image, Text, View } from 'react-native';
import { colors } from '../../constants/colors';



function AppHeader() {
  return (
    <View className="flex-row items-center justify-between px-5 py-2">
      <View className="flex-row items-center">
        <Image
          source={require('../../assets/logo.webp')}
          className="h-11 w-11 rounded-2xl"
        />
        <Text className="ml-2 text-lg font-bold" style={{ color: colors.textPrimary }}>
          Weather-App
        </Text>
      </View>
    </View>
  );
}

export default AppHeader;
