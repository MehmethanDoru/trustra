import { HiOutlineSun, HiChevronLeft, HiChevronRight } from 'react-icons/hi';

interface WeatherInfoProps {
  currentWeather: {
    condition: string;
    dayTemp: number;
    nightTemp: number;
    precipitation?: number;
  };
  currentDate: string;
  currentDateIndex: number;
  totalDates: number;
  onPrevDate: () => void;
  onNextDate: () => void;
}

export default function WeatherInfo({
  currentWeather,
  currentDate,
  currentDateIndex,
  totalDates,
  onPrevDate,
  onNextDate
}: WeatherInfoProps) {
  return (
    <div className="bg-white/5 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <HiOutlineSun className="w-5 h-5" />
          <span className="font-medium">Hava Durumu</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevDate}
            disabled={currentDateIndex === 0}
            className="p-1 rounded-full hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <HiChevronLeft className="w-5 h-5 text-white" />
          </button>
          <span className="text-sm text-white/80">
            {new Date(currentDate).toLocaleDateString('tr-TR', {
              day: 'numeric',
              month: 'long'
            })}
          </span>
          <button
            onClick={onNextDate}
            disabled={currentDateIndex === totalDates - 1}
            className="p-1 rounded-full hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <HiChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 text-white/80">
        <div>
          <p className="text-sm">Durum</p>
          <p className="font-medium text-white">{currentWeather.condition}</p>
        </div>
        <div>
          <p className="text-sm">Sıcaklık (Gündüz/Gece)</p>
          <p className="font-medium text-white">
            {currentWeather.dayTemp}°C / {currentWeather.nightTemp}°C
          </p>
        </div>
        {currentWeather.precipitation && (
          <div>
            <p className="text-sm">Yağış Olasılığı</p>
            <p className="font-medium text-white">{currentWeather.precipitation}</p>
          </div>
        )}
      </div>
    </div>
  );
} 