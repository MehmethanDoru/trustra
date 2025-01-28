'use client';

import { useState, useEffect } from 'react';
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
  weatherByDate: Record<string, {
    condition: string;
    dayTemp: number;
    nightTemp: number;
    precipitation?: number;
  }>;
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
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrolled / maxScroll) * 100;
      
      setShowScrollButton(scrolled > 300);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    const duration = 1000;
    const start = window.scrollY;
    const startTime = performance.now();

    const easeOutCubic = (t: number) => (--t) * t * t + 1;

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      window.scrollTo(0, start * (1 - easeOutCubic(progress)));

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

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

      // date and city data
      const cityData: Record<string, { 
        region: string; 
        dates: string[]; 
        weatherByDate: Record<string, {
          condition: string;
          dayTemp: number;
          nightTemp: number;
          precipitation?: number;
        }>;
      }> = {};

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

              if (matches) {
                console.log(`${city.cityName}: ${temp}°C - Eşleşti (${selectedWeather.name})`);
              }
            } else {
              matches = city.condition === selectedWeather.name;
              if (matches) {
                console.log(`${city.cityName}: ${city.condition} - Eşleşti`);
              }
            }

            if (matches) {
              if (!cityData[city.cityName]) {
                cityData[city.cityName] = {
                  region: city.region,
                  dates: [],
                  weatherByDate: {}
                };
              }
              cityData[city.cityName].dates.push(date);
              cityData[city.cityName].weatherByDate[date] = {
                condition: city.condition,
                dayTemp: city.dayTemp,
                nightTemp: city.nightTemp,
                precipitation: city.precipitation
              };
            }
          });
        }
      });

      // all days
      const totalDays = Object.keys(data.data).filter(date => 
        date >= startDateStr && date <= endDateStr
      ).length;

      console.log('Toplam gün sayısı:', totalDays);

      const consistentCities = Object.entries(cityData)
        .filter(([_, data]) => data.dates.length === totalDays)
        .map(([name, data]) => ({
          name,
          region: data.region,
          dates: data.dates,
          weatherByDate: data.weatherByDate
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
      {showScrollButton && (
        <div className="fixed bottom-8 right-8 z-50">
         
          <button
            onClick={scrollToTop}
            className="relative bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 cursor-pointer hover:shadow-blue-500/50 hover:-translate-y-1 group"
          >
            <svg 
              className="w-6 h-6 transition-transform group-hover:scale-110" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2.5} 
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </button>
        </div>
      )}
    </main>
  );
}
