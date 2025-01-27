'use client';

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { HiX, HiOutlineLocationMarker, HiOutlineSun, HiOutlineCalendar, HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import dynamic from 'next/dynamic';
import PlacesList from './city-detail/PlacesList';
import WeatherInfo from './city-detail/WeatherInfo';

const MapComponent = dynamic(() => import('@/components/map/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] bg-white/5 animate-pulse rounded-lg flex items-center justify-center">
      <span className="text-white/50">Harita yükleniyor...</span>
    </div>
  )
});

interface Place {
  name: string;
  categories: string[];
  location: {
    address?: string;
    city?: string;
    country?: string;
    latitude: number;
    longitude: number;
  };
  rating?: number;
  photos?: string[];
  description?: string;
}

interface CityDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  city: {
    name: string;
    region: string;
    dates: string[];
    weatherByDate: Record<string, {
      condition: string;
      dayTemp: number;
      nightTemp: number;
      precipitation?: number;
    }>;
  } | null;
}

export default function CityDetailModal({ isOpen, onClose, city }: CityDetailModalProps) {
  const [currentDateIndex, setCurrentDateIndex] = useState(0);
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlaces = async () => {
      if (city) {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/places?city=${city.name.toLowerCase()}`);
          const data = await response.json();
          if (data.success) {
            setPlaces(data.data.places);
          }
        } catch (error) {
          console.error('Mekanlar yüklenirken hata oluştu:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchPlaces();
  }, [city]);

  if (!city) return null;

  const currentDate = city.dates[currentDateIndex];
  const currentWeather = city.weatherByDate[currentDate];

  const handlePrevDate = () => {
    setCurrentDateIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNextDate = () => {
    setCurrentDateIndex((prev) => (prev < city.dates.length - 1 ? prev + 1 : prev));
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white/10 backdrop-blur-md p-6 shadow-xl transition-all border border-white/20">
                <div className="relative">
                  {/* Close Button */}
                  <button
                    onClick={onClose}
                    className="absolute right-0 top-0 p-2 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <HiX className="w-6 h-6 text-white" />
                  </button>

                  {/* Title */}
                  <Dialog.Title className="text-2xl font-bold text-white mb-6">
                    {city.name}
                  </Dialog.Title>

                  {/* Content */}
                  <div className="space-y-6">
                    {/* Location */}
                    <div className="flex items-center gap-2 text-white/80">
                      <HiOutlineLocationMarker className="w-5 h-5" />
                      <span>{city.region} Bölgesi</span>
                    </div>

                    {/* Weather */}
                    {currentWeather && (
                      <WeatherInfo
                        currentWeather={currentWeather}
                        currentDate={currentDate}
                        currentDateIndex={currentDateIndex}
                        totalDates={city.dates.length}
                        onPrevDate={handlePrevDate}
                        onNextDate={handleNextDate}
                      />
                    )}

                    {/* Places */}
                    <PlacesList 
                      isLoading={isLoading}
                      places={places}
                      cityName={city.name}
                    />

                    {/* Map */}
                    <div className="bg-white/5 rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-2 text-white">
                        <HiOutlineLocationMarker className="w-5 h-5" />
                        <span className="font-medium">Konum</span>
                      </div>
                      <div className="w-full h-[300px] rounded-lg overflow-hidden">
                        <MapComponent 
                          city={city.name}
                          places={places}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}