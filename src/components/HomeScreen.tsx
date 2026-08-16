import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCurrentWeather, getDailyWeather, reverseGeocode } from '../api/weatherapi';
import { CurrentWeatherResponse, DailyForecastItem, SearchLocationResult } from '../types/weather';
import { useLocation } from '../hooks/useLocation';
import { usePersistedLocation } from '../hooks/usePersistedLocation';
import HomeIsland from './HomeIsland';
import ForecastTabs from './ForecastTabs';
import { SearchModal } from './SearchModal';

function HomeScreen() {
  const { coords, loading: locationLoading, error: locationError, loadLocation, setManualLocation } =
    useLocation();
  const { savedLocation, loading: persistenceLoading, saveLocation, clearLocation } = usePersistedLocation();
  const [current, setCurrent] = useState<CurrentWeatherResponse | null>(null);
  const [daily, setDaily] = useState<DailyForecastItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [displayLocation, setDisplayLocation] = useState<string>('');
  const [showSearch, setShowSearch] = useState(false);
  const [manualLocation, setManualLocationState] = useState<SearchLocationResult | null>(null);

  const loadWeather = useCallback(async (latitude?: number, longitude?: number, isManual = false) => {
    const targetLat = latitude ?? coords?.latitude;
    const targetLon = longitude ?? coords?.longitude;
    
    if (targetLat === undefined || targetLon === undefined) {
      return;
    }
    setLoading(true);
    if (!isManual) {
      setError(null);
    }
    setUpdateError(null);
    try {
      const [currentData, dailyData, geoLocation] = await Promise.all([
        getCurrentWeather(targetLat, targetLon),
        getDailyWeather(targetLat, targetLon),
        reverseGeocode(targetLat, targetLon),
      ]);
      setCurrent(currentData);
      setDaily(dailyData);
      setDisplayLocation(geoLocation);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
      if (isManual) {
        setUpdateError('Couldn\'t update weather');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [coords]);

  // Load persisted location on app start
  useEffect(() => {
    if (!persistenceLoading && savedLocation && !manualLocation) {
      setManualLocationState({
        displayName: savedLocation.displayName,
        lat: savedLocation.lat,
        lon: savedLocation.lon,
        country: '',
        state: undefined,
      });
      setManualLocation({ latitude: savedLocation.lat, longitude: savedLocation.lon });
      loadWeather(savedLocation.lat, savedLocation.lon, true);
    }
  }, [persistenceLoading, savedLocation, manualLocation, loadWeather, setManualLocation]);

  useEffect(() => {
    if (coords && !manualLocation && !savedLocation) {
      loadWeather();
    }
  }, [coords, loadWeather, manualLocation, savedLocation]);

  const handleOpenSearch = () => setShowSearch(true);

  const handleSelectLocation = (location: SearchLocationResult) => {
    setShowSearch(false);
    setManualLocationState(location);
    setManualLocation({ latitude: location.lat, longitude: location.lon });
    saveLocation(location);
    loadWeather(location.lat, location.lon, true);
  };

  const handleUseCurrentLocation = () => {
    setShowSearch(false);
    setManualLocationState(null);
    setManualLocation(null);
    clearLocation();
    loadLocation();
  };

  const handleDismissUpdateError = () => setUpdateError(null);

  const isLoading = locationLoading || loading || persistenceLoading;
  const errorMessage = locationError ?? error;

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-sky-400">
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  if (errorMessage || !current) {
    return (
      <View className="flex-1 items-center justify-center bg-sky-400 px-8">
        <Text className="text-white text-lg text-center mb-4">
          {errorMessage ?? 'Weather data is unavailable'}
        </Text>
        <TouchableOpacity
          className="bg-white px-6 py-2 rounded-full"
          onPress={async () => {
            setError(null);
            await loadLocation();
          }}
        >
          <Text className="text-sky-600 font-semibold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const location = displayLocation || `${current.name}, ${current.sys.country}`;
  const today = daily[0];

  return (
    <View className="flex-1 bg-sky-400">
      {updateError && (
        <View className="bg-amber-500/90 px-4 py-2 flex-row items-center justify-between w-full">
          <Text className="text-white text-sm">{updateError}</Text>
          <TouchableOpacity onPress={handleDismissUpdateError} className="p-2">
            <Text className="text-white text-sm font-medium">Dismiss</Text>
          </TouchableOpacity>
        </View>
      )}
      <SafeAreaView className="flex-1">
        <View className="flex-1">
          <View className="flex-[2]">
            <HomeIsland
              location={location}
              temp={current.main.temp}
              condition={current.weather[0]?.description ?? ''}
              icon={current.weather[0]?.icon ?? ''}
              high={today?.temp.max ?? current.main.temp_max}
              low={today?.temp.min ?? current.main.temp_min}
              feelsLike={current.main.feels_like}
              humidity={current.main.humidity}
              windSpeed={current.wind.speed}
              windDeg={current.wind.deg}
              pressure={current.main.pressure}
              onLocationPress={handleOpenSearch}
            />
          </View>
          <View className="flex-[3]">
            <ForecastTabs days={daily.slice(0, 3)} />
          </View>
        </View>
      </SafeAreaView>
      <SearchModal
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        onSelectLocation={handleSelectLocation}
        onUseCurrentLocation={handleUseCurrentLocation}
      />
    </View>
  );
}

export default HomeScreen;
