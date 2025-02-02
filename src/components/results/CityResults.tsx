"use client";

import { useEffect, useRef, useState } from "react";
import CityDetailModal from "../modals/CityDetailModal";

interface City {
  name: string;
  region: string;
  dates: string[];
  weatherByDate: Record<
    string,
    {
      condition: string;
      dayTemp: number;
      nightTemp: number;
      precipitation?: number;
    }
  >;
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

export default function CityResults({
  cities,
  isLoading,
  searchedWeather,
  dateRange,
}: CityResultsProps) {
  const resultsRef = useRef<HTMLDivElement>(null);
  const [groupedCities, setGroupedCities] = useState<GroupedCities>({});
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [showResults, setShowResults] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const smoothScroll = (targetPosition: number, duration: number) => {
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    let startTime: number | null = null;

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      const ease = (t: number) => {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
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

      setShowResults(true);

      setTimeout(() => {
        setIsVisible(true);

        setTimeout(() => {
          if (resultsRef.current) {
            const targetPosition = resultsRef.current.offsetTop;
            smoothScroll(targetPosition, 1500);
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

  const handleCityClick = (city: City) => {
    setSelectedCity(city);
    setIsModalOpen(true);
  };

  if (!showResults) {
    return null;
  }

  return (
    <div
      ref={resultsRef}
      className={`
        min-h-screen bg-gradient-to-b from-sky-50 to-white dark:from-transparent dark:to-black/40
        transition-all duration-800 ease-out relative
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}
      `}
    >
      <div
        className={`
        container mx-auto px-4 py-16 relative z-10
        transition-all duration-800 delay-100
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}
      `}
      >
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-sky-600 dark:border-white"></div>
              <p className="text-sky-800 dark:text-white mt-4 text-lg animate-pulse">
                Şehirler aranıyor...
              </p>
            </div>
          ) : cities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-24 h-24 mb-8 relative">
                <div className="absolute inset-0 rounded-full bg-sky-100 dark:bg-white/10 backdrop-blur-sm animate-pulse"></div>
                <div className="absolute inset-2 rounded-full bg-sky-200 dark:bg-white/20 backdrop-blur-sm animate-pulse delay-75"></div>
                <div className="absolute inset-4 rounded-full bg-sky-300 dark:bg-white/30 backdrop-blur-sm animate-pulse delay-150"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl">🔍</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-sky-900 dark:text-white mb-4">
                Eşleşen Şehir Bulunamadı
              </h3>
              <p className="text-lg text-sky-800/90 dark:text-white/80 text-center max-w-2xl">
                {searchedWeather} için{" "}
                {dateRange.startDate?.toLocaleDateString("tr-TR", {
                  day: "numeric",
                  month: "long",
                })}{" "}
                -{" "}
                {dateRange.endDate?.toLocaleDateString("tr-TR", {
                  day: "numeric",
                  month: "long",
                })}{" "}
                tarihleri arasında uygun şehir bulunamadı. Lütfen farklı bir
                tarih aralığı veya hava durumu seçin.
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <h2
                  className={`
                  text-3xl font-bold text-sky-900 dark:text-white mb-4 mt-10
                  transition-all duration-800 delay-300
                  ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-20"
                  }
                `}
                >
                  Bulunan Şehirler ({cities.length})
                </h2>
                <p
                  className={`
                  text-lg text-sky-800/90 dark:text-white/80 mb-8
                  transition-all duration-800 delay-400
                  ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-20"
                  }
                `}
                >
                  {searchedWeather} için{" "}
                  {dateRange.startDate?.toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "long",
                  })}{" "}
                  -{" "}
                  {dateRange.endDate?.toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "long",
                  })}{" "}
                  tarihleri arasında uygun şehirler
                </p>

                {/* Bölge Navigasyonu */}
                <div
                  className={`
                  relative mb-12
                  transition-all duration-800 delay-500
                  ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-20"
                  }
                `}
                >
                  <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-sky-200 dark:via-white/20 to-transparent" />
                  <div className="flex items-center justify-center gap-1 flex-wrap">
                    {Object.entries(groupedCities).map(([region, cities]) => (
                      <button
                        key={region}
                        onClick={() => setSelectedRegion(region)}
                        className={`
                          px-6 py-3 text-sm font-medium rounded-full transition-all duration-300
                          ${
                            selectedRegion === region
                              ? "bg-sky-100 dark:bg-white/10 text-sky-800 dark:text-white shadow-lg shadow-sky-100/50 dark:shadow-white/5 scale-105"
                              : "text-sky-700/80 dark:text-white/60 hover:text-sky-800 dark:hover:text-white hover:bg-sky-50 dark:hover:bg-white/5"
                          }
                        `}
                      >
                        {region}
                        <span className="ml-2 text-xs opacity-60">
                          ({cities.length})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {selectedRegion && groupedCities[selectedRegion] && (
                  <div
                    className={`
                    grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4
                    transition-all duration-800 delay-600
                    ${
                      isVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-20"
                    }
                  `}
                  >
                    {groupedCities[selectedRegion].map((city) => (
                      <div
                        key={city.name}
                        onClick={() => handleCityClick(city)}
                        className="group bg-white dark:bg-white/5 backdrop-blur-sm rounded-xl p-4 
                                 border border-sky-100 dark:border-white/10 
                                 hover:bg-sky-50/80 dark:hover:bg-white/10 
                                 hover:border-sky-200 dark:hover:border-white/20 
                                 transition-all duration-300
                                 cursor-pointer hover:scale-105 hover:shadow-lg shadow-sm"
                      >
                        <h4 className="text-lg font-medium text-sky-900 dark:text-white mb-2 
                                     group-hover:text-sky-800 dark:group-hover:text-white/90">
                          {city.name}
                        </h4>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-sky-400 dark:bg-white/40 
                                        group-hover:bg-sky-500 dark:group-hover:bg-white/60" />
                          <p className="text-sm text-sky-700 dark:text-white/60 
                                      group-hover:text-sky-800 dark:group-hover:text-white/70">
                            {city.dates.length} gün uygun
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* City Detail Modal */}
              <CityDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                city={selectedCity}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
