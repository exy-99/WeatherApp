import { useState, useCallback, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Modal } from 'react-native';
import { geocode } from '../api/weatherapi';
import { SearchLocationResult } from '../types/weather';
import { SearchResultItem } from './SearchResultItem';
import Icon from 'react-native-vector-icons/Ionicons';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (location: SearchLocationResult) => void;
  onUseCurrentLocation: () => void;
}

export const SearchModal = ({ isOpen, onClose, onSelectLocation, onUseCurrentLocation }: SearchModalProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchLocationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  // Debounced search (D-06: ~300ms, D-07: min 2-3 chars)
  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const geocodeResults = await geocode(searchQuery);
      const formatted: SearchLocationResult[] = geocodeResults.map(r => ({
        displayName: r.name,
        lat: r.lat,
        lon: r.lon,
        country: r.country,
        state: r.state,
      }));
      setResults(formatted);
      if (formatted.length === 0) {
        setError('No locations found'); // D-13
      }
    } catch {
      setError('Search failed. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleQueryChange = (text: string) => {
    setQuery(text);
    if (debounceTimer) clearTimeout(debounceTimer);
    const timer = setTimeout(() => performSearch(text), 300);
    setDebounceTimer(timer);
  };

  const handleResultPress = (result: SearchLocationResult) => {
    onSelectLocation(result);
    onClose();
  };

  const handleCurrentLocationPress = () => {
    onUseCurrentLocation();
    onClose();
  };

  useEffect(() => {
    return () => { if (debounceTimer) clearTimeout(debounceTimer); };
  }, [debounceTimer]);

  return (
    <Modal visible={isOpen} animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        className="bg-black"
      >
      <View className="flex-1 flex-col">
        {/* Header */}
        <View className="px-4  py-4 border-b border-white/10 flex-row items-center justify-between">
          <Text className="text-white text-xl font-semibold pt-10">Search Location</Text>
          <TouchableOpacity onPress={onClose} className="p-2">
            <Icon name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Search Input */}
        <View className="px-4 py-3">
          <TextInput
            value={query}
            onChangeText={handleQueryChange}
            placeholder="Enter city name (min 2 chars)"
            autoFocus
            className="bg-white/10 rounded-full px-4 py-3 text-white text-base placeholder-white/40"
            placeholderTextColor="rgba(255,255,255,0.4)"
          />
        </View>

        {/* Current Location Button (D-03) */}
        <TouchableOpacity onPress={handleCurrentLocationPress} className="px-4 py-3 border-b border-white/10">
          <View className="flex-row items-center gap-3">
            <Icon name="location" size={22} color="#4ade80" />
            <Text className="text-white text-base font-medium text-green-400">Use my current location</Text>
          </View>
        </TouchableOpacity>

        {/* Results List */}
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {loading && (
            <View className="px-4 py-8 items-center">
              <Text className="text-white/60">Searching...</Text>
            </View>
          )}
          {error && !loading && results.length === 0 && (
            <View className="px-4 py-8 items-center">
              <Text className="text-white/60 text-center">{error}</Text>
            </View>
          )}
          {results.map((result, index) => (
            <SearchResultItem
              key={`${result.lat}-${result.lon}-${index}`}
              result={result}
              onPress={() => handleResultPress(result)}
            />
          ))}
          {results.length === 0 && !loading && query.length >= 2 && !error && (
            <View className="px-4 py-8 items-center">
              <Text className="text-white/60">No locations found</Text>
            </View>
          )}
        </ScrollView>
      </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

