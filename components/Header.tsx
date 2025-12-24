
import React from 'react';
import { Wind } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="bg-orange-500 p-2 rounded-lg">
              <Wind className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">VayuDoot</h1>
              <p className="text-[10px] text-gray-500 uppercase font-semibold -mt-1">Real-time AQI Analyzer</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">India Std (CPCB)</span>
            <span className="text-sm font-medium text-green-600 animate-pulse">● System Live</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
