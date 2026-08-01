import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { DailyForecastItem } from '../types/weather';
import DayDetailPanel from './DayDetailPanel';

export interface ForecastTabsProps {
  days: DailyForecastItem[];
}

const LABELS = ['Today', 'Tomorrow', '2 days'];

function ForecastTabs({ days }: ForecastTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <View className="flex-1 px-4 pb-4">
      <View className="flex-row bg-white/20 rounded-full p-1 mb-4">
        {LABELS.map((label, index) => {
          const isActive = index === activeIndex;
          return (
            <TouchableOpacity
              key={label}
              onPress={() => setActiveIndex(index)}
              className={`flex-1 items-center py-2 rounded-full ${
                isActive ? 'bg-white' : ''
              }`}
            >
              <Text
                className={`text-base font-semibold ${
                  isActive ? 'text-sky-600' : 'text-white/70'
                }`}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {days[activeIndex] ? (
          <DayDetailPanel item={days[activeIndex]} title={LABELS[activeIndex]} />
        ) : (
          <View className="items-center py-8">
            <Text className="text-white/70">No forecast available</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

export default ForecastTabs;
