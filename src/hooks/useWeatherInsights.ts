import { CurrentWeatherResponse, DailyForecastItem } from '../types/weather';
import { InsightChip } from '../types/dashboard';

export function useWeatherInsights(
  current: CurrentWeatherResponse,
  daily: DailyForecastItem | undefined,
): InsightChip[] {
  const pop = daily?.pop ?? 0;
  const chips: InsightChip[] = [];

  if (pop > 0.5) {
    chips.push({
      id: 'umbrella',
      label: 'Carry umbrella',
      icon: 'umbrella-outline',
      variant: 'primary',
    });
  }
  if (current.main.temp > 30) {
    chips.push({
      id: 'heat',
      label: 'Extreme heat — hydrate',
      icon: 'thermometer-outline',
      variant: 'warning',
    });
  }
  if (current.wind.speed > 6) {
    chips.push({
      id: 'wind',
      label: 'Windy — stay safe',
      icon: 'flag-outline',
      variant: 'secondary',
    });
  }
  if (current.main.humidity > 75) {
    chips.push({
      id: 'humidity',
      label: 'Humid — stay cool',
      icon: 'water-outline',
      variant: 'secondary',
    });
  }
  if (pop <= 0.3) {
    chips.push({
      id: 'outdoor',
      label: 'Great for outdoors',
      icon: 'sunny-outline',
      variant: 'secondary',
    });
  }

  return chips.slice(0, 3);
}