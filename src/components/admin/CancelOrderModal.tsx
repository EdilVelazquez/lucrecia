import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { toast } from 'react-hot-toast';
import type { Order } from '../../types';

interface CancelOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  onOrderCancelled: () => void;
}

export function CancelOrderModal({ isOpen, onClose, order, onOrderCancelled }: CancelOrderModalProps) {
  const [cancellationNote, setCancellationNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancellationNote.trim()) {
      toast.error('Por favor ingresa una nota de cancelación');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateDoc(doc(db, 'orders', order.id), {
        status: 'cancelled',
        cancelledAt: new Date(),
        cancellationNote: cancellationNote.trim()
      });

      toast.success('Pedido cancelado');
      onOrderCancelled();
      onClose();
      setCancellationNote('');
    } catch (error) {
      console.error('Error al cancelar el pedido:', error);
      toast.error('Error al cancelar el pedido');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-lg font-semibold mb-4">Cancelar Pedido #{order.id}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="cancellationNote" className="block text-sm font-medium text-gray-700">
              Motivo de cancelación *
            </label>
            <textarea
              id="cancellationNote"
              name="cancellationNote"
              required
              value={cancellationNote}
              onChange={(e) => setCancellationNote(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
              placeholder="Ingresa el motivo de la cancelación..."
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Cancelando...' : 'Confirmar Cancelación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
