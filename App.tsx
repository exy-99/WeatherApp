import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import DashboardScreen from './src/components/dashboard/DashboardScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <DashboardScreen />
    </SafeAreaProvider>
  );
}
