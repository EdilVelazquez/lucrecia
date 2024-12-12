import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { toast } from 'react-hot-toast';
import type { Order } from '../../types';
import { format } from 'date-fns';

interface EditOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  onOrderUpdate?: () => void;
}

export function EditOrderModal({ isOpen, onClose, order }: EditOrderModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    deliveryDate: order.deliveryDate ? format(order.deliveryDate.toDate(), 'yyyy-MM-dd') : '',
    deliveryTime: order.deliveryTime || '',
    deliveryAddress: order.deliveryAddress || '',
    addressReferences: order.addressReferences || '',
    recipientName: order.recipientName || '',
    recipientPhone: order.recipientPhone || '',
    cardMessage: order.cardMessage || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderRef = doc(db, 'orders', order.id);
      
      // Convertir la fecha a timestamp si existe
      const deliveryDate = formData.deliveryDate ? new Date(formData.deliveryDate) : null;

      await updateDoc(orderRef, {
        ...formData,
        deliveryDate,
      });

      toast.success('Pedido actualizado exitosamente');
      onClose();
    } catch (error) {
      console.error('Error al actualizar el pedido:', error);
      toast.error('Error al actualizar el pedido');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-lg font-semibold mb-4">Editar Información de Entrega</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-700">
                Fecha de Entrega *
              </label>
              <input
                type="date"
                id="deliveryDate"
                name="deliveryDate"
                required
                value={formData.deliveryDate}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="deliveryTime" className="block text-sm font-medium text-gray-700">
                Hora de Entrega *
              </label>
              <input
                type="time"
                id="deliveryTime"
                name="deliveryTime"
                required
                value={formData.deliveryTime}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700">
              Dirección de Entrega *
            </label>
            <input
              type="text"
              id="deliveryAddress"
              name="deliveryAddress"
              required
              value={formData.deliveryAddress}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="addressReferences" className="block text-sm font-medium text-gray-700">
              Referencias
            </label>
            <input
              type="text"
              id="addressReferences"
              name="addressReferences"
              value={formData.addressReferences}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
              placeholder="Entre calles, color de casa, puntos de referencia..."
            />
          </div>

          <div>
            <label htmlFor="recipientName" className="block text-sm font-medium text-gray-700">
              Nombre de quien recibe *
            </label>
            <input
              type="text"
              id="recipientName"
              name="recipientName"
              required
              value={formData.recipientName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="recipientPhone" className="block text-sm font-medium text-gray-700">
              Teléfono de quien recibe *
            </label>
            <input
              type="tel"
              id="recipientPhone"
              name="recipientPhone"
              required
              value={formData.recipientPhone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="cardMessage" className="block text-sm font-medium text-gray-700">
              Mensaje para la tarjeta
            </label>
            <textarea
              id="cardMessage"
              name="cardMessage"
              rows={3}
              value={formData.cardMessage}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
              placeholder="Escribe el mensaje que irá en la tarjeta..."
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
              className="rounded-md border border-transparent bg-pink-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
