import React from 'react';
import { CheckCircle2, Clock, XCircle, AlertCircle, Loader2, Filter } from 'lucide-react';
import type { Order } from '../../types';

type OrderStatus = Order['status'] | 'all' | 'active';

interface StatusFilterProps {
  currentStatus: OrderStatus;
  onStatusChange: (status: OrderStatus) => void;
}

const STATUS_OPTIONS: Array<{
  value: OrderStatus;
  label: string;
  icon: React.ReactNode;
  color: string;
}> = [
  {
    value: 'active',
    label: 'Pedidos Activos',
    icon: <Filter className="h-4 w-4" />,
    color: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
  },
  {
    value: 'pending',
    label: 'Pendientes',
    icon: <Clock className="h-4 w-4" />,
    color: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100',
  },
  {
    value: 'in_process',
    label: 'En Proceso',
    icon: <Loader2 className="h-4 w-4" />,
    color: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
  },
  {
    value: 'confirmed',
    label: 'Confirmados',
    icon: <AlertCircle className="h-4 w-4" />,
    color: 'bg-purple-50 text-purple-700 hover:bg-purple-100',
  },
  {
    value: 'completed',
    label: 'Finalizados',
    icon: <CheckCircle2 className="h-4 w-4" />,
    color: 'bg-green-50 text-green-700 hover:bg-green-100',
  },
  {
    value: 'cancelled',
    label: 'Cancelados',
    icon: <XCircle className="h-4 w-4" />,
    color: 'bg-red-50 text-red-700 hover:bg-red-100',
  },
  {
    value: 'all',
    label: 'Todos los estados',
    icon: <Filter className="h-4 w-4" />,
    color: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
  },
];

export function StatusFilter({ currentStatus, onStatusChange }: StatusFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {STATUS_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => onStatusChange(option.value)}
          className={`
            inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
            transition-colors duration-200
            ${option.color}
            ${currentStatus === option.value ? 'ring-2 ring-offset-2 ring-pink-500' : ''}
          `}
        >
          {option.icon}
          {option.label}
          {currentStatus === option.value && (
            <span className="ml-1.5 px-2 py-0.5 rounded-full text-xs bg-white bg-opacity-20">
              Activo
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
