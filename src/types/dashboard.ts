export interface InsightChip {
  id: string;
  label: string;
  icon: string;
  variant: 'primary' | 'secondary' | 'warning';
}

export interface StatMetric {
  id: string;
  label: string;
  value: string;
  icon: string;
  progress: number; // 0 to 1
}