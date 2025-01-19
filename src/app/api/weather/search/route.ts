import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import cityWeatherIds from '@/data/cityWeatherIds.json';
import cities from '@/data/cities.json';

interface SearchParams {
  condition: string;
  startDate: string;
  endDate: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const params: SearchParams = {
    condition: searchParams.get('condition') || '',
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || ''
  };

  if (!params.condition || !params.startDate || !params.endDate) {
    return NextResponse.json(
      { error: 'Hava durumu ve tarih aralığı gerekli' },
      { status: 400 }
    );
  }

  // Collect endpoint'inden veriyi al
  const collectResponse = await fetch('http://localhost:3000/api/weather/collect');
  const collectData = await collectResponse.json();

  console.log('Aranan Hava Durumu:', params.condition);
  console.log('İlk Gün Örnek Veri:', Object.entries(collectData.data)[0]);

  if (!collectData.data) {
    return NextResponse.json(
      { error: 'Hava durumu verisi alınamadı' },
      { status: 500 }
    );
  }

  // Tarihleri Date objelerine çevir
  const startDate = new Date(params.startDate);
  const endDate = new Date(params.endDate);

  // Sonuçları filtrele
  const resultsByDate: Record<string, string[]> = {};

  Object.entries(collectData.data).forEach(([date, cities]) => {
    const currentDate = new Date(date.split('.').reverse().join('-'));
    
    if (currentDate >= startDate && currentDate <= endDate) {
      const matchingCities: string[] = [];
      
      (cities as any[]).forEach((city: any) => {
        console.log('Şehir Hava Durumu:', {
          city: city.cityName,
          condition: city.condition,
          standardCondition: city.standardCondition
        });
        
        if (city.standardCondition === params.condition) {
          matchingCities.push(city.cityName);
        }
      });

      if (matchingCities.length > 0) {
        resultsByDate[date] = matchingCities;
      }
    }
  });

  return NextResponse.json({
    results: resultsByDate,
    params,
    totalDays: Object.keys(resultsByDate).length,
    totalUniqueCities: [...new Set(Object.values(resultsByDate).flat())].length
  });
} 