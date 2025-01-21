import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import cities from "@/data/cities.json";

interface City {
  id: number;
  name: string;
  region: string;
  latitude: number;
  longitude: number;
}

interface WeatherData {
  cityName: string;
  cityId: string;
  region: string;
  date: string;
  day: string;
  dayTemp: number;
  condition: string;
  precipitation: string;
  nightTemp: number;
}

// Convert month names to numbers
function getMonthNumber(monthStr: string): string {
  const months: Record<string, string> = {
    oca: "01",
    şub: "02",
    mar: "03",
    nis: "04",
    may: "05",
    haz: "06",
    tem: "07",
    ağu: "08",
    eyl: "09",
    eki: "10",
    kas: "11",
    ara: "12",
  };
  return months[monthStr.toLowerCase()] || "01";
}

// Convert date to ISO format
function formatDate(day: string, month: string): string {
  const currentYear = new Date().getFullYear();
  const monthNumber = getMonthNumber(month);
  const paddedDay = day.padStart(2, "0");
  return `${currentYear}-${monthNumber}-${paddedDay}`;
}

// Standardize weather conditions
function standardizeCondition(condition: string): string {
  // First, remove "saatlik" (case-insensitive)
  let normalizedCondition = condition
    .replace(/\s*saatlik\s*/gi, "") // case-insensitive flag eklendi
    .toLowerCase()
    .trim();

  // Some special cases
  normalizedCondition = normalizedCondition
    .replace(/^açılıyor$/, "güneşli")
    .replace(/bol güneş ışığı/, "güneşli")
    .replace(/parlak güneş ışığı/, "güneşli")
    .replace(/bulutların arasından .* güneş/, "parçalı bulutlu")
    .replace(/yüksek bulutlar arasından görünen güneş/, "parçalı bulutlu")
    .replace(/alçak bulutlar/, "bulutlu")
    .replace(/artan bulutlar/, "çok bulutlu")
    .replace(/azalan bulutlar/, "parçalı bulutlu")
    .replace(/^rüzgarlı$/, "rüzgarlı")
    .replace(/çok rüzgarlı/, "rüzgarlı")
    .replace(/daha s[ıi]cak/, "sıcak")
    .replace(/daha so[ğg]uk/, "soğuk")
    .replace(/daha serin/, "serin")
    .replace(/pek so[ğg]uk de[ğg]il/, "ılık")
    .replace(/çok so[ğg]uk/, "soğuk");

  // Empty string check
  if (!normalizedCondition) {
    console.warn(`Only condition information: ${condition}`);
    return condition;
  }

  // Sunny conditions
  if (
    normalizedCondition.includes("güneşli") ||
    normalizedCondition.includes("açık")
  ) {
    if (
      normalizedCondition.includes("parçalı") ||
      normalizedCondition.includes("az")
    ) {
      return "Parçalı Bulutlu";
    }
    return "Güneşli";
  }

  // Cloudy conditions
  if (normalizedCondition.includes("bulutlu")) {
    if (normalizedCondition.includes("parçalı")) {
      return "Parçalı Bulutlu";
    }
    if (normalizedCondition.includes("çok")) {
      return "Bulutlu";
    }
    if (normalizedCondition.includes("az")) {
      return "Bulutlu";
    }
    return "Bulutlu";
  }

  // Rainy conditions
  if (
    normalizedCondition.includes("yağmur") ||
    normalizedCondition.includes("sağanak")
  ) {
    if (normalizedCondition.includes("gök gürültülü")) {
      return "Gök Gürültülü Yağışlı";
    }
    if (normalizedCondition.includes("hafif")) {
      return "Hafif Yağışlı";
    }
    return "Yağmurlu";
  }

  // Snowy conditions
  if (normalizedCondition == "kar") {
    if (normalizedCondition.includes("yağmur")) {
      return "Karlı";
    }
    return "Karlı";
  }

  // other conditions
  if (normalizedCondition.includes("sisli")) return "Sisli";
  if (normalizedCondition.includes("puslu")) return "Sisli";

  console.warn(`Sınıflandırılamayan hava durumu: ${condition}`);
  return condition;
}

