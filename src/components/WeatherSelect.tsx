'use client';

import { Fragment, useState, useRef, useEffect } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { HiCheck, HiChevronUpDown } from 'react-icons/hi2';

const weatherOptions = [
  { id: 1, name: 'Güneşli ve Sıcak' },
  { id: 2, name: 'Ilıman' },
  { id: 3, name: 'Serin' },
  { id: 4, name: 'Yağmurlu' },
  { id: 5, name: 'Karlı' },
  { id: 6, name: 'Rüzgarlı' },
  { id: 7, name: 'Nemli' },
  { id: 8, name: 'Kuru' },
];

// Türkçe karakterleri İngilizce karakterlere çeviren fonksiyon
const turkishToLower = (str: string) => {
  return str
    .toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/i̇/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c');
};

interface WeatherSelectProps {
  onSelect: (weather: { id: number; name: string; } | null) => void;
}

export default function WeatherSelect({ onSelect }: WeatherSelectProps) {
  const [selected, setSelected] = useState<{ id: number; name: string; } | null>(null);
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredWeather =
    query === ''
      ? weatherOptions
      : weatherOptions.filter((weather) =>
          turkishToLower(weather.name)
            .includes(turkishToLower(query))
        );

  const handleSelect = (value: { id: number; name: string; } | null) => {
    setSelected(value);
    onSelect(value);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div className="relative" ref={containerRef}>
      <style jsx global>{`
        .weather-select-scroll::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .weather-select-scroll::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 100px;
        }
        .weather-select-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 100px;
        }
        .weather-select-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.4);
        }
        .weather-select-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.1);
        }
      `}</style>
      <Combobox value={selected} onChange={handleSelect} nullable>
        <div className="relative">
          <div 
            className="relative w-full cursor-pointer overflow-hidden rounded-lg border border-white/20 bg-white/10 backdrop-blur-md text-white focus:outline-none hover:border-white/40 transition-colors"
          >
            <Combobox.Input
              className="w-full border-none py-4 pl-6 pr-10 text-white bg-transparent focus:outline-none focus:ring-0 placeholder-white/60 cursor-pointer"
              displayValue={(weather: { id: number; name: string; } | null) => weather?.name ?? ''}
              onChange={(event) => {
                setQuery(event.target.value);
                !isOpen && setIsOpen(true);
              }}
              onClick={() => !isOpen && setIsOpen(true)}
              onFocus={() => !isOpen && setIsOpen(true)}
              placeholder="Hava durumu tercihi"
              autoComplete="off"
            />
            <Combobox.Button 
              onClick={() => setIsOpen(!isOpen)}
              className="absolute inset-y-0 right-0 flex items-center pr-4"
            >
              <HiChevronUpDown
                className="h-5 w-5 text-white/70 hover:text-white transition-colors"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            show={isOpen}
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options 
              className="absolute left-0 sm:left-auto sm:right-0 z-50 mt-2 w-full max-h-60 overflow-auto rounded-lg bg-white/10 backdrop-blur-md py-2 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm weather-select-scroll"
              static
            >
              {filteredWeather.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none py-3 px-4 text-white">
                  Sonuç bulunamadı.
                </div>
              ) : (
                filteredWeather.map((weather, index) => (
                  <div key={weather.id}>
                    <Combobox.Option
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-3 pl-10 pr-4 ${
                          active ? 'bg-white/20 text-white' : 'text-white'
                        } transition-colors`
                      }
                      value={weather}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? 'font-medium' : 'font-normal'
                            }`}
                          >
                            {weather.name}
                          </span>
                          {selected ? (
                            <span
                              className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                active ? 'text-white' : 'text-white'
                              }`}
                            >
                              <HiCheck className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Combobox.Option>
                    {index < filteredWeather.length - 1 && (
                      <div className="mx-4 border-t border-white/10"></div>
                    )}
                  </div>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}