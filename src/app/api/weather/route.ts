import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import cityWeatherIds from '@/data/cityWeatherIds.json';
import cities from '@/data/cities.json';

interface WeatherData {
  date: string;
  condition: string;
  dayTemp: number;
  nightTemp: number;
}

function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/İ/g, 'i')
    .replace(/[^a-z0-9]/g, '')
    .replace(/\s+/g, '');
}

async function scrapeWeather(cityId: string, cityName: string): Promise<WeatherData[] | null> {
  try {
    const formattedCityName = normalizeText(cityName);
    console.log('Fetching weather for:', { cityId, cityName, formattedCityName });

    const response = await fetch(
      `https://havadurumu15gunluk.xyz/havadurumu45gunluk/${cityId}/${formattedCityName}-hava-durumu-45-gunluk.html`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Charset': 'utf-8'
        }
      }
    );

    const html = await response.text();
    const $ = cheerio.load(html, { decodeEntities: true });
    
    const weatherData: WeatherData[] = [];
    
    // Tablodaki her satırı işle
    $('table tr').each((i: number, row: cheerio.Element) => {
      if (i === 0) return; // Başlık satırını atla
      
      const date = $(row).find('td').eq(0).text().trim();
      const condition = $(row).find('td').eq(1).text().trim().replace(/\s+Saatlik$/, '');
      
      const dayTemp = $(row).find('td').eq(3).text().trim();
      const nightTemp = $(row).find('td').eq(4).text().trim();
      
      if (date && condition) {
        weatherData.push({
          date,
          condition,
          dayTemp: parseInt(dayTemp.replace('°', '')) || 0,
          nightTemp: parseInt(nightTemp.replace('°', '')) || 0
        });
      }
    });

    return weatherData;
  } catch (error) {
    console.error('Hava durumu verisi çekilirken hata oluştu:', error);
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');

  if (!city) {
    return NextResponse.json(
      { error: 'Şehir parametresi gerekli' },
      { status: 400 }
    );
  }

  const normalizedCity = normalizeText(city);
  console.log('Debug:', { 
    originalCity: city,
    normalizedCity,
    availableCities: Object.keys(cityWeatherIds.cityWeatherIds),
    cityFound: cityWeatherIds.cityWeatherIds[normalizedCity as keyof typeof cityWeatherIds.cityWeatherIds]
  });

  const cityId = cityWeatherIds.cityWeatherIds[normalizedCity as keyof typeof cityWeatherIds.cityWeatherIds];
  console.log('Found cityId:', cityId);

  const cityData = cities.cities.find(c => {
    const normalizedName = normalizeText(c.name);
    console.log('Comparing city:', { 
      originalName: c.name, 
      normalizedName, 
      searchingFor: normalizedCity,
      isMatch: normalizedName === normalizedCity 
    });
    return normalizedName === normalizedCity;
  });

  if (!cityId || !cityData) {
    return NextResponse.json(
      { 
        error: 'Geçersiz şehir adı',
        debug: {
          normalizedCity,
          availableCityIds: Object.keys(cityWeatherIds.cityWeatherIds),
          foundCityId: cityId,
          foundCityData: cityData,
          allCities: cities.cities.map(c => ({ 
            name: c.name, 
            normalized: normalizeText(c.name),
            wouldMatch: normalizeText(c.name) === normalizedCity 
          }))
        }
      },
      { status: 400 }
    );
  }

  const weatherData = await scrapeWeather(cityId, cityData.name);

  if (!weatherData) {
    return NextResponse.json(
      { error: 'Hava durumu verisi alınamadı' },
      { status: 500 }
    );
  }

  return NextResponse.json(weatherData, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  });
}