async function scrapeWeather(cityName: string): Promise<WeatherData[]> {
  try {
    const formattedCityName = cityName
      .toLowerCase()
      .replace(/ı/g, "i")
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/İ/g, "i");

    const url = `https://havadurumu15gunluk.org/havadurumu45gunluk/${formattedCityName}-hava-durumu-45-gunluk.html`;

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Charset": "utf-8",
      },
    });

    const html = await response.text();
    const $ = cheerio.load(html, { decodeEntities: true });
    const weatherData: WeatherData[] = [];

    // Şehir bilgilerini bul
    const cityData = cities.cities.find(
      (c: City) => c.name.toLowerCase() === cityName.toLowerCase()
    );
    if (!cityData) {
      console.error(`${cityName} için şehir bilgisi bulunamadı`);
      return [];
    }

    // table > rowgroup > row elementlerini bul
    $(".table .row").each((i, element) => {
      if ($(element).hasClass("heading")) return;
      const cells = $(element).find(".cell");
      if (cells.length >= 4) {
        const dateText = $(cells[0]).text().trim();
        const dateParts = dateText.split(" ");
        if (dateParts.length >= 3) {
          const [day, month, dayName] = dateParts;
          const isoDate = formatDate(day, month);

          // Temperature and condition
          const tempText = $(cells[1]).text().trim();

          // Temperature and condition
          const tempMatch = tempText.match(/([-\d]+)°/);
          const dayTemp = tempMatch ? parseInt(tempMatch[1]) : 0;
          const rawCondition = tempText.replace(/([-\d]+)°/, "").trim();
          const condition = standardizeCondition(rawCondition);

          
          const precipitation = $(cells[2]).text().trim();
          const nightTempText = $(cells[3]).text().trim();
          const nightTemp = parseInt(nightTempText.replace("°", "")) || 0;

          weatherData.push({
            cityName: cityData.name,
            cityId: cityData.id.toString(),
            region: cityData.region,
            date: isoDate,
            day: dayName,
            dayTemp,
            condition,
            precipitation,
            nightTemp,
          });
        }
      }
    });

    // sort by date
    weatherData.sort((a, b) => a.date.localeCompare(b.date));

    return weatherData;
  } catch (error) {
    console.error(
      `${cityName} için hava durumu verisi çekilirken hata oluştu:`,
      error
    );
    return [];
  }
}

export async function GET() {
  try {
    const allCities = cities.cities;

    // Her şehir için paralel olarak veri çek (10'ar şehirlik gruplar halinde)
    const weatherData = [];
    for (let i = 0; i < allCities.length; i += 10) {
      const cityBatch = allCities.slice(i, i + 10);
      console.log(
        `${i + 1}-${i + cityBatch.length} arası şehirler işleniyor...`
      );

      const batchResults = await Promise.all(
        cityBatch.map((city: City) => scrapeWeather(city.name))
      );

      weatherData.push(...batchResults.flat());

      // Rate limiting için kısa bir bekleme
      if (i + 10 < allCities.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    // Tarihe göre grupla
    const groupedByDate = weatherData.reduce(
      (acc: Record<string, WeatherData[]>, item: WeatherData) => {
        if (!acc[item.date]) {
          acc[item.date] = [];
        }
        acc[item.date].push(item);
        return acc;
      },
      {}
    );

    // Benzersiz hava durumu koşullarını topla
    const uniqueConditions = new Set<string>();
    weatherData.forEach((item) => {
      uniqueConditions.add(item.condition);
    });

    // Hata olan şehirleri bul
    const citiesWithData = new Set(weatherData.map((item) => item.cityName));
    const citiesWithErrors = allCities
      .filter((city) => !citiesWithData.has(city.name))
      .map((city) => city.name);

    return NextResponse.json({
      totalCities: allCities.length,
      successfulCities: citiesWithData.size,
      failedCities: citiesWithErrors,
      totalDays: Object.keys(groupedByDate).length,
      uniqueConditions: Array.from(uniqueConditions).sort(),
      data: groupedByDate,
    });
  } catch (error) {
    console.error("Veri toplama sırasında hata oluştu:", error);
    return NextResponse.json(
      { error: "Veri toplama sırasında hata oluştu" },
      { status: 500 }
    );
  }
}
