import { useCallback, useEffect, useState } from 'react';
import { PermissionsAndroid, Platform, NativeModules } from 'react-native';
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
}

async function hasPreciseLocationPermission(): Promise<boolean> {
  if (Platform.OS !== 'android' || Platform.Version < 31) {
    return true;
  }
  const { check } = NativeModules.PermissionsAndroid || {};
  if (check) {
    try {
      const result = await check('android.permission.ACCESS_FINE_LOCATION');
      return result === 'granted';
    } catch {
      return true;
    }
  }
  return true;
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
    const preciseGranted = await hasPreciseLocationPermission();
    if (!preciseGranted) {
      throw new Error('Precise location permission is required. Please enable "Precise location" in app settings.');
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
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      );
  });
}

export function useLocation(): UseLocationResult {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLocation = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    loadLocation();
  }, [loadLocation]);

  return { coords, loading, error, loadLocation };
}
