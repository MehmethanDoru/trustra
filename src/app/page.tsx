'use client';

import { useState } from 'react';
import Hero from '@/components/hero/Hero';

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
    <Hero 
      onWeatherSelect={setSelectedWeather}
      onDateSelect={setSelectedDates}
      onSearch={handleSearch}
    />
  );
}
