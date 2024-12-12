import React from 'react';
import { Calendar, Clock, Calendar as CalendarIcon } from 'lucide-react';

type DateFilterType = 'today' | 'thisWeek' | 'thisMonth' | 'all';

interface DeliveryDateFilterProps {
  value: DateFilterType;
  onChange: (value: DateFilterType) => void;
}

export function DeliveryDateFilter({ value, onChange }: DeliveryDateFilterProps) {
  const filters: { value: DateFilterType; label: string; icon: React.ReactNode }[] = [
    { value: 'today', label: 'Hoy', icon: <Clock className="h-4 w-4" /> },
    { value: 'thisWeek', label: 'Esta Semana', icon: <Calendar className="h-4 w-4" /> },
    { value: 'thisMonth', label: 'Esta Quincena', icon: <CalendarIcon className="h-4 w-4" /> },
    { value: 'all', label: 'Todas', icon: <CalendarIcon className="h-4 w-4" /> },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onChange(filter.value)}
          className={`
            inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
            transition-colors duration-200
            ${
              value === filter.value
                ? 'bg-pink-100 text-pink-800 ring-1 ring-pink-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
        >
          {filter.icon}
          {filter.label}
        </button>
      ))}
    </div>
  );
}
