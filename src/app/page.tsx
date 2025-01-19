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

  const handleSearch = async () => {
    if (!selectedWeather || !selectedDates.startDate || !selectedDates.endDate) {
      console.log('Lütfen tüm alanları doldurun');
      return;
    }

    try {
      const searchParams = new URLSearchParams({
        condition: selectedWeather.name,
        startDate: selectedDates.startDate.toISOString().split('T')[0],
        endDate: selectedDates.endDate.toISOString().split('T')[0]
      });

      const response = await fetch(`/api/weather/search?${searchParams}`);
      const data = await response.json();

      if (data.error) {
        console.error('Arama hatası:', data.error);
        return;
      }

      console.log('Arama Parametreleri:', {
        'Hava Durumu': data.params.condition,
        'Başlangıç Tarihi': data.params.startDate,
        'Bitiş Tarihi': data.params.endDate
      });
      
      console.log(`\nToplam ${data.totalDays} günde, ${data.totalUniqueCities} farklı şehirde "${data.params.condition}" hava durumu görülüyor.`);
      
      Object.entries(data.results as Record<string, string[]>).forEach(([date, cities]) => {
        console.log(`\n${date} tarihinde ${cities.length} şehir:`);
        cities.forEach((city: string) => {
          console.log(`- ${city}`);
        });
      });

    } catch (error) {
      console.error('Arama sırasında bir hata oluştu:', error);
    }
  };

  return (
    <Hero 
      onWeatherSelect={setSelectedWeather}
      onDateSelect={setSelectedDates}
      onSearch={handleSearch}
    />
  );
}
