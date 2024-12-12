import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { OrderList } from '../../components/admin/OrderList';
import { DateFilter } from '../../components/admin/DateFilter';
import { StatusFilter } from '../../components/admin/StatusFilter';
import { CreateOrderModal } from '../../components/admin/CreateOrderModal';
import { AdminLayout } from '../../components/AdminLayout';
import { EditOrderModal } from '../../components/admin/EditOrderModal'; // Importar el componente EditOrderModal
import type { Order } from '../../types';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'thisWeek' | 'lastWeek' | 'thisMonth' | 'lastMonth'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | Order['status']>('active');
  const [orderToEdit, setOrderToEdit] = useState<Order | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const ordersData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          customerName: data.customerName || '',
          customerWhatsapp: data.customerWhatsapp || '',
          totalAmount: Number(data.totalAmount) || 0,
          characteristics: data.characteristics || '',
          status: data.status || 'pending',
          createdAt: data.createdAt || null,
          processedAt: data.processedAt || null,
          confirmedAt: data.confirmedAt || null,
          completedAt: data.completedAt || null,
          cancelledAt: data.cancelledAt || null,
          cancellationNote: data.cancellationNote || '',
          deliveryDate: data.deliveryDate || null,
          deliveryTime: data.deliveryTime || '',
          senderName: data.senderName || '',
          senderPhone: data.senderPhone || '',
          deliveryAddress: data.deliveryAddress || '',
          addressReferences: data.addressReferences || '',
          recipientName: data.recipientName || '',
          recipientPhone: data.recipientPhone || '',
          cardMessage: data.cardMessage || ''
        } as Order;
      });
      setOrders(ordersData);
      setLoading(false);
    }, (error) => {
      console.error("Error al obtener pedidos:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isToday = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  };

  const isThisWeek = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());
    const thisWeekEnd = new Date(thisWeekStart);
    thisWeekEnd.setDate(thisWeekEnd.getDate() + 6);
    return date >= thisWeekStart && date <= thisWeekEnd;
  };

  const isLastWeek = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastWeekStart = new Date(today);
    lastWeekStart.setDate(lastWeekStart.getDate() - lastWeekStart.getDay() - 7);
    const lastWeekEnd = new Date(lastWeekStart);
    lastWeekEnd.setDate(lastWeekEnd.getDate() + 6);
    return date >= lastWeekStart && date <= lastWeekEnd;
  };

  const isThisMonth = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thisMonthStart = new Date(today);
    thisMonthStart.setDate(1);
    const thisMonthEnd = new Date(thisMonthStart);
    thisMonthEnd.setMonth(thisMonthEnd.getMonth() + 1);
    thisMonthEnd.setDate(0);
    return date >= thisMonthStart && date <= thisMonthEnd;
  };

  const isLastMonth = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastMonthStart = new Date(today);
    lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
    lastMonthStart.setDate(1);
    const lastMonthEnd = new Date(lastMonthStart);
    lastMonthEnd.setMonth(lastMonthEnd.getMonth() + 1);
    lastMonthEnd.setDate(0);
    return date >= lastMonthStart && date <= lastMonthEnd;
  };

  // Aplicar filtros a las órdenes
  const getFilteredOrders = () => {
    return orders
      .filter(order => {
        // Primero aplicar filtro de estado
        if (statusFilter === 'active') {
          return order.status !== 'cancelled';
        }
        if (statusFilter !== 'all') {
          return order.status === statusFilter;
        }
        return true;
      })
      .filter(order => {
        // Luego aplicar filtro de fecha
        if (!dateFilter || dateFilter === 'all') return true;
        
        const orderDate = order.createdAt?.toDate();
        
        switch (dateFilter) {
          case 'today':
            return isToday(orderDate);
          case 'thisWeek':
            return isThisWeek(orderDate);
          case 'lastWeek':
            return isLastWeek(orderDate);
          case 'thisMonth':
            return isThisMonth(orderDate);
          case 'lastMonth':
            return isLastMonth(orderDate);
          default:
            return true;
        }
      });
  };

  const handleOrderUpdate = () => {
    // Las actualizaciones vienen por Firestore
  };

  const handleEditOrder = (order: Order) => {
    setOrderToEdit(order);
  };

  return (
    <AdminLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Pedidos</h1>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700"
            >
              Nuevo Pedido
            </button>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="p-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <StatusFilter value={statusFilter} onChange={setStatusFilter} />
                <DateFilter value={dateFilter} onChange={setDateFilter} />
              </div>
            </div>

            {loading ? (
              <div className="p-8 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
              </div>
            ) : (
              <OrderList
                orders={getFilteredOrders()}
                onOrderUpdate={handleOrderUpdate}
                onEditOrder={handleEditOrder}
              />
            )}
          </div>
        </div>
      </div>

      {showCreateModal && (
        <CreateOrderModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {orderToEdit && (
        <EditOrderModal
          isOpen={true}
          order={orderToEdit}
          onClose={() => setOrderToEdit(null)}
          onOrderUpdate={handleOrderUpdate}
        />
      )}
    </AdminLayout>
  );
}