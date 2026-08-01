jest.mock('@react-native-community/geolocation', () => ({
  getCurrentPosition: jest.fn(success =>
    success({ coords: { latitude: 28.61, longitude: 77.2 } }),
  ),
  requestAuthorization: jest.fn(resolve => resolve()),
}));

jest.mock('./src/api/weatherapi', () => ({
  getCurrentWeather: jest.fn(() =>
    Promise.resolve({
      name: 'New Delhi',
      sys: { country: 'IN' },
      weather: [{ description: 'clear sky', icon: '01d' }],
      main: {
        temp: 30,
        feels_like: 31,
        temp_min: 27,
        temp_max: 34,
        pressure: 1010,
        humidity: 40,
      },
      wind: { speed: 3.1, deg: 90 },
    }),
  ),
  getDailyWeather: jest.fn(() =>
    Promise.resolve([
      {
        dt: Math.floor(Date.now() / 1000),
        temp: { max: 34, min: 27 },
        weather: [{ description: 'clear sky', icon: '01d' }],
        feels_like: 31,
        pressure: 1010,
        humidity: 40,
        wind_speed: 3.1,
        wind_deg: 90,
        pop: 0.2,
      },
    ]),
  ),
}));
