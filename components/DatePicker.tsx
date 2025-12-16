
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface DatePickerProps {
  checkIn: string;
  checkOut: string;
  onSelect: (start: string, end: string) => void;
  onClose: () => void;
}

const MONTHS = [
  'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
];

const DAYS = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

export const DatePicker: React.FC<DatePickerProps> = ({ checkIn, checkOut, onSelect, onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Parse initial dates or default to today
  useEffect(() => {
    if (checkIn) {
      setCurrentDate(new Date(checkIn));
    }
  }, []);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    // 0 = Sunday, 1 = Monday. We want Monday as 0 index for styling
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return (day === 0 ? 6 : day - 1);
  };

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const handleDateClick = (day: number) => {
    const selectedDateString = formatDate(currentDate.getFullYear(), currentDate.getMonth(), day);
    const selectedTs = new Date(selectedDateString).getTime();
    const startTs = checkIn ? new Date(checkIn).getTime() : 0;
    const endTs = checkOut ? new Date(checkOut).getTime() : 0;

    // Logic for range selection
    if (!checkIn || (checkIn && checkOut)) {
      // Start new selection
      onSelect(selectedDateString, '');
    } else if (checkIn && !checkOut) {
      // Selecting end date
      if (selectedTs < startTs) {
        // User clicked a date before the start date, so that becomes the new start
        onSelect(selectedDateString, '');
      } else {
        // Valid end date
        onSelect(checkIn, selectedDateString);
      }
    }
  };

  const changeMonth = (delta: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1);
    setCurrentDate(newDate);
  };

  const renderDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty slots for previous month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10" />);
    }

    const today = new Date();
    today.setHours(0,0,0,0);

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = formatDate(currentDate.getFullYear(), currentDate.getMonth(), d);
      const dayTs = new Date(dateStr).getTime();
      const startTs = checkIn ? new Date(checkIn).getTime() : null;
      const endTs = checkOut ? new Date(checkOut).getTime() : null;
      const todayTs = today.getTime();

      let className = "h-10 w-10 flex items-center justify-center text-sm rounded-full cursor-pointer transition-colors relative z-10 ";
      let bgRange = "";

      const isSelected = (startTs === dayTs) || (endTs === dayTs);
      const isInRange = startTs && endTs && dayTs > startTs && dayTs < endTs;
      const isDisabled = dayTs < todayTs;

      if (isDisabled) {
        className += "text-gray-300 cursor-not-allowed line-through";
      } else if (isSelected) {
        className += "bg-black text-white font-bold hover:bg-gray-800";
      } else if (isInRange) {
        className += "bg-gray-100 text-gray-800 hover:bg-gray-200";
      } else {
        className += "hover:bg-gray-100 text-gray-700 font-medium";
      }

      // Special visual handling for range connecting lines
      if (isInRange) {
         bgRange = "absolute inset-0 bg-gray-100 z-0"; // Full fill
      } else if (startTs === dayTs && endTs) {
         bgRange = "absolute top-0 bottom-0 left-1/2 right-0 bg-gray-100 z-0"; // Right half fill
      } else if (endTs === dayTs && startTs) {
         bgRange = "absolute top-0 bottom-0 left-0 right-1/2 bg-gray-100 z-0"; // Left half fill
      }

      days.push(
        <div key={d} className="relative p-0.5">
            {bgRange && <div className={bgRange}></div>}
            <button 
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!isDisabled) handleDateClick(d);
                }}
                disabled={isDisabled}
                className={className}
            >
                {d}
            </button>
        </div>
      );
    }
    return days;
  };

  return (
    <div 
        className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 w-full max-w-sm mx-auto animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-6">
        <button 
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); changeMonth(-1); }} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
            <ChevronLeft size={20} />
        </button>
        <h3 className="font-bold text-lg text-gray-800">
            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <button 
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); changeMonth(1); }} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
            <ChevronRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-2">
        {DAYS.map(d => (
            <div key={d} className="text-center text-xs font-bold text-gray-400 uppercase py-2">
                {d}
            </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {renderDays()}
      </div>

      <div className="mt-6 flex justify-end">
        <button 
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }}
            className="text-sm font-bold underline px-4 py-2 hover:bg-gray-50 rounded-lg text-gray-900"
        >
            Chiudi
        </button>
      </div>
    </div>
  );
};
