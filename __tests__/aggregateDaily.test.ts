import type { ForecastItem } from '../src/types/weather';

const { aggregateDaily } = jest.requireActual('../src/api/weatherapi') as typeof import('../src/api/weatherapi');

function makeItem(dt: number, overrides: Partial<ForecastItem['main']> & { pop?: number; windSpeed?: number }): ForecastItem {
  const { pop = 0, windSpeed = 3, ...main } = overrides;
  return {
    dt,
    main: {
      temp: 30,
      feels_like: 30,
      temp_min: 25,
      temp_max: 34,
      pressure: 1010,
      humidity: 40,
      ...main,
    },
    weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
    clouds: { all: 20 },
    wind: { speed: windSpeed, deg: 90 },
    visibility: 10000,
    pop,
    dt_txt: '',
  };
}

const dayA1 = Math.floor(Date.UTC(2021, 5, 15, 12, 0, 0) / 1000);
const dayA2 = Math.floor(Date.UTC(2021, 5, 15, 13, 0, 0) / 1000);
const dayB = Math.floor(Date.UTC(2021, 5, 17, 12, 0, 0) / 1000);

test('groups 3-hour forecast entries into distinct calendar days', () => {
  const result = aggregateDaily([
    makeItem(dayA1, {}),
    makeItem(dayA2, {}),
    makeItem(dayB, {}),
  ]);
  expect(result.length).toBe(2);
});

test('computes max/min temps, averaged humidity/pressure, and max pop per day', () => {
  const result = aggregateDaily([
    makeItem(dayA1, { temp_max: 34, temp_min: 27, humidity: 40, pressure: 1010, pop: 0.2 }),
    makeItem(dayA2, { temp_max: 30, temp_min: 25, humidity: 60, pressure: 1020, pop: 0.6 }),
    makeItem(dayB, { temp_max: 20, temp_min: 10, humidity: 90, pressure: 1000, pop: 0.1 }),
  ]);
  // Find the two-sample day (its pop was maxed to 0.6).
  const dayAResult = result.find(d => d.pop === 0.6);
  expect(dayAResult).toBeDefined();
  expect(dayAResult?.temp.max).toBe(34);
  expect(dayAResult?.temp.min).toBe(25);
  expect(dayAResult?.humidity).toBe(50); // round((40+60)/2)
  expect(dayAResult?.pressure).toBe(1015); // round((1010+1020)/2)
});
