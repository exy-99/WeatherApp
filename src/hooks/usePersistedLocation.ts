import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SearchLocationResult } from '../types/weather';

const STORAGE_KEY = '@weather_app_manual_location';

interface PersistedLocation {
  lat: number;
  lon: number;
  displayName: string;
  timestamp: number;
}

export const usePersistedLocation = () => {
  const [savedLocation, setSavedLocation] = useState<PersistedLocation | null>(null);
  const [loading, setLoading] = useState(true);

  // Load saved location on mount
  useEffect(() => {
    const loadLocation = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed: PersistedLocation = JSON.parse(stored);
          setSavedLocation(parsed);
        }
      } catch (e) {
        console.warn('Failed to load persisted location:', e);
      } finally {
        setLoading(false);
      }
    };
    loadLocation();
  }, []);

  // Save location
  const saveLocation = useCallback(async (location: SearchLocationResult) => {
    const toSave: PersistedLocation = {
      lat: location.lat,
      lon: location.lon,
      displayName: location.displayName,
      timestamp: Date.now(),
    };
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      setSavedLocation(toSave);
    } catch (e) {
      console.warn('Failed to save location:', e);
    }
  }, []);

  // Clear saved location (when user selects "Use my current location")
  const clearLocation = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setSavedLocation(null);
    } catch (e) {
      console.warn('Failed to clear location:', e);
    }
  }, []);

  return {
    savedLocation,
    loading,
    saveLocation,
    clearLocation,
  };
};