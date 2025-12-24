
export interface PollutantData {
  pm25: number;
  pm10: number;
  no2: number;
  so2: number;
  co: number;
  o3: number;
  nh3: number;
  location: string;
  timestamp: string;
}

export enum AQICategory {
  GOOD = 'Good',
  SATISFACTORY = 'Satisfactory',
  MODERATE = 'Moderate',
  POOR = 'Poor',
  VERY_POOR = 'Very Poor',
  SEVERE = 'Severe'
}

export interface AQIResult {
  aqiValue: number;
  category: AQICategory;
  mainPollutant: string;
  color: string;
  description: string;
  location?: string;
  timestamp?: string;
}

export interface AIAnalysis {
  healthAdvice: string;
  precautions: string[];
  impactSummary: string;
}
