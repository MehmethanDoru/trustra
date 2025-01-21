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
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!selectedWeather || !selectedDates.startDate || !selectedDates.endDate) {
      console.log('Lütfen hava durumu ve tarih aralığı seçin');
      return;
    }

    try {
      setIsLoading(true);

      // API'den verileri çek
      const response = await fetch('/api/weather/collect2');
      const data = await response.json();

      if (!data.data) {
        console.log('Veri bulunamadı');
        return;
      }

      // Mevcut tarihleri kontrol et
      const availableDates = Object.keys(data.data).sort();
      console.log('\nMevcut Tarih Aralığı:');
      console.log(`İlk Tarih: ${availableDates[0]}`);
      console.log(`Son Tarih: ${availableDates[availableDates.length - 1]}`);

      // Seçilen tarihleri YYYY-MM-DD formatına çevir
      const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const startDateStr = formatDate(selectedDates.startDate);
      const endDateStr = formatDate(selectedDates.endDate);

      // Her gün için şehirleri filtrele
      const matchingCities = new Set<string>();
      const citiesByDate: Record<string, string[]> = {};
      
      Object.entries(data.data).forEach(([date, cityDataArray]) => {
        // Tarih aralığı kontrolü
        if (date >= startDateStr && date <= endDateStr) {
          citiesByDate[date] = [];
          // O gündeki şehirleri kontrol et
          (cityDataArray as any[]).forEach((cityData) => {
            if (cityData.condition === selectedWeather.name) {
              const cityInfo = `${cityData.cityName} (${cityData.region})`;
              matchingCities.add(cityInfo);
              citiesByDate[date].push(cityInfo);
            }
          });
        }
      });

      // Sonuçları konsola yazdır
      console.log(`\n${selectedWeather.name} hava durumu için ${startDateStr} - ${endDateStr} tarihleri arasında bulunan şehirler:`);
      console.log('----------------------------------------');
      
      // Tarihe göre şehirleri göster
      Object.entries(citiesByDate).forEach(([date, cities]) => {
        if (cities.length > 0) {
          console.log(`\n${date} tarihinde ${cities.length} şehir:`);
          cities.sort().forEach(city => {
            console.log(`- ${city}`);
          });
        }
      });
      
      console.log('\n----------------------------------------');
      console.log(`Toplam ${matchingCities.size} benzersiz şehir bulundu.`);

    } catch (error) {
      console.error('Veri alınırken hata oluştu:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Hero 
      onWeatherSelect={setSelectedWeather}
      onDateSelect={setSelectedDates}
      onSearch={handleSearch}
      isLoading={isLoading}
    />
  );
}
