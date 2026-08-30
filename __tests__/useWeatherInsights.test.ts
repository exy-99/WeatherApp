import { useWeatherInsights } from '../src/hooks/useWeatherInsights';
import type { CurrentWeatherResponse, DailyForecastItem } from '../src/types/weather';

function makeCurrent(temp: number, humidity: number, windSpeed: number): CurrentWeatherResponse {
  return {
    main: { temp, humidity, feels_like: temp, temp_min: temp, temp_max: temp, pressure: 1010 },
    wind: { speed: windSpeed, deg: 0 },
  } as unknown as CurrentWeatherResponse;
}

function makeDaily(pop: number): DailyForecastItem {
  return { pop } as unknown as DailyForecastItem;
}

test('suggests an umbrella when rain probability is high', () => {
  const chips = useWeatherInsights(makeCurrent(20, 50, 2), makeDaily(0.6));
  expect(chips.some(c => c.id === 'umbrella')).toBe(true);
});

test('warns about extreme heat above 30 degrees', () => {
  const chips = useWeatherInsights(makeCurrent(35, 50, 2), makeDaily(0.6));
  const heat = chips.find(c => c.id === 'heat');
  expect(heat).toBeDefined();
  expect(heat?.variant).toBe('warning');
});

test('flags windy and humid conditions', () => {
  const chips = useWeatherInsights(makeCurrent(20, 80, 8), makeDaily(0.6));
  expect(chips.some(c => c.id === 'wind')).toBe(true);
  expect(chips.some(c => c.id === 'humidity')).toBe(true);
});

test('suggests outdoors when rain probability is low', () => {
  const chips = useWeatherInsights(makeCurrent(20, 50, 2), makeDaily(0.1));
  expect(chips.some(c => c.id === 'outdoor')).toBe(true);
});

test('returns at most 3 chips', () => {
  // pop 0.6 (umbrella), temp 35 (heat), wind 8 (wind), humidity 80 (humidity) => 4 qualify, capped to 3
  const chips = useWeatherInsights(makeCurrent(35, 80, 8), makeDaily(0.6));
  expect(chips.length).toBe(3);
});
