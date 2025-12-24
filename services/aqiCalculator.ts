import { PollutantData, AQIResult, AQICategory } from '../types.ts';

const getSubIndex = (value: number, breaks: number[], aqiBreaks: number[]): number => {
  for (let i = 0; i < breaks.length - 1; i++) {
    if (value >= breaks[i] && value <= breaks[i + 1]) {
      return ((aqiBreaks[i + 1] - aqiBreaks[i]) / (breaks[i + 1] - breaks[i])) * (value - breaks[i]) + aqiBreaks[i];
    }
  }
  return value > breaks[breaks.length - 1] ? 500 : 0;
};

const aqiBreaks = [0, 50, 100, 200, 300, 400, 500];

export const calculateAQI = (data: PollutantData): AQIResult => {
  const pm25Sub = getSubIndex(data.pm25, [0, 30, 60, 90, 120, 250, 380], aqiBreaks);
  const pm10Sub = getSubIndex(data.pm10, [0, 50, 100, 250, 350, 430, 500], aqiBreaks);
  const no2Sub = getSubIndex(data.no2, [0, 40, 80, 180, 280, 400, 500], aqiBreaks);
  const so2Sub = getSubIndex(data.so2, [0, 40, 80, 380, 800, 1600, 2000], aqiBreaks);
  const coSub = getSubIndex(data.co, [0, 1, 2, 10, 17, 34, 50], aqiBreaks);
  const o3Sub = getSubIndex(data.o3, [0, 50, 100, 168, 208, 748, 1000], aqiBreaks);
  const nh3Sub = getSubIndex(data.nh3, [0, 200, 400, 800, 1200, 1800, 2500], aqiBreaks);

  const subIndices = [
    { name: 'PM2.5', value: pm25Sub },
    { name: 'PM10', value: pm10Sub },
    { name: 'NO2', value: no2Sub },
    { name: 'SO2', value: so2Sub },
    { name: 'CO', value: coSub },
    { name: 'O3', value: o3Sub },
    { name: 'NH3', value: nh3Sub }
  ];

  const maxSubIndex = Math.max(...subIndices.map(s => s.value));
  const mainPollutant = subIndices.find(s => s.value === maxSubIndex)?.name || 'Mixed';

  let category: AQICategory = AQICategory.GOOD;
  if (maxSubIndex <= 50) category = AQICategory.GOOD;
  else if (maxSubIndex <= 100) category = AQICategory.SATISFACTORY;
  else if (maxSubIndex <= 200) category = AQICategory.MODERATE;
  else if (maxSubIndex <= 300) category = AQICategory.POOR;
  else if (maxSubIndex <= 400) category = AQICategory.VERY_POOR;
  else category = AQICategory.SEVERE;

  return {
    aqiValue: Math.round(maxSubIndex),
    category,
    mainPollutant,
    color: '', 
    description: '',
    location: data.location,
    timestamp: data.timestamp
  };
};