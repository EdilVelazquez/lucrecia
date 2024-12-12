import React, { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { AdminLayout } from '../../components/AdminLayout';
import { DeliveryDateFilter } from '../../components/admin/DeliveryDateFilter';
import { DeliveryDetails } from '../../components/admin/DeliveryDetails';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import type { Order } from '../../types';
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import '../../styles/fullcalendar-base.css';
import '../../styles/calendar.css';

const AdminCalendar = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<'today' | 'thisWeek' | 'thisMonth' | 'all'>('all');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const calendarRef = useRef<any>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'orders'),
      orderBy('deliveryDate', 'asc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const ordersData = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(order => 
          order.status && 
          ['confirmed', 'in_process'].includes(order.status) &&
          order.deliveryDate
        ) as Order[];
      
      setOrders(ordersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getFilteredOrders = () => {
    let filteredOrders = orders;

    // Primero aplicamos el filtro de fecha seleccionada si existe
    if (selectedDate) {
      filteredOrders = filteredOrders.filter(order => {
        const deliveryDate = order.deliveryDate?.toDate();
        return deliveryDate && isSameDay(deliveryDate, selectedDate);
      });
      return filteredOrders;
    }

    // Si no hay fecha seleccionada, aplicamos el filtro de período
    if (dateFilter === 'all') return filteredOrders;

    const now = new Date();
    let interval;

    switch (dateFilter) {
      case 'today':
        interval = { start: startOfDay(now), end: endOfDay(now) };
        break;
      case 'thisWeek':
        interval = { start: startOfWeek(now, { locale: es }), end: endOfWeek(now, { locale: es }) };
        break;
      case 'thisMonth':
        interval = { start: startOfMonth(now), end: endOfMonth(now) };
        break;
      default:
        return filteredOrders;
    }

    return filteredOrders.filter(order => {
      const deliveryDate = order.deliveryDate?.toDate();
      return deliveryDate && isWithinInterval(deliveryDate, interval);
    });
  };

  const getCalendarEvents = () => {
    return orders.map(order => {
      const deliveryTime = order.deliveryTime || 'Sin hora especificada';
      const title = [
        order.customerName || 'Sin nombre',
        deliveryTime,
        order.characteristics || 'Sin detalles'
      ].filter(Boolean).join(' - ');

      return {
        id: order.id,
        title,
        start: order.deliveryDate?.toDate(),
        end: order.deliveryDate?.toDate(),
        backgroundColor: 
          order.status === 'completed' ? '#10B981' : // verde
          order.status === 'cancelled' ? '#EF4444' : // rojo
          order.status === 'confirmed' ? '#EC4899' : // rosa
          '#F59E0B', // amarillo (in_process)
        borderColor: 'transparent',
        textColor: '#ffffff',
        extendedProps: {
          order: order
        }
      };
    });
  };

  const handleEventClick = (info: any) => {
    setExpandedOrderId(info.event.id);
    setSelectedDate(info.event.start);
    // Hacer scroll a la orden en la lista
    const orderElement = document.getElementById(`order-${info.event.id}`);
    if (orderElement) {
      orderElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDateClick = (info: any) => {
    const clickedDate = new Date(info.date);
    setSelectedDate(prevDate => 
      prevDate && isSameDay(prevDate, clickedDate) ? null : clickedDate
    );
    setDateFilter('all');
  };

  const clearFilters = () => {
    setSelectedDate(null);
    setDateFilter('all');
    setExpandedOrderId(null);
  };

  const getFilterTitle = () => {
    if (selectedDate) {
      return `Entregas para el ${format(selectedDate, "d 'de' MMMM, yyyy", { locale: es })}`;
    }
    
    switch (dateFilter) {
      case 'today':
        return 'Entregas de hoy';
      case 'thisWeek':
        return 'Entregas de esta semana';
      case 'thisMonth':
        return 'Entregas de este mes';
      default:
        return 'Todas las entregas';
    }
  };

  return (
    <AdminLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Calendario de Entregas</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calendario */}
            <div className="bg-white shadow rounded-lg p-6">
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={getCalendarEvents()}
                eventClick={handleEventClick}
                dateClick={handleDateClick}
                locale={esLocale}
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,dayGridWeek'
                }}
                buttonText={{
                  today: 'Hoy',
                  month: 'Mes',
                  week: 'Semana'
                }}
                dayMaxEvents={3}
                eventTimeFormat={{
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                }}
                height="auto"
                aspectRatio={1.5}
                dayCellClassNames={(arg) => {
                  return selectedDate && isSameDay(arg.date, selectedDate) 
                    ? 'selected-day' 
                    : '';
                }}
              />
            </div>

            {/* Lista de Entregas */}
            <div className="space-y-4">
              <div className="bg-white shadow rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">{getFilterTitle()}</h2>
                  {(selectedDate || dateFilter !== 'all') && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                    >
                      <span>Limpiar filtros</span>
                    </button>
                  )}
                </div>
                {!selectedDate && (
                  <DeliveryDateFilter value={dateFilter} onChange={setDateFilter} />
                )}
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {loading ? (
                  <div className="flex justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                  </div>
                ) : getFilteredOrders().length > 0 ? (
                  getFilteredOrders().map(order => (
                    <div key={order.id} id={`order-${order.id}`}>
                      <DeliveryDetails
                        order={order}
                        isExpanded={expandedOrderId === order.id}
                        onToggle={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                      />
                    </div>
                  ))
                ) : (
                  <div className="bg-white shadow rounded-lg p-8 text-center text-gray-500">
                    No hay entregas programadas para este período
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCalendar;