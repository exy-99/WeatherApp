import { SearchLocationResult } from '../types/weather';
import { TouchableOpacity, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface SearchResultItemProps {
  result: SearchLocationResult;
  onPress: () => void;
}

export const SearchResultItem = ({ result, onPress }: SearchResultItemProps) => (
  <TouchableOpacity onPress={onPress} className="w-full px-4 py-3 border-b border-white/10 flex flex-row items-center">
    <View className="flex-1">
      <Text className="text-white text-base font-medium">{result.displayName}</Text>
      {result.state && (
        <Text className="text-white/60 text-sm">{result.state}, {result.country}</Text>
      )}
      {!result.state && (
        <Text className="text-white/60 text-sm">{result.country}</Text>
      )}
    </View>
    <Icon name="chevron-forward" size={20} color="rgba(255,255,255,0.4)" />
  </TouchableOpacity>
);