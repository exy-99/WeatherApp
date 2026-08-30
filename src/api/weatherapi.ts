import axios from 'axios';
import {
  API_KEY,
  CURRENT_WEATHER_URL,
  HOURLY_WEATHER_URL,
  DAILY_WEATHER_URL,
  GEOCODING_URL,
} from '@env';
import {
  CurrentWeatherResponse,
  ForecastItem,
  ForecastResponse,
  DailyForecastItem,
  GeocodingResult,
} from '../types/weather';

const api = axios.create({ timeout: 10000 });

type Units = 'metric' | 'imperial';

const buildUrl = (template: string, lat: number, lon: number, units: Units) =>
  template
    .replace('{lat}', String(lat))
    .replace('{lon}', String(lon))
    .replace('{API_KEY}', API_KEY) + `&units=${units}`;

export async function getCurrentWeather(
  lat: number,
  lon: number,
  units: Units = 'metric',
): Promise<CurrentWeatherResponse> {
  const { data } = await api.get<CurrentWeatherResponse>(
    buildUrl(CURRENT_WEATHER_URL, lat, lon, units),
  );
  return data;
}

export async function getHourlyWeather(
  lat: number,
  lon: number,
  units: Units = 'metric',
): Promise<ForecastItem[]> {
  const { data } = await api.get<ForecastResponse>(
    buildUrl(HOURLY_WEATHER_URL, lat, lon, units),
  );
  return data.list;
}

export async function getDailyWeather(
  lat: number,
  lon: number,
  units: Units = 'metric',
): Promise<DailyForecastItem[]> {
  const { data } = await api.get<ForecastResponse>(
    buildUrl(DAILY_WEATHER_URL, lat, lon, units),
  );
  return aggregateDaily(data.list);
}

export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const { data } = await api.get(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`,
    );
    if (data && data.length > 0) {
      const location = data[0];
      const parts = [
        location.name,
        location.state,
        location.country,
      ].filter(Boolean);
      return parts.join(', ');
    }
  } catch (error) {
    console.warn('Reverse geocoding failed:', error);
  }
  return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
}

// Forward geocoding: search locations by query string
export const geocode = async (query: string): Promise<GeocodingResult[]> => {
  const url = `${GEOCODING_URL}?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`;
  
  const response = await api.get<GeocodingResult[]>(url);
  return response.data;
};

export type { GeocodingResult };

export function aggregateDaily(list: ForecastItem[]): DailyForecastItem[] {
  const days = new Map<string, DailyForecastItem>();
  for (const item of list) {
    const key = new Date(item.dt * 1000).toDateString();
    const existing = days.get(key);
    if (existing) {
      existing.temp.max = Math.max(existing.temp.max, item.main.temp_max);
      existing.temp.min = Math.min(existing.temp.min, item.main.temp_min);
      existing.humidity += item.main.humidity;
      existing.pressure += item.main.pressure;
      existing.pop = Math.max(existing.pop, item.pop ?? 0);
      if (item.wind.speed > existing.wind_speed) {
        existing.wind_speed = item.wind.speed;
        existing.wind_deg = item.wind.deg;
      }
      if (isCloserToNoon(item.dt, existing.dt)) {
        existing.dt = item.dt;
        existing.feels_like = item.main.feels_like;
        existing.weather = item.weather;
      }
    } else {
      days.set(key, {
        dt: item.dt,
        temp: { max: item.main.temp_max, min: item.main.temp_min },
        weather: item.weather,
        feels_like: item.main.feels_like,
        pressure: item.main.pressure,
        humidity: item.main.humidity,
        wind_speed: item.wind.speed,
        wind_deg: item.wind.deg,
        pop: item.pop ?? 0,
      });
    }
  }
  return Array.from(days.values()).map(day => {
    const samples = list.filter(
      item => new Date(item.dt * 1000).toDateString() === new Date(day.dt * 1000).toDateString(),
    );
    const count = samples.length;
    return {
      ...day,
      humidity: Math.round(day.humidity / count),
      pressure: Math.round(day.pressure / count),
    };
  });
}

function isCloserToNoon(candidate: number, current: number): boolean {
  const noon = (date: number) => Math.abs(new Date(date * 1000).getHours() - 12);
  return noon(candidate) < noon(current);
}
