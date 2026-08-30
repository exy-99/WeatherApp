import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  getCurrentWeather,
  getDailyWeather,
  getHourlyWeather,
  reverseGeocode,
} from '../../api/weatherapi';
import {
  CurrentWeatherResponse,
  DailyForecastItem,
  ForecastItem,
  SearchLocationResult,
} from '../../types/weather';
import { StatMetric } from '../../types/dashboard';
import { useLocation } from '../../hooks/useLocation';
import { usePersistedLocation } from '../../hooks/usePersistedLocation';
import { useWeatherInsights } from '../../hooks/useWeatherInsights';
import { colors } from '../../constants/colors';
import AppHeader from './AppHeader';
import LocationDateStrip from './LocationDateStrip';
import WeatherInsightCard from './WeatherInsightCard';
import WeatherStatsGrid from './WeatherStatsGrid';
import HourlyTimeline from './HourlyTimeline';
import { SearchModal } from '../SearchModal';

interface DashboardContentProps {
  current: CurrentWeatherResponse;
  daily: DailyForecastItem[];
  hourly: ForecastItem[];
  location: string;
  updateError: string | null;
  showSearch: boolean;
  onOpenSearch: () => void;
  onCloseSearch: () => void;
  onSelectLocation: (location: SearchLocationResult) => void;
  onUseCurrentLocation: () => void;
  onDismissUpdateError: () => void;
}

function DashboardContent({
  current,
  daily,
  hourly,
  location,
  updateError,
  showSearch,
  onOpenSearch,
  onCloseSearch,
  onSelectLocation,
  onUseCurrentLocation,
  onDismissUpdateError,
}: DashboardContentProps) {
  const insights = useWeatherInsights(current, daily[0]);

  const stats: StatMetric[] = [
    {
      id: 'humidity',
      label: 'Humidity',
      value: `${current.main.humidity}%`,
      icon: 'water-outline',
      progress: current.main.humidity / 100,
    },
    {
      id: 'wind',
      label: 'Wind',
      value: `${Math.round(current.wind.speed)} m/s`,
      icon: 'flag-outline',
      progress: Math.min(current.wind.speed / 30, 1),
    },
    {
      id: 'pressure',
      label: 'Pressure',
      value: `${current.main.pressure} hPa`,
      icon: 'speedometer-outline',
      progress: Math.min(Math.max((current.main.pressure - 950) / (1050 - 950), 0), 1),
    },
    {
      id: 'precipitation',
      label: 'Precip Chance',
      value: `${Math.round((daily[0]?.pop ?? 0) * 100)}%`,
      icon: 'umbrella-outline',
      progress: daily[0]?.pop ?? 0,
    },
    {
      id: 'visibility',
      label: 'Visibility',
      value: `${(current.visibility / 1000).toFixed(1)} km`,
      icon: 'eye-outline',
      progress: Math.min(current.visibility / 10000, 1),
    },
    {
      id: 'clouds',
      label: 'Cloud Cover',
      value: `${current.clouds?.all ?? 0}%`,
      icon: 'cloud-outline',
      progress: (current.clouds?.all ?? 0) / 100,
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#F5F7F8]">
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7F8" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {updateError && (
          <View className="bg-amber-500 px-4 py-2 flex-row items-center justify-between">
            <Text className="text-white text-sm">{updateError}</Text>
            <TouchableOpacity onPress={onDismissUpdateError} className="p-2">
              <Text className="text-white text-sm font-medium">Dismiss</Text>
            </TouchableOpacity>
          </View>
        )}
        <View className="gap-6">
          <AppHeader  />
          <TouchableOpacity onPress={onOpenSearch} activeOpacity={0.7}>
            <LocationDateStrip location={location} />
          </TouchableOpacity>
          <View className="px-5">
            <WeatherInsightCard
              temp={current.main.temp}
              condition={current.weather[0]?.description ?? ''}
              icon={current.weather[0]?.icon ?? ''}
              precipitation={daily[0]?.pop ?? 0}
              high={daily[0]?.temp.max ?? current.main.temp_max}
              low={daily[0]?.temp.min ?? current.main.temp_min}
              insights={insights}
            />
          </View>
          <View className="px-5">
            <WeatherStatsGrid stats={stats} />
          </View>
          <View className="px-5">
            <HourlyTimeline hours={hourly} />
          </View>
        </View>
      </ScrollView>
      <SearchModal
        isOpen={showSearch}
        onClose={onCloseSearch}
        onSelectLocation={onSelectLocation}
        onUseCurrentLocation={onUseCurrentLocation}
      />
    </SafeAreaView>
  );
}

function DashboardScreen() {
  const { coords, loading: locationLoading, error: locationError, loadLocation, setManualLocation } =
    useLocation();
  const { savedLocation, loading: persistenceLoading, saveLocation, clearLocation } = usePersistedLocation();
  const [current, setCurrent] = useState<CurrentWeatherResponse | null>(null);
  const [hourly, setHourly] = useState<ForecastItem[]>([]);
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
      const [currentData, hourlyData, dailyData, geoLocation] = await Promise.all([
        getCurrentWeather(targetLat, targetLon),
        getHourlyWeather(targetLat, targetLon),
        getDailyWeather(targetLat, targetLon),
        reverseGeocode(targetLat, targetLon),
      ]);
      setCurrent(currentData);
      setHourly(hourlyData);
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

  const loadWeatherRef = useRef(loadWeather);
  loadWeatherRef.current = loadWeather;

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
      loadWeatherRef.current(savedLocation.lat, savedLocation.lon, true);
    }
  }, [persistenceLoading, savedLocation, manualLocation, loadWeatherRef, setManualLocation]);

  useEffect(() => {
    if (coords && !manualLocation && !savedLocation && !persistenceLoading) {
      loadWeatherRef.current();
    }
  }, [coords, manualLocation, savedLocation, persistenceLoading, loadWeatherRef]);

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
      <View className="flex-1 items-center justify-center bg-[#F5F7F8]">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (errorMessage || !current) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F5F7F8] px-8">
        <Text className="text-lg text-center mb-4" style={{ color: colors.textPrimary }}>
          {errorMessage ?? 'Weather data is unavailable'}
        </Text>
        <TouchableOpacity
          className="bg-[#388E3C] px-6 py-2 rounded-full"
          onPress={async () => {
            setError(null);
            await loadLocation();
          }}
        >
          <Text className="text-white font-semibold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const location = displayLocation || `${current.name}, ${current.sys.country}`;

  return (
    <DashboardContent
      current={current}
      daily={daily}
      hourly={hourly}
      location={location}
      updateError={updateError}
      showSearch={showSearch}
      onOpenSearch={handleOpenSearch}
      onCloseSearch={() => setShowSearch(false)}
      onSelectLocation={handleSelectLocation}
      onUseCurrentLocation={handleUseCurrentLocation}
      onDismissUpdateError={handleDismissUpdateError}
    />
  );
}

export default DashboardScreen;