import React, { useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { toast } from 'react-hot-toast';
import { format, parse } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Order } from '../types';

export function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    senderName: '',
    senderPhone: '',
    deliveryAddress: '',
    addressReferences: '',
    recipientName: '',
    recipientPhone: '',
    cardMessage: '',
    deliveryDate: format(new Date(), 'yyyy-MM-dd'),
    deliveryTime: '11:00'
  });

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId.length !== 8) {
      toast.error('El código debe tener 8 caracteres');
      return;
    }
    setLoading(true);

    try {
      const orderDoc = await getDoc(doc(db, 'orders', orderId));
      if (orderDoc.exists()) {
        const orderData = orderDoc.data();
        const orderWithId = {
          id: orderDoc.id,
          ...orderData,
          createdAt: orderData.createdAt.toDate(),
          confirmedAt: orderData.confirmedAt?.toDate(),
          deliveryDate: orderData.deliveryDate?.toDate() || new Date()
        } as Order;
        
        setOrder(orderWithId);
        
        if (orderData.senderName) {
          setFormData({
            senderName: orderData.senderName || '',
            senderPhone: orderData.senderPhone || '',
            deliveryAddress: orderData.deliveryAddress || '',
            addressReferences: orderData.addressReferences || '',
            recipientName: orderData.recipientName || '',
            recipientPhone: orderData.recipientPhone || '',
            cardMessage: orderData.cardMessage || '',
            deliveryDate: orderData.deliveryDate ? format(orderData.deliveryDate.toDate(), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
            deliveryTime: orderData.deliveryTime || '11:00'
          });
        }
      } else {
        toast.error('Pedido no encontrado');
        setOrder(null);
      }
    } catch (error) {
      console.error('Error al buscar el pedido:', error);
      toast.error('Error al buscar el pedido');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    setLoading(true);
    try {
      const deliveryDate = parse(formData.deliveryDate, 'yyyy-MM-dd', new Date());
      
      const updateData = {
        ...formData,
        deliveryDate,
        status: 'confirmed' as const,
        confirmedAt: new Date()
      };

      await updateDoc(doc(db, 'orders', order.id), updateData);
      
      toast.success('¡Información guardada y pedido confirmado! Ya no se podrán realizar más cambios.');
      
      // Refresh order data
      const orderDoc = await getDoc(doc(db, 'orders', order.id));
      const newOrderData = orderDoc.data();
      setOrder({
        id: orderDoc.id,
        ...newOrderData,
        createdAt: newOrderData?.createdAt.toDate(),
        confirmedAt: newOrderData?.confirmedAt?.toDate(),
        deliveryDate: newOrderData?.deliveryDate.toDate()
      } as Order);
    } catch (error) {
      console.error('Error al actualizar:', error);
      toast.error('Error al actualizar la información');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatDeliveryDateTime = (date: Date, time: string) => {
    try {
      return `${format(date, "d 'de' MMMM, yyyy", { locale: es })} a las ${time}`;
    } catch (error) {
      console.error('Error formateando fecha:', error);
      return 'Fecha no disponible';
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Seguimiento de Pedido</h1>

      <form onSubmit={handleTrackOrder} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value.toUpperCase())}
            placeholder="Ingresa tu código de pedido (8 caracteres)"
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
            maxLength={8}
            minLength={8}
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:opacity-50"
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
      </form>

      {order && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Detalles del Pedido</h2>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-lg font-medium">Estado: {
                order.status === 'pending' ? 'Pendiente' :
                order.status === 'confirmed' ? 'En Proceso' :
                order.status === 'completed' ? 'Completado' : 'Cancelado'
              }</p>
              <p className="text-sm text-gray-500">Pedido #{order.id}</p>
            </div>
            <p className="text-sm text-gray-600">Total: ${order.totalAmount.toFixed(2)}</p>
          </div>

          {order.status === 'pending' ? (
            <>
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-medium text-pink-600 mb-4">
                  Por favor llena la información solicitada✍️
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  ⚠️ Importante: Una vez que guardes la información, el pedido pasará a estado "En proceso" 
                  y no se podrán realizar más cambios.
                </p>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nombre de quién envia❤️ (nombre o anonimo)
                    </label>
                    <input
                      type="text"
                      name="senderName"
                      value={formData.senderName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tel. de quién envia📱
                    </label>
                    <input
                      type="tel"
                      name="senderPhone"
                      value={formData.senderPhone}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Direccion De entrega 🏠 (calle, número y colonia)
                    </label>
                    <input
                      type="text"
                      name="deliveryAddress"
                      value={formData.deliveryAddress}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Referencias del domicilio y cruces 🏘️
                    </label>
                    <textarea
                      name="addressReferences"
                      value={formData.addressReferences}
                      onChange={handleInputChange}
                      rows={2}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nombre de quién recibe😍 (nombre y apellido)
                    </label>
                    <input
                      type="text"
                      name="recipientName"
                      value={formData.recipientName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tel. De quien recibe📱
                    </label>
                    <input
                      type="tel"
                      name="recipientPhone"
                      value={formData.recipientPhone}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Mensaje que lleva tarjeta/ramo🖊️❤️
                    </label>
                    <textarea
                      name="cardMessage"
                      value={formData.cardMessage}
                      onChange={handleInputChange}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Día de entrega 📅
                      </label>
                      <input
                        type="date"
                        name="deliveryDate"
                        value={formData.deliveryDate}
                        onChange={handleInputChange}
                        min={format(new Date(), 'yyyy-MM-dd')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Hora de entrega ⏰ (11:00 AM - 10:00 PM)
                      </label>
                      <select
                        name="deliveryTime"
                        value={formData.deliveryTime}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                        required
                      >
                        <option value="11:00">11:00</option>
                        <option value="12:00">12:00</option>
                        <option value="13:00">1:00 PM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="16:00">4:00 PM</option>
                        <option value="17:00">5:00 PM</option>
                        <option value="18:00">6:00 PM</option>
                        <option value="19:00">7:00 PM</option>
                        <option value="20:00">8:00 PM</option>
                        <option value="21:00">9:00 PM</option>
                        <option value="22:00">10:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:opacity-50"
                    >
                      {loading ? 'Guardando...' : 'Guardar Información'}
                    </button>
                  </div>
                </form>
              </div>
              <div className="mt-6 text-sm text-gray-500">
                <p>Gracias por su preferencia.</p>
                <p>🌹LUCRECIA FLORERIA 🌹</p>
                <p>
                  <a 
                    href="https://www.instagram.com/lucrecia_floreriagdl/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-pink-600 hover:text-pink-700 hover:underline"
                  >
                    Términos y Condiciones en Instagram @lucrecia_floreriagdl
                  </a>
                </p>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      {order.status === 'confirmed' ? 
                        'Este pedido está en proceso. La información ya no puede ser modificada.' :
                        order.status === 'completed' ?
                        'Este pedido ha sido completado.' :
                        'Este pedido ha sido cancelado.'
                      }
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Enviado por: {order.senderName}</p>
                <p className="text-sm text-gray-600">Teléfono del remitente: {order.senderPhone}</p>
                <p className="text-sm text-gray-600">Dirección de entrega: {order.deliveryAddress}</p>
                <p className="text-sm text-gray-600">Referencias: {order.addressReferences}</p>
                <p className="text-sm text-gray-600">Recibe: {order.recipientName}</p>
                <p className="text-sm text-gray-600">Teléfono del destinatario: {order.recipientPhone}</p>
                <p className="text-sm text-gray-600">Mensaje: {order.cardMessage}</p>
                <p className="text-sm text-gray-600">
                  Entrega: {formatDeliveryDateTime(order.deliveryDate, order.deliveryTime)}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}