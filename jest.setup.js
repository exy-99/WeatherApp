jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

const mockSafeAreaContext = () => {
  const React = require('react');
  const insets = { top: 0, right: 0, bottom: 0, left: 0 };
  const frame = { x: 0, y: 0, width: 320, height: 640 };

  const SafeAreaProvider = ({ children }) => children;
  SafeAreaProvider.displayName = 'SafeAreaProvider';

  const SafeAreaView = ({ children }) => children;
  SafeAreaView.displayName = 'SafeAreaView';

  return {
    SafeAreaProvider,
    SafeAreaView,
    useSafeAreaInsets: () => insets,
    useSafeAreaFrame: () => frame,
    initialWindowMetrics: { frame, insets },
    SafeAreaInsetsContext: React.createContext(insets),
    SafeAreaFrameContext: React.createContext(frame),
  };
};

jest.mock('react-native-safe-area-context', () => mockSafeAreaContext());

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
      clouds: { all: 20 },
      visibility: 10000,
      dt: Math.floor(Date.now() / 1000),
      timezone: 0,
    }),
  ),
  getHourlyWeather: jest.fn(() => {
    const now = Math.floor(Date.now() / 1000);
    return Promise.resolve(
      [30, 31, 29, 28].map((temp, i) => ({
        dt: now + i * 3600,
        main: {
          temp,
          feels_like: temp + 1,
          temp_min: temp - 2,
          temp_max: temp + 3,
          pressure: 1010,
          humidity: 40,
        },
        weather: [{ description: 'clear sky', icon: '01d' }],
        clouds: { all: 20 },
        wind: { speed: 3.1, deg: 90 },
        visibility: 10000,
        pop: [0.1, 0.2, 0.1, 0][i],
        dt_txt: '',
      })),
    );
  }),
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
  reverseGeocode: jest.fn(() => Promise.resolve('New Delhi, IN')),
  geocode: jest.fn(() => Promise.resolve([])),
}));