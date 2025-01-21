'use client';

import { useEffect, useRef, useState } from 'react';

interface City {
  name: string;
  region: string;
  dates: string[];
}

interface CityResultsProps {
  cities: City[];
  isLoading: boolean;
  searchedWeather: string;
  dateRange: {
    startDate: Date | null;
    endDate: Date | null;
  };
}

interface GroupedCities {
  [key: string]: City[];
}

export default function CityResults({ cities, isLoading, searchedWeather, dateRange }: CityResultsProps) {
  const resultsRef = useRef<HTMLDivElement>(null);
  const [groupedCities, setGroupedCities] = useState<GroupedCities>({});
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [showResults, setShowResults] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const smoothScroll = (targetPosition: number, duration: number) => {
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    let startTime: number | null = null;

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      // Easing function - easeInOutQuad
      const ease = (t: number) => {
        return t < 0.5 
          ? 2 * t * t 
          : -1 + (4 - 2 * t) * t;
      };

      window.scrollTo(0, startPosition + distance * ease(progress));

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };

  useEffect(() => {
    if (cities.length > 0) {
      const grouped = cities.reduce((acc: GroupedCities, city) => {
        if (!acc[city.region]) {
          acc[city.region] = [];
        }
        acc[city.region].push(city);
        return acc;
      }, {});
      
      setGroupedCities(grouped);
      setSelectedRegion(Object.keys(grouped)[0]);
      
      // Önce sonuçları göster
      setShowResults(true);
      // Kısa bir gecikme ile görünürlük animasyonunu başlat
      setTimeout(() => {
        setIsVisible(true);
        // Görünürlük animasyonu başladıktan sonra scroll yap
        setTimeout(() => {
          if (resultsRef.current) {
            const targetPosition = resultsRef.current.offsetTop; // Biraz üstte bırak
            smoothScroll(targetPosition, 1500); // 1.5 saniye süren scroll
          }
        }, 200);
      }, 100);
    } else if (!isLoading && cities.length === 0 && searchedWeather) {
      setShowResults(true);
      setTimeout(() => {
        setIsVisible(true);
        if (resultsRef.current) {
          const targetPosition = resultsRef.current.offsetTop;
          smoothScroll(targetPosition, 1500);
        }
      }, 100);
    } else {
      setIsVisible(false);
      setTimeout(() => {
        setShowResults(false);
      }, 800);
    }
  }, [cities]);

  if (!showResults) {
    return null;
  }

  return (
    <div 
      ref={resultsRef} 
      className={`
        min-h-screen bg-gradient-to-b from-transparent to-black/40 backdrop-blur-sm
        transition-all duration-800 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}
      `}
    >
      <div className={`
        container mx-auto px-4 py-16
        transition-all duration-800 delay-100
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}
      `}>
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
              <p className="text-white mt-4 text-lg animate-pulse">Şehirler aranıyor...</p>
            </div>
          ) : cities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-24 h-24 mb-8 relative">
                <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-sm animate-pulse"></div>
                <div className="absolute inset-2 rounded-full bg-white/20 backdrop-blur-sm animate-pulse delay-75"></div>
                <div className="absolute inset-4 rounded-full bg-white/30 backdrop-blur-sm animate-pulse delay-150"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl">🔍</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Eşleşen Şehir Bulunamadı</h3>
              <p className="text-lg text-white/80 text-center max-w-2xl">
                {searchedWeather} için{' '}
                {dateRange.startDate?.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })} -{' '}
                {dateRange.endDate?.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })} 
                {' '}tarihleri arasında uygun şehir bulunamadı. Lütfen farklı bir tarih aralığı veya hava durumu seçin.
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <h2 className={`
                  text-3xl font-bold text-white mb-4 mt-10
                  transition-all duration-800 delay-300
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}
                `}>
                  Bulunan Şehirler ({cities.length})
                </h2>
                <p className={`
                  text-lg text-white/80 mb-8
                  transition-all duration-800 delay-400
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}
                `}>
                  {searchedWeather} için{' '}
                  {dateRange.startDate?.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })} -{' '}
                  {dateRange.endDate?.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })} 
                  {' '}tarihleri arasında uygun şehirler
                </p>

                {/* Bölge Navigasyonu */}
                <div className={`
                  relative mb-12
                  transition-all duration-800 delay-500
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}
                `}>
                  <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <div className="flex items-center justify-center gap-1 flex-wrap">
                    {Object.entries(groupedCities).map(([region, cities]) => (
                      <button
                        key={region}
                        onClick={() => setSelectedRegion(region)}
                        className={`
                          px-6 py-3 text-sm font-medium rounded-full transition-all duration-300
                          ${selectedRegion === region
                            ? 'bg-white/10 text-white shadow-lg shadow-white/5 scale-105'
                            : 'text-white/60 hover:text-white hover:bg-white/5'
                          }
                        `}
                      >
                        {region}
                        <span className="ml-2 text-xs opacity-60">({cities.length})</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Seçili Bölgenin Şehirleri */}
                {selectedRegion && groupedCities[selectedRegion] && (
                  <div className={`
                    grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4
                    transition-all duration-800 delay-600
                    ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}
                  `}>
                    {groupedCities[selectedRegion].map((city) => (
                      <div
                        key={city.name}
                        className="group bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 
                                 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                      >
                        <h4 className="text-lg font-medium text-white mb-2 group-hover:text-white/90">
                          {city.name}
                        </h4>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-white/40 group-hover:bg-white/60" />
                          <p className="text-sm text-white/60 group-hover:text-white/70">
                            {city.dates.length} gün uygun
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 