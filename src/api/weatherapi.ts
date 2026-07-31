import axios from 'axios';
import {
  API_KEY,
  CURRENT_WEATHER_URL,
  HOURLY_WEATHER_URL,
  DAILY_WEATHER_URL,
} from '@env';
import {
  CurrentWeatherResponse,
  ForecastItem,
  ForecastResponse,
  DailyForecastItem,
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

function aggregateDaily(list: ForecastItem[]): DailyForecastItem[] {
  const days = new Map<string, DailyForecastItem>();
  for (const item of list) {
    const key = new Date(item.dt * 1000).toDateString();
    const existing = days.get(key);
    if (existing) {
      existing.temp.max = Math.max(existing.temp.max, item.main.temp_max);
      existing.temp.min = Math.min(existing.temp.min, item.main.temp_min);
    } else {
      days.set(key, {
        dt: item.dt,
        temp: { max: item.main.temp_max, min: item.main.temp_min },
        weather: item.weather,
      });
    }
  }
  return Array.from(days.values());
}
