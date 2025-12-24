
import React from 'react';
import { AIAnalysis } from '../types';
import { Sparkles, CheckCircle2, HeartPulse, Activity } from 'lucide-react';

interface AIInsightsProps {
  analysis: AIAnalysis | null;
  loading: boolean;
}

const AIInsights: React.FC<AIInsightsProps> = ({ analysis, loading }) => {
  if (loading) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center space-y-4 animate-pulse">
        <Sparkles className="w-10 h-10 text-orange-200" />
        <div className="h-4 w-48 bg-gray-100 rounded"></div>
        <div className="h-3 w-64 bg-gray-50 rounded"></div>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-2xl border border-orange-100 shadow-sm relative overflow-hidden">
        <Sparkles className="absolute -top-2 -right-2 w-20 h-20 text-orange-200/20 rotate-12" />
        
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-bold text-gray-900">Expert AI Analysis</h3>
        </div>

        <div className="space-y-6">
          <section>
            <div className="flex items-center gap-2 mb-2 text-orange-700">
              <HeartPulse className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Health Advice</span>
            </div>
            <p className="text-gray-700 leading-relaxed text-sm font-medium">
              {analysis.healthAdvice}
            </p>
          </section>

          <section>
             <div className="flex items-center gap-2 mb-3 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Recommended Precautions</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {analysis.precautions.map((item, idx) => (
                <div key={idx} className="bg-white/60 border border-emerald-100 p-3 rounded-xl flex items-start gap-3">
                  <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-gray-700 font-medium">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="pt-4 border-t border-orange-100">
            <p className="text-xs italic text-gray-500">
              "{analysis.impactSummary}"
            </p>
          </div>
        </div>
      </div>
      
      <p className="text-[10px] text-gray-400 text-center px-4">
        Disclaimer: AI insights are for informational purposes only. Consult a healthcare professional for specific medical advice.
      </p>
    </div>
  );
};

export default AIInsights;
