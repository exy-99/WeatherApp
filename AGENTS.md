# WeatherApp - Agent Instructions

## Quick Commands
```bash
npm start          # Start Metro dev server
npm run android    # Build & run Android
npm run ios        # Build & run iOS (requires CocoaPods first)
npm test           # Run Jest tests
npm run lint       # Run ESLint
```

## iOS Setup (First Time / After Native Deps)
```bash
bundle install
bundle exec pod install
```

## Architecture
- **Entry**: `index.js` → `App.tsx` → `HomeScreen.tsx`
- **Styling**: NativeWind (Tailwind CSS) via `global.css` + `tailwind.config.js`
- **Animation**: React Native Reanimated (babel plugin required)
- **API**: OpenWeatherMap via `src/api/weatherapi.ts` (axios, env vars from `@env`)
- **State**: Custom hooks in `src/hooks/` (location, persistence)

## Key Files
| File | Purpose |
|------|---------|
| `.env` | API keys & endpoints (loaded via `react-native-dotenv` at `@env`) |
| `babel.config.js` | Presets: `@react-native/babel-preset`, `nativewind/babel`; Plugins: `react-native-dotenv`, `react-native-reanimated/plugin` |
| `jest.setup.js` | Mocks `@react-native-community/geolocation` and `src/api/weatherapi` |

## Environment Variables
Required in `.env`:
```
API_KEY=your_openweathermap_key
CURRENT_WEATHER_URL=https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}
HOURLY_WEATHER_URL=https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API_KEY}
DAILY_WEATHER_URL=https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API_KEY}
GEOCODING_URL=https://api.openweathermap.org/geo/1.0/direct
```

## Testing
- Single test: `npm test -- --testPathPattern=App.test.tsx`
- Mocks defined in `jest.setup.js` (geolocation returns Delhi coords; weather API returns fixed responses)
- Run order: `lint → test` (no typecheck script defined)

## Gotchas
- Reanimated **must** be last in babel plugins
- `react-native-dotenv` loads `.env` at build time—restart Metro after changes
- Android location permission handled in `useLocation.ts` (runtime request)
- iOS needs CocoaPods after any native dependency change
- Node ≥ 22.11.0 required (package.json engines)