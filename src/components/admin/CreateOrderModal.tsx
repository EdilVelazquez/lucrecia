import React, { useState } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { toast } from 'react-hot-toast';
import { generateOrderId } from '../../lib/generateOrderId';
import type { Order } from '../../types';

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateOrderModal({ isOpen, onClose }: CreateOrderModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerWhatsapp: '',
    totalAmount: '',
    characteristics: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderId = generateOrderId();
      const orderData = {
        id: orderId,
        ...formData,
        totalAmount: Number(formData.totalAmount),
        status: 'pending',
        createdAt: serverTimestamp(),
      };

      // Crear el documento con el ID personalizado
      const orderRef = doc(db, 'orders', orderId);
      await setDoc(orderRef, orderData);
      
      toast.success('Pedido creado exitosamente');
      
      // Limpiar el formulario
      setFormData({
        customerName: '',
        customerWhatsapp: '',
        totalAmount: '',
        characteristics: ''
      });
      
      onClose();
    } catch (error) {
      console.error('Error al crear el pedido:', error);
      toast.error('Error al crear el pedido');
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
        <h2 className="text-lg font-semibold mb-4">Crear Nuevo Pedido</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">
              Nombre del Cliente *
            </label>
            <input
              type="text"
              id="customerName"
              name="customerName"
              required
              value={formData.customerName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="customerWhatsapp" className="block text-sm font-medium text-gray-700">
              WhatsApp *
            </label>
            <input
              type="tel"
              id="customerWhatsapp"
              name="customerWhatsapp"
              required
              value={formData.customerWhatsapp}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-700">
              Monto Total *
            </label>
            <input
              type="number"
              id="totalAmount"
              name="totalAmount"
              required
              min="0"
              step="0.01"
              value={formData.totalAmount}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="characteristics" className="block text-sm font-medium text-gray-700">
              Características del Pedido *
            </label>
            <textarea
              id="characteristics"
              name="characteristics"
              required
              rows={3}
              value={formData.characteristics}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
              placeholder="Describe las características del arreglo floral..."
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
              {isSubmitting ? 'Creando...' : 'Crear Pedido'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}