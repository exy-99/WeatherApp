# WeatherApp - Agent Instructions
# CRITICAL RULES – MUST FOLLOW

## PLANNING MODE

- Always ask clarifying questions.
- Never assume design, tech stack, or features.
- Use deep-dive sub‑agents to assist with research.
- Use deep‑dive sub‑agents to review the different aspects of your plan before presenting to the user.

## RESPONSES

- Keep responses concise and to the point – unless the user asks otherwise.

## CHANGE / EDIT MODE

- **Never implement features yourself** when possible – use sub‑agents!
- Identify changes from the plan that can be implemented in parallel, and use sub‑agents to implement the features efficiently.
- When using sub‑agents to implement features, act as a coordinator only.
- Use the best model for the task – premium models for complex tasks (like coding) and mid‑tier models for simpler tasks (like documentation).
- After completing features (large or small), always run commands like `lint`, `type check`, and `next build` to check code quality.



## TESTING

- Use any testing tools, libraries, or frameworks available in the project for testing your changes.
- **Never assume your changes simply work** – always test!
- If the project does not have any testing tools, scripts, MCP tools, skills, etc. available for testing, ask the user whether testing should be skipped.

## UI DESIGN

- Always follow the UI design system when creating or reviewing components or pages.
- Design System reference: [`@DESIGN.md`](./DESIGN.md)

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