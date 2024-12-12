import React from 'react';
import { Calendar, Clock, CalendarDays, CalendarRange } from 'lucide-react';

type DateFilterType = 'all' | 'today' | 'thisWeek' | 'lastWeek' | 'thisMonth' | 'lastMonth';

interface DateFilterProps {
  currentFilter: DateFilterType;
  onFilterChange: (filter: DateFilterType) => void;
}

const DATE_OPTIONS: Array<{
  value: DateFilterType;
  label: string;
  icon: React.ReactNode;
  color: string;
}> = [
  {
    value: 'all',
    label: 'Todas las fechas',
    icon: <CalendarRange className="h-4 w-4" />,
    color: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
  },
  {
    value: 'today',
    label: 'Hoy',
    icon: <Clock className="h-4 w-4" />,
    color: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
  },
  {
    value: 'thisWeek',
    label: 'Esta semana',
    icon: <Calendar className="h-4 w-4" />,
    color: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100',
  },
  {
    value: 'lastWeek',
    label: 'Semana pasada',
    icon: <Calendar className="h-4 w-4" />,
    color: 'bg-purple-50 text-purple-700 hover:bg-purple-100',
  },
  {
    value: 'thisMonth',
    label: 'Este mes',
    icon: <CalendarDays className="h-4 w-4" />,
    color: 'bg-pink-50 text-pink-700 hover:bg-pink-100',
  },
  {
    value: 'lastMonth',
    label: 'Mes pasado',
    icon: <CalendarDays className="h-4 w-4" />,
    color: 'bg-rose-50 text-rose-700 hover:bg-rose-100',
  },
];

export function DateFilter({ currentFilter, onFilterChange }: DateFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {DATE_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => onFilterChange(option.value)}
          className={`
            inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
            transition-colors duration-200
            ${option.color}
            ${currentFilter === option.value ? 'ring-2 ring-offset-2 ring-pink-500' : ''}
          `}
        >
          {option.icon}
          {option.label}
          {currentFilter === option.value && (
            <span className="ml-1.5 px-2 py-0.5 rounded-full text-xs bg-white bg-opacity-20">
              Activo
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
