'use client';

import { useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import "@/styles/datepicker.css";  
import { format, addDays } from 'date-fns';
import { tr as trLocale } from 'date-fns/locale';
import { HiCalendar, HiChevronLeft, HiChevronRight } from 'react-icons/hi2';

registerLocale('tr', trLocale);

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface DateRangePickerProps {
  onSelect: (dateRange: DateRange) => void;
}

export default function DateRangePicker({ onSelect }: DateRangePickerProps) {
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: null,
    endDate: null
  });
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    
    if (start && end) {
      const maxEndDate = addDays(start, 8);
      if (end > maxEndDate) {
        const newDateRange = { startDate: start, endDate: maxEndDate };
        setDateRange(newDateRange);
        onSelect(newDateRange);
      } else {
        const newDateRange = { startDate: start, endDate: end };
        setDateRange(newDateRange);
        onSelect(newDateRange);
      }
      setTimeout(() => setIsOpen(false), 200);
    } else {
      const newDateRange = { startDate: start, endDate: null };
      setDateRange(newDateRange);
      onSelect(newDateRange);
    }
  };

  const formatDateRange = () => {
    if (!dateRange.startDate) return '';
    if (!dateRange.endDate) {
      return format(dateRange.startDate, 'dd MMM yyyy', { locale: trLocale });
    }
    return `${format(dateRange.startDate, 'dd MMM')} - ${format(dateRange.endDate, 'dd MMM yyyy')}`;
  };

  const maxSelectableDate = addDays(new Date(), 33);
  const maxEndDate = dateRange.startDate ? addDays(dateRange.startDate, 8) : maxSelectableDate;

  return (
    <div className="relative">
      <div 
        className="relative w-full cursor-pointer overflow-hidden rounded-lg border border-white/20 bg-white/10 backdrop-blur-md text-white focus:outline-none hover:border-white/40 transition-colors"
        onClick={() => setIsOpen(true)}
      >
        <div className="flex items-center px-6 py-4">
          <HiCalendar className="w-5 h-5 text-white/70 mr-2" />
          <input
            readOnly
            className="w-full bg-transparent border-none focus:outline-none focus:ring-0 placeholder-white/60 text-white cursor-pointer"
            placeholder="Tarih aralığı seçin"
            value={formatDateRange()}
            onClick={() => setIsOpen(true)}
          />
        </div>
      </div>
      {isOpen && (
        <div className="absolute right-0 z-50 mt-2">
          <style jsx global>{`
            .react-datepicker {
              @apply bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-xl !important;
              font-family: inherit;
              width: 260px;
              border-radius: 20px;
            }
            .react-datepicker__month-container {
              border-radius: 20px;
              @apply w-full !important;
            }
            .react-datepicker__header {
              @apply bg-white border-b border-gray-100 !important;
              border-radius: 20px;
              padding-right: 16px;
              padding-left: 16px;
            }
            .react-datepicker__current-month {
              @apply text-white font-semibold mb-4 !important;
            }
            .react-datepicker__day-names {
              @apply flex justify-around !important;
            }
            .react-datepicker__day-name {
              @apply text-white/40 font-medium w-9 !important;
            }
            .react-datepicker__month {
              @apply p-0 !important;
            }
            .react-datepicker__week {
              @apply flex justify-around mb-1 !important;
            }
            .react-datepicker__day {
              @apply w-9 h-9 leading-9 text-white m-0 
              hover:bg-white/10 rounded-lg transition-all duration-200
              hover:shadow-sm !important;
            }
            .react-datepicker__day--in-range {
              @apply bg-primary-blue/20 text-white 
              hover:bg-primary-blue/30 !important;
            }
            .react-datepicker__day--range-start,
            .react-datepicker__day--range-end {
              @apply bg-primary-blue text-white hover:bg-primary-blue/90 
              shadow-md hover:shadow-lg !important;
            }
            .react-datepicker__day--disabled {
              @apply text-white/20 hover:bg-transparent hover:shadow-none 
              cursor-not-allowed !important;
            }
            .react-datepicker__navigation {
              @apply top-4 !important;
            }
            .react-datepicker__navigation--previous {
              @apply left-4 !important;
            }
            .react-datepicker__navigation--next {
              @apply right-4 !important;
            }
            .react-datepicker__navigation-icon::before {
              display: none;
            }
            .react-datepicker__day--today {
              @apply font-bold text-primary-blue bg-white/10 !important;
            }
            .react-datepicker__triangle {
              display: none;
            }
          `}</style>
          <DatePicker
            selected={dateRange.startDate}
            onChange={handleChange}
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            selectsRange
            inline
            locale="tr"
            minDate={new Date()}
            maxDate={dateRange.startDate ? maxEndDate : maxSelectableDate}
            monthsShown={1}
            onClickOutside={() => setIsOpen(false)}
            showPopperArrow={false}
            calendarStartDay={1}
            renderCustomHeader={({
              date,
              decreaseMonth,
              increaseMonth,
              prevMonthButtonDisabled,
              nextMonthButtonDisabled
            }) => (
              <div className="flex items-center justify-between px-1">
                <button
                  onClick={decreaseMonth}
                  disabled={prevMonthButtonDisabled}
                  type="button"
                  className={`p-1.5 rounded-lg hover:bg-white/10 transition-all
                    ${prevMonthButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <HiChevronLeft className="w-5 h-5 text-white" />
                </button>
                <span className="text-white font-semibold">
                  {format(date, 'MMMM yyyy', { locale: trLocale })}
                </span>
                <button
                  onClick={increaseMonth}
                  disabled={nextMonthButtonDisabled}
                  type="button"
                  className={`p-1.5 rounded-lg hover:bg-white/10 transition-all
                    ${nextMonthButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <HiChevronRight className="w-5 h-5 text-white" />
                </button>
              </div>
            )}
          />
        </div>
      )}
    </div>
  );
}