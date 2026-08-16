import { useCallback, useEffect, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export interface Coords {
  latitude: number;
  longitude: number;
}

interface UseLocationResult {
  coords: Coords | null;
  loading: boolean;
  error: string | null;
  loadLocation: () => Promise<void>;
  setManualLocation: (coords: Coords | null) => void;
}

async function ensurePermission(): Promise<void> {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (!granted) {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (result !== PermissionsAndroid.RESULTS.GRANTED) {
        throw new Error('Location permission was denied');
      }
    }
  } else {
    await new Promise<void>((resolve, reject) => {
      Geolocation.requestAuthorization(
        () => resolve(),
        error => reject(new Error(error.message)),
      );
    });
  }
}

function getCurrentPosition(): Promise<Coords> {
  return new Promise<Coords>((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position =>
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      error => reject(new Error(error.message)),
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 },
    );
  });
}

export function useLocation(): UseLocationResult {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [manualCoords, setManualCoords] = useState<Coords | null>(null);

  const loadLocation = useCallback(async () => {
    // If manual coords are set, use them instead of GPS
    if (manualCoords) {
      setCoords(manualCoords);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await ensurePermission();
      const position = await getCurrentPosition();
      setCoords(position);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to get your location',
      );
    } finally {
      setLoading(false);
    }
  }, [manualCoords]);

  const setManualLocation = useCallback((newCoords: Coords | null) => {
    setManualCoords(newCoords);
    if (newCoords) {
      setCoords(newCoords);
    }
  }, []);

  useEffect(() => {
    loadLocation();
  }, [loadLocation]);

  return { coords, loading, error, loadLocation, setManualLocation };
}
