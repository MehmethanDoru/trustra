'use client';

import Image from 'next/image';
import WeatherSelect from '@/components/WeatherSelect';
import DateRangePicker from '@/components/DateRangePicker';

interface WeatherOption {
  id: number;
  name: string;
}

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface HeroProps {
  onWeatherSelect: (weather: { id: number; name: string; } | null) => void;
  onDateSelect: (dates: { startDate: Date | null; endDate: Date | null; }) => void;
  onSearch: () => void;
  isLoading: boolean;
}

export default function Hero({ onWeatherSelect, onDateSelect, onSearch, isLoading }: HeroProps) {
  return (
    <div className="relative h-screen flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/hero.webp"
          alt="Seyahat arka plan"
          fill
          className="object-cover brightness-50"
          priority
        />
      </div>

      {/* Content */}
      <div className="container relative z-10 mt-0">
        <div className="text-center max-w-4xl mx-auto px-4">
          <div className="space-y-6 mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-white [text-shadow:_0_1px_12px_rgb(0_0_0_/_20%)] tracking-tight leading-tight sm:leading-normal">
              Hava Durumuna Göre<br className="sm:hidden" /> Seyahat Planla
            </h1>
            <p className="text-lg sm:text-xl text-gray-200 font-medium max-w-2xl mx-auto [text-shadow:_0_1px_8px_rgb(0_0_0_/_20%)]">
              İdeal tatil noktanızı keşfedin
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
            <WeatherSelect onSelect={onWeatherSelect} />
            <DateRangePicker onSelect={onDateSelect} />
          </div>
          
          <button
            onClick={onSearch}
            disabled={isLoading}
            className="mx-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-lg font-medium rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/30 disabled:from-blue-400 disabled:to-blue-300 disabled:cursor-not-allowed flex items-center justify-center gap-3 min-w-[180px]"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                    fill="none"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span className="animate-pulse">Aranıyor...</span>
              </>
            ) : (
              <span className="flex items-center gap-2">
                Keşfet
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 