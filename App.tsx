
import React, { useState, useCallback, useEffect } from 'react';
import { PollutantData, AQIResult, AIAnalysis } from './types.ts';
import { INITIAL_DATA } from './constants.tsx';
import { calculateAQI } from './services/aqiCalculator.ts';
import { getAIAnalysis } from './services/geminiService.ts';
import Header from './components/Header.tsx';
import PollutantInput from './components/PollutantInput.tsx';
import AQIDisplay from './components/AQIDisplay.tsx';
import AIInsights from './components/AIInsights.tsx';
import { RefreshCcw, Calculator, Zap, Wind, MapPin, Clock, Calendar as CalendarIcon, LayoutDashboard } from 'lucide-react';

const App: React.FC = () => {
  const [pollutants, setPollutants] = useState<PollutantData>(INITIAL_DATA);
  const [result, setResult] = useState<AQIResult | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedHour, setSelectedHour] = useState(new Date().getHours().toString().padStart(2, '0'));
  const [selectedMinute, setSelectedMinute] = useState(new Date().getMinutes().toString().padStart(2, '0'));

  useEffect(() => {
    const combinedTimestamp = `${selectedDate}T${selectedHour}:${selectedMinute}`;
    setPollutants(prev => ({ ...prev, timestamp: combinedTimestamp }));
  }, [selectedDate, selectedHour, selectedMinute]);

  const handleCalculate = useCallback(async () => {
    const aqiResult = calculateAQI(pollutants);
    setResult(aqiResult);
    
    setIsAnalyzing(true);
    try {
      const analysis = await getAIAnalysis(aqiResult, pollutants);
      setAiAnalysis(analysis);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  }, [pollutants]);

  const resetData = () => {
    setPollutants(INITIAL_DATA);
    setResult(null);
    setAiAnalysis(null);
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setSelectedHour(new Date().getHours().toString().padStart(2, '0'));
    setSelectedMinute(new Date().getMinutes().toString().padStart(2, '0'));
  };

  const pollutantList = [
    { name: 'PM2.5', value: pollutants.pm25 },
    { name: 'PM10', value: pollutants.pm10 },
    { name: 'NO2', value: pollutants.no2 },
    { name: 'NH3', value: pollutants.nh3 },
    { name: 'SO2', value: pollutants.so2 },
    { name: 'CO', value: pollutants.co },
    { name: 'O3', value: pollutants.o3 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      <Header />
      
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                <Calculator className="w-6 h-6 text-orange-500" />
                Air Monitoring Data
              </h2>
              <button 
                onClick={resetData}
                className="text-xs font-bold text-gray-400 hover:text-orange-600 flex items-center gap-1 transition-colors"
              >
                <RefreshCcw className="w-3 h-3" />
                Reset Form
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
               <div className="sm:col-span-12 space-y-2">
                 <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 px-1">
                   <MapPin className="w-3 h-3 text-orange-500" />
                   Observation Location
                 </label>
                 <input 
                   type="text" 
                   value={pollutants.location}
                   onChange={(e) => setPollutants(prev => ({ ...prev, location: e.target.value }))}
                   placeholder="e.g. South Delhi, NCR"
                   className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm font-medium shadow-inner"
                 />
               </div>

               <div className="sm:col-span-6 space-y-2">
                 <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 px-1">
                   <CalendarIcon className="w-3 h-3 text-orange-500" />
                   Date
                 </label>
                 <input 
                   type="date" 
                   value={selectedDate}
                   onChange={(e) => setSelectedDate(e.target.value)}
                   className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm font-medium shadow-inner"
                 />
               </div>

               <div className="sm:col-span-6 space-y-2">
                 <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 px-1">
                   <Clock className="w-3 h-3 text-orange-500" />
                   Reading Time
                 </label>
                 <div className="flex items-center gap-2">
                    <select 
                      value={selectedHour}
                      onChange={(e) => setSelectedHour(e.target.value)}
                      className="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm font-bold text-center appearance-none shadow-inner"
                    >
                      {Array.from({ length: 24 }).map((_, i) => {
                        const h = i.toString().padStart(2, '0');
                        return <option key={h} value={h}>{h}</option>;
                      })}
                    </select>
                    <span className="font-bold text-gray-300">:</span>
                    <select 
                      value={selectedMinute}
                      onChange={(e) => setSelectedMinute(e.target.value)}
                      className="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm font-bold text-center appearance-none shadow-inner"
                    >
                      {Array.from({ length: 60 }).map((_, i) => {
                        const m = i.toString().padStart(2, '0');
                        return <option key={m} value={m}>{m}</option>;
                      })}
                    </select>
                 </div>
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PollutantInput 
                label="PM 2.5" 
                subLabel="µg/m³" 
                value={pollutants.pm25} 
                onChange={(v) => setPollutants(prev => ({ ...prev, pm25: v }))} 
                max={500}
              />
              <PollutantInput 
                label="PM 10" 
                subLabel="µg/m³" 
                value={pollutants.pm10} 
                onChange={(v) => setPollutants(prev => ({ ...prev, pm10: v }))} 
                max={600}
              />
              <PollutantInput 
                label="NO2" 
                subLabel="µg/m³" 
                value={pollutants.no2} 
                onChange={(v) => setPollutants(prev => ({ ...prev, no2: v }))} 
                max={500}
              />
              <PollutantInput 
                label="NH3" 
                subLabel="µg/m³" 
                value={pollutants.nh3} 
                onChange={(v) => setPollutants(prev => ({ ...prev, nh3: v }))} 
                max={2500}
              />
              <PollutantInput 
                label="SO2" 
                subLabel="µg/m³" 
                value={pollutants.so2} 
                onChange={(v) => setPollutants(prev => ({ ...prev, so2: v }))} 
                max={1000}
              />
              <PollutantInput 
                label="CO" 
                subLabel="mg/m³" 
                value={pollutants.co} 
                onChange={(v) => setPollutants(prev => ({ ...prev, co: v }))} 
                max={50}
                step={0.1}
              />
              <div className="sm:col-span-2">
                <PollutantInput 
                  label="O3" 
                  subLabel="µg/m³" 
                  value={pollutants.o3} 
                  onChange={(v) => setPollutants(prev => ({ ...prev, o3: v }))} 
                  max={1000}
                />
              </div>
            </div>

            <button
              onClick={handleCalculate}
              disabled={isAnalyzing}
              className={`w-full py-5 rounded-3xl flex items-center justify-center gap-3 text-lg font-bold transition-all shadow-xl hover:shadow-orange-200/50 ${
                isAnalyzing 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' 
                : 'bg-gradient-to-r from-orange-600 to-orange-500 text-white hover:from-orange-700 hover:to-orange-600 active:scale-[0.98]'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Zap className="w-5 h-5 animate-spin text-orange-400" />
                  Processing Visual Analytics...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Analyze Air Quality
                </>
              )}
            </button>
          </div>

          <div className="lg:col-span-6 space-y-8">
            {!result ? (
              <div className="bg-white border border-gray-100 rounded-3xl p-16 flex flex-col items-center justify-center text-center space-y-6 shadow-sm min-h-[500px]">
                <div className="bg-orange-50 p-8 rounded-full border border-orange-100">
                  <Wind className="w-16 h-16 text-orange-200" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-black text-gray-800 tracking-tight">VayuDoot Intelligence</h3>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-[320px] mx-auto">
                    Complete the air monitoring data to unlock high-fidelity charts, safety audits, and AI-powered health recommendations.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                    <LayoutDashboard className="w-6 h-6 text-orange-500" />
                    Insight Dashboard
                  </h2>
                </div>
                <AQIDisplay result={result} pollutants={pollutantList} />
                <AIInsights analysis={aiAnalysis} loading={isAnalyzing} />
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-100 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left space-y-2">
            <h4 className="text-xl font-black text-gray-900 flex items-center justify-center md:justify-start gap-2">
               <Wind className="w-5 h-5 text-orange-500" />
               VayuDoot
            </h4>
            <p className="text-xs text-gray-400 font-medium max-w-sm">
              Advanced Environmental Intelligence for Indian Cities. Data modeling compliant with CPCB/NAMP reporting standards.
            </p>
          </div>
          <div className="text-center md:text-right space-y-2">
            <div className="flex justify-center md:justify-end gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
              <span>Privacy</span>
              <span>Terms</span>
              <span>API Status</span>
            </div>
            <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.2em]">
              © 2024 VayuDoot
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
