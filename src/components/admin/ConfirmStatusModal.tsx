import React from 'react';
import type { Order } from '../../types';

interface ConfirmStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  order: Order;
  nextStatus: Order['status'];
}

export function ConfirmStatusModal({ isOpen, onClose, onConfirm, order, nextStatus }: ConfirmStatusModalProps) {
  if (!isOpen) return null;

  const getStatusText = (status: Order['status']): string => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'in_process':
        return 'En Proceso';
      case 'confirmed':
        return 'Confirmado';
      case 'completed':
        return 'Completado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-lg font-semibold mb-4">Confirmar Cambio de Estado</h2>
        <p className="text-gray-600 mb-4">
          ¿Estás seguro de que deseas cambiar el estado del pedido #{order.id} de{' '}
          <span className="font-medium">{getStatusText(order.status)}</span> a{' '}
          <span className="font-medium">{getStatusText(nextStatus)}</span>?
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="rounded-md border border-transparent bg-pink-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
          >
            Confirmar Cambio
          </button>
        </div>
      </div>
    </div>
  );
}
