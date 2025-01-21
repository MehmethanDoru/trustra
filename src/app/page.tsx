'use client';

import { useState } from 'react';
import Hero from '@/components/hero/Hero';
import CityResults from '@/components/results/CityResults';

interface WeatherOption {
  id: number;
  name: string;
}

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface City {
  name: string;
  region: string;
  dates: string[];
}

const tempRanges = {
  'Sıcak': { min: 20 },
  'Ilık': { min: 14, max: 20 },
  'Serin': { min: 5, max: 14 },
  'Soğuk': { max: 5 }
} as const;

export default function Home() {
  const [selectedWeather, setSelectedWeather] = useState<WeatherOption | null>(null);
  const [selectedDates, setSelectedDates] = useState<DateRange>({
    startDate: null,
    endDate: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'route' | 'all'>('all');
  const [cities, setCities] = useState<City[]>([]);

  const handleSearch = async () => {
    if (!selectedWeather || !selectedDates.startDate || !selectedDates.endDate) {
      console.log('Lütfen hava durumu ve tarih aralığı seçin');
      return;
    }

    try {
      setIsLoading(true);
      setCities([]); // reset

      const response = await fetch('/api/weather/collect2');
      const data = await response.json();

      if (!data.data) {
        console.log('Veri bulunamadı');
        return;
      }

      console.log('Seçilen hava durumu:', selectedWeather.name);
      console.log('Sıcaklık seçeneği mi?:', selectedWeather.name in tempRanges);

      const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const startDateStr = formatDate(selectedDates.startDate);
      const endDateStr = formatDate(selectedDates.endDate);

      console.log('Tarih aralığı:', startDateStr, 'ile', endDateStr);

      // Şehirleri ve tarihlerini topla
      const cityData: Record<string, { region: string; dates: string[] }> = {};

      Object.entries(data.data).forEach(([date, cityDataArray]) => {
        if (date >= startDateStr && date <= endDateStr) {
          (cityDataArray as any[]).forEach((city) => {
            let matches = false;

            if (selectedWeather.name in tempRanges) {
              const range = tempRanges[selectedWeather.name as keyof typeof tempRanges];
              const temp = city.dayTemp;
              
              if ('min' in range && 'max' in range) {
                matches = temp >= range.min && temp <= range.max;
              } else if ('min' in range) {
                matches = temp >= range.min;
              } else if ('max' in range) {
                matches = temp <= range.max;
              }

              // Sıcaklık eşleşme durumunu logla
              if (matches) {
                console.log(`${city.cityName}: ${temp}°C - Eşleşti (${selectedWeather.name})`);
              }
            } else {
              matches = city.condition === selectedWeather.name;
              // Hava durumu eşleşme durumunu logla
              if (matches) {
                console.log(`${city.cityName}: ${city.condition} - Eşleşti`);
              }
            }

            if (matches) {
              if (!cityData[city.cityName]) {
                cityData[city.cityName] = {
                  region: city.region,
                  dates: []
                };
              }
              cityData[city.cityName].dates.push(date);
            }
          });
        }
      });

      // Tüm günlerde uygun olan şehirleri filtrele
      const totalDays = Object.keys(data.data).filter(date => 
        date >= startDateStr && date <= endDateStr
      ).length;

      console.log('Toplam gün sayısı:', totalDays);

      const consistentCities = Object.entries(cityData)
        .filter(([_, data]) => data.dates.length === totalDays)
        .map(([name, data]) => ({
          name,
          region: data.region,
          dates: data.dates
        }));

      console.log('Bulunan şehir sayısı:', consistentCities.length);
      console.log('Şehirler:', consistentCities);

      setCities(consistentCities);

    } catch (error) {
      console.error('Veri alınırken hata oluştu:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative">
      <Hero 
        onWeatherSelect={setSelectedWeather}
        onDateSelect={setSelectedDates}
        onSearch={handleSearch}
        isLoading={isLoading}
        onTabChange={setActiveTab}
      />
      <CityResults
        cities={cities}
        isLoading={isLoading}
        searchedWeather={selectedWeather?.name || ''}
        dateRange={selectedDates}
      />
    </main>
  );
}
