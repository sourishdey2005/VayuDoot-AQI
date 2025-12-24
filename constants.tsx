
import React from 'react';
import { Wind, ShieldAlert, Heart, Info, AlertTriangle, AlertCircle } from 'lucide-react';
import { AQICategory } from './types';

export const AQI_LEVELS = {
  [AQICategory.GOOD]: {
    max: 50,
    color: 'bg-green-500',
    textColor: 'text-green-700',
    icon: <Wind className="w-8 h-8 text-white" />,
    description: 'Minimal impact'
  },
  [AQICategory.SATISFACTORY]: {
    max: 100,
    color: 'bg-emerald-400',
    textColor: 'text-emerald-700',
    icon: <Heart className="w-8 h-8 text-white" />,
    description: 'May cause minor breathing discomfort to sensitive people'
  },
  [AQICategory.MODERATE]: {
    max: 200,
    color: 'bg-yellow-400',
    textColor: 'text-yellow-700',
    icon: <Info className="w-8 h-8 text-white" />,
    description: 'May cause breathing discomfort to people with lungs, asthma and heart diseases'
  },
  [AQICategory.POOR]: {
    max: 300,
    color: 'bg-orange-500',
    textColor: 'text-orange-700',
    icon: <AlertTriangle className="w-8 h-8 text-white" />,
    description: 'May cause breathing discomfort to most people on prolonged exposure'
  },
  [AQICategory.VERY_POOR]: {
    max: 400,
    color: 'bg-red-500',
    textColor: 'text-red-700',
    icon: <AlertCircle className="w-8 h-8 text-white" />,
    description: 'May cause respiratory illness on prolonged exposure'
  },
  [AQICategory.SEVERE]: {
    max: 500,
    color: 'bg-red-900',
    textColor: 'text-red-950',
    icon: <ShieldAlert className="w-8 h-8 text-white" />,
    description: 'Affects healthy people and seriously impacts those with existing diseases'
  }
};

export const INITIAL_DATA = {
  pm25: 0,
  pm10: 0,
  no2: 0,
  so2: 0,
  co: 0,
  o3: 0,
  nh3: 0,
  location: '',
  timestamp: new Date().toISOString().slice(0, 16)
};
