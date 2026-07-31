import axios from 'axios';
import {
  API_KEY,
  CURRENT_WEATHER_URL,
  HOURLY_WEATHER_URL,
  DAILY_WEATHER_URL,
} from '@env';
import {
  currentWeatherData,
  forcastWeatherData,
  DailyWeatherData,
  OneCallCurrentResponse,
  OneCallForecastResponse,
  OneCallDailyResponse,
} from '../types/weather';

const api = axios.create({ timeout: 10000 });

type Units = 'metric' ;

const buildUrl = (template: string, lat: number, lon: number, units: Units) =>
  template
    .replace('{lat}', String(lat))
    .replace('{lon}', String(lon))
    .replace('{API_KEY}', API_KEY) + `&units=${units}`;

export async function getCurrentWeather(
  lat: number,
  lon: number,
  units: Units = 'metric',
): Promise<currentWeatherData[]> {
  const { data } = await api.get<OneCallCurrentResponse>(
    buildUrl(CURRENT_WEATHER_URL, lat, lon, units),
  );
  return data.data;
}

export async function getHourlyWeather(
  lat: number,
  lon: number,
  units: Units = 'metric',
): Promise<forcastWeatherData[]> {
  const { data } = await api.get<OneCallForecastResponse>(
    buildUrl(HOURLY_WEATHER_URL, lat, lon, units),
  );
  return data.data;
}

export async function getDailyWeather(
  lat: number,
  lon: number,
  units: Units = 'metric',
): Promise<DailyWeatherData[]> {
  const { data } = await api.get<OneCallDailyResponse>(
    buildUrl(DAILY_WEATHER_URL, lat, lon, units),
  );
  return data.data;
}