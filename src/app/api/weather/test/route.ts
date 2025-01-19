import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

interface WeatherData {
  date: string;
  day: string;
  dayTemp: number;
  condition: string;
  precipitation: string;
  nightTemp: number;
}

// Ay isimlerini sayılara çeviren yardımcı fonksiyon
function getMonthNumber(monthStr: string): string {
  const months: Record<string, string> = {
    'oca': '01',
    'şub': '02',
    'mar': '03',
    'nis': '04',
    'may': '05',
    'haz': '06',
    'tem': '07',
    'ağu': '08',
    'eyl': '09',
    'eki': '10',
    'kas': '11',
    'ara': '12'
  };
  return months[monthStr.toLowerCase()] || '01';
}

// Tarihi ISO formatına çeviren yardımcı fonksiyon
function formatDate(day: string, month: string): string {
  const currentYear = new Date().getFullYear();
  const monthNumber = getMonthNumber(month);
  const paddedDay = day.padStart(2, '0');
  return `${currentYear}-${monthNumber}-${paddedDay}`;
}

async function scrapeWeather(): Promise<WeatherData[]> {
  try {
    const response = await fetch(
      'https://havadurumu15gunluk.org/havadurumu45gunluk/bayburt-hava-durumu-45-gunluk.html',
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

    // table > rowgroup > row elementlerini bul
    $('.table .row').each((i, element) => {
      // Başlık satırını atla
      if ($(element).hasClass('heading')) return;
      
      // Her bir hücreyi bul
      const cells = $(element).find('.cell');
      
      if (cells.length >= 4) {
        // Tarih bilgisini al
        const dateText = $(cells[0]).text().trim();
        
        // Tarih formatı: "20 Oca Pzt" gibi
        const dateParts = dateText.split(' ');
        if (dateParts.length >= 3) {
          const [day, month, dayName] = dateParts;
          const isoDate = formatDate(day, month);
          
          // Sıcaklık ve durum bilgisini al
          const tempText = $(cells[1]).text().trim();
          
          // Sıcaklık ve durumu ayır
          const tempMatch = tempText.match(/([-\d]+)°/);
          const dayTemp = tempMatch ? parseInt(tempMatch[1]) : 0;
          const condition = tempText.replace(/([-\d]+)°/, '').trim();
          
          // Yağış olasılığı ve gece sıcaklığı
          const precipitation = $(cells[2]).text().trim();
          const nightTempText = $(cells[3]).text().trim();
          const nightTemp = parseInt(nightTempText.replace('°', '')) || 0;

          weatherData.push({
            date: isoDate,
            day: dayName,
            dayTemp,
            condition,
            precipitation,
            nightTemp
          });
        }
      }
    });

    // Tarihe göre sırala
    weatherData.sort((a, b) => a.date.localeCompare(b.date));

    return weatherData;
  } catch (error) {
    console.error('Hava durumu verisi çekilirken hata oluştu:', error);
    return [];
  }
}

export async function GET() {
  const weatherData = await scrapeWeather();
  
  return NextResponse.json({
    city: 'Bayburt',
    totalDays: weatherData.length,
    data: weatherData
  });
} 