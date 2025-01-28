'use client';

import { Fragment, useState, useRef, useEffect } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { HiCheck, HiChevronUpDown } from 'react-icons/hi2';

const weatherOptions = [
  {
    category: 'Hava Koşulu',
    options: [
      { id: 1, name: 'Güneşli' },
      { id: 2, name: 'Parçalı Bulutlu' },
      { id: 3, name: 'Bulutlu' },
      { id: 4, name: 'Yağmurlu' },
      { id: 5, name: 'Gök Gürültülü Yağışlı' },
      { id: 6, name: 'Hafif Yağışlı' },
      { id: 7, name: 'Karlı' },
      { id: 8, name: 'Sisli' },
      { id: 9, name: 'Rüzgarlı' },
    ]
  },
  {
    category: 'Sıcaklık',
    options: [
      { id: 10, name: 'Sıcak' },
      { id: 11, name: 'Soğuk' },
      { id: 12, name: 'Serin' },
      { id: 13, name: 'Ilık' }
    ]
  }
];


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

  // Flatten options for filtering
  const allOptions = weatherOptions.flatMap(category => category.options);

  const filteredWeather =
    query === ''
      ? allOptions
      : allOptions.filter((weather) =>
          weather.name
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
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
              className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-white/20 bg-white/10 backdrop-blur-md shadow-lg focus:outline-none weather-select-scroll"
            >
              {query !== '' && filteredWeather.length === 0 ? (
                <div className="px-4 py-3 text-sm text-white/70 text-center">
                  Sonuç bulunamadı
                </div>
              ) : (
                weatherOptions.map((category) => {
                  const filteredOptions = category.options.filter((weather) =>
                    weather.name
                      .toLowerCase()
                      .replace(/\s+/g, '')
                      .includes(query.toLowerCase().replace(/\s+/g, ''))
                  );

                  // Eğer bu kategoride filtrelenmiş sonuç yoksa, kategoriyi gösterme
                  if (filteredOptions.length === 0) return null;

                  return (
                    <div key={category.category}>
                      <div className="px-4 py-2 text-sm font-medium text-start text-white/70 bg-white/5 backdrop-blur-md">
                        {category.category}
                      </div>
                      {filteredOptions.map((weather, index) => (
                        <Fragment key={weather.id}>
                          <Combobox.Option
                            value={weather}
                            className={({ active }) =>
                              `relative cursor-default select-none py-3 pl-10 pr-4 ${
                                active ? 'bg-white/20' : ''
                              }`
                            }
                          >
                            {({ selected, active }) => (
                              <>
                                <span className={`block truncate text-white cursor-pointer ${selected ? 'font-medium' : 'font-normal'}`}>
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
                          {index < filteredOptions.length - 1 && (
                            <div className="mx-4 border-t border-white/10 cursor-pointer"></div>
                          )}
                        </Fragment>
                      ))}
                    </div>
                  );
                })
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}