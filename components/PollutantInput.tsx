
import React from 'react';

interface PollutantInputProps {
  label: string;
  subLabel: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

const PollutantInput: React.FC<PollutantInputProps> = ({ 
  label, 
  subLabel, 
  value, 
  onChange, 
  min = 0, 
  max = 1000,
  step = 0.1
}) => {
  return (
    <div className="flex flex-col space-y-2 p-4 bg-white rounded-xl border border-gray-100 shadow-sm transition-all hover:border-orange-200 hover:shadow-md">
      <div className="flex justify-between items-start">
        <label className="text-sm font-bold text-gray-700">{label}</label>
        <span className="text-[10px] font-medium text-gray-400 uppercase">{subLabel}</span>
      </div>
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value || ''}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-lg font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
        placeholder="0.0"
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
      />
    </div>
  );
};

export default PollutantInput;
