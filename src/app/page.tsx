'use client';

import Image from 'next/image';
import WeatherSelect from '@/components/WeatherSelect';
import DateRangePicker from '@/components/DateRangePicker';
import { useState } from 'react';

interface WeatherOption {
  id: number;
  name: string;
}

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export default function Home() {
  const [selectedWeather, setSelectedWeather] = useState<WeatherOption | null>(null);
  const [selectedDates, setSelectedDates] = useState<DateRange>({
    startDate: null,
    endDate: null
  });

  const handleSearch = () => {
    console.log('Seçilen Hava Durumu:', selectedWeather?.name);
    console.log('Başlangıç Tarihi:', selectedDates.startDate ? new Date(selectedDates.startDate).toLocaleDateString('tr-TR') : 'Seçilmedi');
    console.log('Bitiş Tarihi:', selectedDates.endDate ? new Date(selectedDates.endDate).toLocaleDateString('tr-TR') : 'Seçilmedi');
  };

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
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-8">
            <div className="flex-1">
              <WeatherSelect onSelect={setSelectedWeather} />
            </div>
            <div className="flex-1">
              <DateRangePicker onSelect={setSelectedDates} />
            </div>
          </div>
          
          <button 
            onClick={handleSearch}
            className="bg-primary-blue text-white px-12 py-4 rounded-lg hover:opacity-90 text-lg font-semibold shadow-lg hover:shadow-xl duration-200"
          >
            Hemen Keşfet
          </button>
        </div>
      </div>
    </div>
  );
}
