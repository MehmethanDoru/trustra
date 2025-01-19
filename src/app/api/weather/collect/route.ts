import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import cityWeatherIds from '@/data/cityWeatherIds.json';
import cities from '@/data/cities.json';

interface WeatherData {
  cityName: string;
  cityId: string;
  region: string;
  date: string;
  originalDate: string;
  condition: string;
  standardCondition: string; // Standart hava durumu koşulu
  dayTemp: number;
  nightTemp: number;
}

// Hava durumu koşullarını eşleştirme
const weatherConditionMap: Record<string, string> = {
  'güneşli': 'Güneşli',
  'parçalı bulutlu': 'Parçalı Bulutlu',
  'çok bulutlu': 'Bulutlu',
  'yağmurlu': 'Yağmurlu',
  'sağanak yağışlı': 'Yağmurlu',
  'kar yağışlı': 'Karlı',
  'karla karışık yağmur': 'Karla Karışık Yağmurlu',
  'hafif yağmurlu': 'Yağmurlu',
  'az bulutlu': 'Az Bulutlu',
  'bulutlu': 'Bulutlu',
  'yağmur ve güneş': 'Yağmurlu ve Güneşli',
  'gök gürültülü': 'Gök Gürültülü Yağmurlu',
  'gök gürültülü sağanak yağışlı': 'Gök Gürültülü Yağmurlu',
  'yağmurlu ve açık hava': 'Yağmurlu ve Güneşli',
  'çoğunlukla güneşli': 'Güneşli',
  'bulutların arasından ara ara kendini gösteren güneş': 'Parçalı Bulutlu',
  'çok bulutlu sonrası güneş': 'Parçalı Bulutlu'
};

function standardizeCondition(condition: string): string {
  const normalizedCondition = condition.toLowerCase().trim();
  
  // Tam eşleşme kontrolü
  if (weatherConditionMap[normalizedCondition]) {
    return weatherConditionMap[normalizedCondition];
  }
  
  // Kısmi eşleşme kontrolü
  for (const [key, value] of Object.entries(weatherConditionMap)) {
    if (normalizedCondition.includes(key)) {
      return value;
    }
  }
  
  // Eşleşme bulunamazsa orijinal durumu döndür
  console.warn(`Eşleştirilemeyen hava durumu koşulu: ${condition}`);
  return condition;
}

async function scrapeWeather(cityId: string, cityName: string): Promise<WeatherData[] | null> {
  try {
    const formattedCityName = cityName.toLowerCase()
      .replace(/ı/g, 'i')
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/İ/g, 'i')
      .replace(/\s+/g, '-');

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
    
    // Şehir eşleştirme mantığını düzelt
    const cityData = cities.cities.find(c => {
      const normalizedCityName = c.name.toLowerCase()
        .replace(/ı/g, 'i')
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/İ/g, 'i');
      
      return normalizedCityName === cityName.toLowerCase();
    });

    // Bugünün tarihini al
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    function formatDate(date: Date): string {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    }

    function getDateFromText(dateText: string): string {
      if (dateText.toLowerCase() === 'bugün') {
        return formatDate(today);
      }
      if (dateText.toLowerCase() === 'yarın') {
        return formatDate(tomorrow);
      }
      
      // Diğer tarihler için (örn: "21 Oca Sal")
      const months: Record<string, string> = {
        'oca': '01', 'şub': '02', 'mar': '03', 'nis': '04',
        'may': '05', 'haz': '06', 'tem': '07', 'ağu': '08',
        'eyl': '09', 'eki': '10', 'kas': '11', 'ara': '12'
      };

      const parts = dateText.split(' ');
      if (parts.length >= 2) {
        const day = parts[0].padStart(2, '0');
        const month = months[parts[1].toLowerCase()];
        const year = today.getFullYear();
        return `${day}.${month}.${year}`;
      }

      return dateText; // Eğer format tanınmazsa orijinal metni döndür
    }
    
    // Tablodaki her satırı işle
    $('table tr').each((i: number, row: cheerio.Element) => {
      if (i === 0) return; // Başlık satırını atla
      
      const dateText = $(row).find('td').eq(0).text().trim();
      const condition = $(row).find('td').eq(1).text().trim().replace(/\s+Saatlik$/, '');
      
      const dayTemp = $(row).find('td').eq(3).text().trim();
      const nightTemp = $(row).find('td').eq(4).text().trim();
      
      if (dateText && condition) {
        weatherData.push({
          cityName,
          cityId,
          region: cityData?.region || '',
          date: getDateFromText(dateText),
          originalDate: dateText,
          condition,
          standardCondition: standardizeCondition(condition),
          dayTemp: parseInt(dayTemp.replace('°', '')) || 0,
          nightTemp: parseInt(nightTemp.replace('°', '')) || 0
        });
      }
    });

    return weatherData;
  } catch (error) {
    console.error(`Hava durumu verisi çekilirken hata oluştu (${cityName}):`, error);
    return null;
  }
}

export async function GET() {
  const allWeatherData: WeatherData[] = [];
  const errors: string[] = [];

  // Her şehir için paralel olarak veri çek
  const promises = Object.entries(cityWeatherIds.cityWeatherIds).map(async ([cityName, cityId]) => {
    try {
      const weatherData = await scrapeWeather(cityId, cityName);
      if (weatherData) {
        allWeatherData.push(...weatherData);
      }
    } catch (error) {
      errors.push(`${cityName}: ${error}`);
    }
  });

  await Promise.all(promises);

  // Sonuçları grupla
  const groupedData = allWeatherData.reduce((acc, item) => {
    const key = item.date;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {} as Record<string, WeatherData[]>);

  return NextResponse.json({
    data: groupedData,
    errors: errors.length > 0 ? errors : undefined,
    totalCities: Object.keys(cityWeatherIds.cityWeatherIds).length,
    collectedData: allWeatherData.length,
    uniqueDates: Object.keys(groupedData).length
  });
} 