
import React from 'react';
import { AQIResult } from '../types';
import { AQI_LEVELS } from '../constants';
import { MapPin, Calendar, Activity, BarChart3, PieChart as PieIcon, Hexagon } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  RadialBarChart, RadialBar
} from 'recharts';

interface AQIDisplayProps {
  result: AQIResult;
  pollutants: { name: string; value: number }[];
}

// CPCB 24-hour safety limits for comparison
const SAFETY_LIMITS: Record<string, number> = {
  'PM2.5': 60,
  'PM10': 100,
  'NO2': 80,
  'NH3': 400,
  'SO2': 80,
  'CO': 2,
  'O3': 100
};

const AQIDisplay: React.FC<AQIDisplayProps> = ({ result, pollutants }) => {
  const levelInfo = AQI_LEVELS[result.category];
  const formattedDate = result.timestamp ? new Date(result.timestamp).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }) : 'N/A';

  // Data for safety comparison bar chart
  const safetyData = pollutants.map(p => ({
    name: p.name,
    value: p.value,
    limit: SAFETY_LIMITS[p.name] || 100,
    percentage: Math.min((p.value / (SAFETY_LIMITS[p.name] || 100)) * 100, 200)
  }));

  // Data for contribution pie chart
  const pieData = pollutants
    .filter(p => p.value > 0)
    .map(p => ({ name: p.name, value: p.value }));

  // Data for Radar profile
  const radarData = pollutants.map(p => ({
    subject: p.name,
    A: Math.sqrt(p.value + 1), 
    fullMark: 15,
  }));

  // Data for Radial Gauge
  const gaugeData = [
    {
      name: 'AQI',
      value: result.aqiValue,
      fill: '#ffffff',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Primary AQI Hero Card */}
      <div className={`p-8 rounded-3xl text-white shadow-xl flex flex-col items-center justify-center transition-all duration-500 relative overflow-hidden ${levelInfo.color}`}>
        <div className="absolute top-4 left-4 flex flex-col gap-1 z-10">
          <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold border border-white/10">
            <MapPin className="w-3 h-3" />
            {result.location || 'Local Reading'}
          </div>
          <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold border border-white/10">
            <Calendar className="w-3 h-3" />
            {formattedDate}
          </div>
        </div>
        
        {/* Radial Gauge Visual */}
        <div className="relative w-full h-48 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart 
              cx="50%" 
              cy="50%" 
              innerRadius="70%" 
              outerRadius="100%" 
              barSize={12} 
              data={[{ value: 500, fill: 'rgba(255,255,255,0.1)' }, ...gaugeData]}
              startAngle={210}
              endAngle={-30}
            >
              <RadialBar
                background
                dataKey="value"
                cornerRadius={30}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <h2 className="text-7xl font-black tracking-tighter drop-shadow-lg leading-none">{result.aqiValue}</h2>
            <p className="text-sm font-bold uppercase tracking-widest opacity-90 mt-1">{result.category}</p>
          </div>
        </div>
        
        <div className="mt-4 bg-black/20 px-5 py-2 rounded-2xl inline-block backdrop-blur-md border border-white/20 shadow-inner">
           <span className="text-xs font-semibold">Primary Pollutant: <span className="font-black text-orange-200">{result.mainPollutant}</span></span>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Comparison to Safety Standards */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-gray-800 mb-6 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-orange-500" />
            Concentration vs Safety Limits
          </h3>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={safetyData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }}
                />
                <Tooltip 
                  cursor={{ fill: '#fff7ed' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border border-orange-100 rounded-xl shadow-xl text-xs">
                          <p className="font-bold text-gray-900 mb-1">{data.name}</p>
                          <p className="text-gray-500">Value: <span className="text-orange-600 font-bold">{data.value}</span></p>
                          <p className="text-gray-500">Limit: {data.limit}</p>
                          <div className={`mt-1 font-bold ${data.value > data.limit ? 'text-red-500' : 'text-emerald-500'}`}>
                            {data.value > data.limit ? '⚠️ Above Limit' : '✅ Within Limit'}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="percentage" radius={[0, 4, 4, 0]}>
                  {safetyData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.value > entry.limit ? '#ef4444' : '#10b981'} 
                      fillOpacity={0.8}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-auto text-[10px] text-gray-400 font-medium italic">* Percent relative to CPCB 24hr standards</p>
        </div>

        {/* Contribution Distribution */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-gray-800 mb-6 flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-orange-500" />
            Pollutant Mix
          </h3>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={['#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5', '#ea580c', '#c2410c'][index % 7]} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 700 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Profile */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm md:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <Hexagon className="w-4 h-4 text-orange-500" />
              Pollution Signature Profile
            </h3>
            <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
               <Activity className="w-3 h-3" />
               Character Analysis
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#f1f5f9" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }}
                />
                <PolarRadiusAxis hide />
                <Radar
                  name="Concentration Profile"
                  dataKey="A"
                  stroke="#f97316"
                  fill="#f97316"
                  fillOpacity={0.3}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', fontSize: '12px' }}
                  formatter={(value: number) => [`Intensity: ${Math.round(value * value)}`, 'Profile']}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AQIDisplay;
