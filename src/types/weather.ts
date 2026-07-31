export interface params {
  lat: number;
  lon: number;
  appid: string;
  unit?: string;
  lang?: string;
}

export interface weatherCondition {
  main: string;
  description: string;
  icon: string;
}
export interface baseWeatherData {
  dt: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust?: number;
}
export interface currentWeatherData extends baseWeatherData {
  sunrise?: number;
  sunset?: number;
}

export interface forcastWeatherData extends baseWeatherData {
  pop?: number;
}

export interface DailyTemp {
  day: number;
  night: number;
  max: number;
  min: number;
  eve: number;
  morn: number;
}
export interface DailyFeelsLike {
  day: number;
  night: number;
  eve: number;
  morn: number;
}
export interface DailyWeatherData {
  dt: number;
  sunrise?: number;
  sunset?: number;
  morning?: number;
  moon_phase?: number;
  temp: DailyTemp;
  feels_like: DailyFeelsLike;
  pressure: number;
  humidity: number;
  dew_point: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust?: number;
  weather: weatherCondition[];
  clouds: number;
  pop?: number;
  rain?: number;
  uvi?: number;
}
export interface PagintedResponse {
  next?: string;
  prev?: string;
}
export interface OneCallCurrentResponse {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  data: currentWeatherData[];
}

export interface OneCallForecastResponse extends PagintedResponse {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  data: forcastWeatherData[];
}

export interface OneCallDailyResponse extends PagintedResponse {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  data: DailyWeatherData[];
}
export interface WeatherData {
  current:currentWeatherData;
  forecast: forcastWeatherData[];
  daily: DailyWeatherData[];
}