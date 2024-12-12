import React, { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { toast } from 'react-hot-toast';
import { Calendar, Clock, ChevronDown, ChevronUp, Edit2, ArrowRight, XCircle } from 'lucide-react';
import { CancelOrderModal } from './CancelOrderModal';
import { ConfirmStatusModal } from './ConfirmStatusModal';
import type { Order } from '../../types';

interface OrderListProps {
  orders: Order[];
  onOrderUpdate: () => void;
  onEditOrder?: (order: Order) => void;
  statusFilter: string;
}

export function OrderList({ orders, onOrderUpdate, onEditOrder, statusFilter }: OrderListProps) {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
  const [statusToChange, setStatusToChange] = useState<{ order: Order; nextStatus: Order['status'] } | null>(null);

  const canChangeStatus = (order: Order, nextStatus: Order['status']) => {
    // No permitir cambios si está pendiente
    if (order.status === 'pending') {
      return false;
    }
    
    // Para otros estados, verificar la información necesaria
    if (nextStatus === 'confirmed' || nextStatus === 'completed') {
      return !!(
        order.deliveryDate &&
        order.deliveryTime &&
        order.deliveryAddress &&
        order.recipientName &&
        order.recipientPhone
      );
    }
    return true;
  };

  const initiateStatusChange = (order: Order, nextStatus: Order['status']) => {
    if (!canChangeStatus(order, nextStatus)) {
      if (order.status === 'pending') {
        toast.error('El estado "Pendiente" solo puede cambiar cuando el cliente complete el formulario');
      } else {
        toast.error('Información de entrega incompleta');
        onEditOrder?.(order);
      }
      return;
    }

    setStatusToChange({ order, nextStatus });
  };

  const handleStatusChange = async (order: Order, nextStatus: Order['status']) => {
    try {
      const orderRef = doc(db, 'orders', order.id);
      const timestamp = serverTimestamp();
      
      const updates: Partial<Order> = {
        status: nextStatus,
      };

      // Agregar el timestamp correspondiente según el estado
      switch (nextStatus) {
        case 'confirmed':
          updates.confirmedAt = timestamp;
          break;
        case 'completed':
          updates.completedAt = timestamp;
          break;
        case 'cancelled':
          updates.cancelledAt = timestamp;
          break;
      }

      await updateDoc(orderRef, updates);
      toast.success('Estado actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
      toast.error('Error al actualizar el estado');
    }
  };

  const getNextStatus = (currentStatus: Order['status']): Order['status'] | null => {
    switch (currentStatus) {
      case 'pending':
        return null; // No se puede cambiar desde el admin
      case 'in_process':
        return 'confirmed';
      case 'confirmed':
        return 'completed';
      default:
        return null;
    }
  };

  const getStatusActionButton = (currentStatus: Order['status']): string | null => {
    switch (currentStatus) {
      case 'pending':
        return null; // No mostrar botón para pedidos pendientes
      case 'in_process':
        return 'Confirmar';
      case 'confirmed':
        return 'Completar';
      default:
        return null;
    }
  };

  const getStatusText = (status: Order['status']): string => {
    switch (status) {
      case 'pending':
        return 'Pendiente de Información';
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

  const getStatusColor = (status: Order['status']): string => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-800'; // Gris para pendiente
      case 'in_process':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleOrderExpanded = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const formatFirebaseTimestamp = (timestamp: any) => {
    if (!timestamp) return null;
    // Si es un timestamp de Firestore
    if (timestamp && typeof timestamp.toDate === 'function') {
      return timestamp.toDate();
    }
    // Si ya es una fecha
    if (timestamp instanceof Date) {
      return timestamp;
    }
    // Si es un timestamp en segundos
    if (typeof timestamp === 'number') {
      return new Date(timestamp * 1000);
    }
    return null;
  };

  // Filtra las órdenes canceladas a menos que específicamente se soliciten
  const visibleOrders = orders.filter(order => 
    statusFilter === 'all' ? order.status !== 'cancelled' : true
  );

  return (
    <>
      <ul role="list" className="divide-y divide-gray-200">
        {visibleOrders.map((order) => {
          const nextStatus = getNextStatus(order.status);
          const actionButtonText = getStatusActionButton(order.status);

          // Convertir todos los timestamps
          const createdDate = formatFirebaseTimestamp(order.createdAt);
          const processedDate = formatFirebaseTimestamp(order.processedAt);
          const confirmedDate = formatFirebaseTimestamp(order.confirmedAt);
          const completedDate = formatFirebaseTimestamp(order.completedAt);
          const cancelledDate = formatFirebaseTimestamp(order.cancelledAt);
          const deliveryDate = formatFirebaseTimestamp(order.deliveryDate);

          return (
            <li key={order.id} className="py-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-50 rounded-lg">
                {/* Información principal */}
                <div className="flex-1">
                  <div className="flex items-center gap-x-3 mb-2">
                    <span className="text-lg font-medium text-gray-900">#{order.id}</span>
                    <span className={`rounded-md px-2 py-1 text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
                      <p className="text-sm text-gray-500">{order.customerWhatsapp}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {createdDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{format(createdDate, "d MMM yyyy", { locale: es })}</span>
                          <Clock className="h-4 w-4 ml-2" />
                          <span>{format(createdDate, "HH:mm", { locale: es })}</span>
                        </div>
                      )}
                      <p className="mt-1 font-medium text-gray-900">
                        ${(order.totalAmount || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex items-center gap-2">
                  {nextStatus && actionButtonText && order.status !== 'cancelled' && (
                    <button
                      onClick={() => initiateStatusChange(order, nextStatus)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-pink-600 text-white text-sm hover:bg-pink-700"
                    >
                      {actionButtonText}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                  
                  {order.status !== 'completed' && order.status !== 'cancelled' && (
                    <>
                      <button
                        onClick={() => onEditOrder?.(order)}
                        className="p-1 rounded-md text-gray-400 hover:text-gray-600"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setOrderToCancel(order)}
                        className="p-1 rounded-md text-red-400 hover:text-red-600"
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => toggleOrderExpanded(order.id)}
                    className="p-1 rounded-md text-gray-400 hover:text-gray-600"
                  >
                    {expandedOrderId === order.id ? 
                      <ChevronUp className="h-5 w-5" /> :
                      <ChevronDown className="h-5 w-5" />
                    }
                  </button>
                </div>
              </div>

              {/* Detalles expandibles */}
              {expandedOrderId === order.id && (
                <div className="mt-4 pl-4 border-l-2 border-pink-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium text-gray-900">Información del Pedido</h4>
                      <dl className="mt-2 space-y-1">
                        <div>
                          <dt className="text-gray-500">Características:</dt>
                          <dd className="whitespace-pre-wrap">{order.characteristics || 'No especificadas'}</dd>
                        </div>
                        <div className="pt-2">
                          <dt className="text-gray-500">Historial de Estados:</dt>
                          <dd className="space-y-1">
                            {createdDate && (
                              <p>Creado: {format(createdDate, "d MMM yyyy HH:mm", { locale: es })}</p>
                            )}
                            {processedDate && (
                              <p>En Proceso: {format(processedDate, "d MMM yyyy HH:mm", { locale: es })}</p>
                            )}
                            {confirmedDate && (
                              <p>Confirmado: {format(confirmedDate, "d MMM yyyy HH:mm", { locale: es })}</p>
                            )}
                            {completedDate && (
                              <p>Finalizado: {format(completedDate, "d MMM yyyy HH:mm", { locale: es })}</p>
                            )}
                            {cancelledDate && (
                              <>
                                <p>Cancelado: {format(cancelledDate, "d MMM yyyy HH:mm", { locale: es })}</p>
                                <p className="text-red-600">Motivo: {order.cancellationNote}</p>
                              </>
                            )}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    {order.status !== 'pending' && (
                      <div>
                        <h4 className="font-medium text-gray-900">Información de Entrega</h4>
                        <dl className="mt-2 space-y-1">
                          {deliveryDate && (
                            <div>
                              <dt className="text-gray-500">Fecha y Hora de Entrega:</dt>
                              <dd className="flex items-center gap-1">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                {format(deliveryDate, "d 'de' MMMM, yyyy", { locale: es })}
                                <Clock className="ml-2 h-4 w-4 text-gray-400" />
                                {order.deliveryTime}
                              </dd>
                            </div>
                          )}
                          {order.deliveryAddress && (
                            <>
                              <div>
                                <dt className="text-gray-500">Dirección:</dt>
                                <dd>{order.deliveryAddress}</dd>
                              </div>
                              <div>
                                <dt className="text-gray-500">Referencias:</dt>
                                <dd>{order.addressReferences}</dd>
                              </div>
                            </>
                          )}
                          {order.recipientName && (
                            <>
                              <div>
                                <dt className="text-gray-500">Recibe:</dt>
                                <dd>{order.recipientName}</dd>
                              </div>
                              <div>
                                <dt className="text-gray-500">Tel. Recibe:</dt>
                                <dd>{order.recipientPhone}</dd>
                              </div>
                            </>
                          )}
                          {order.cardMessage && (
                            <div>
                              <dt className="text-gray-500">Mensaje:</dt>
                              <dd>{order.cardMessage}</dd>
                            </div>
                          )}
                        </dl>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {statusToChange && (
        <ConfirmStatusModal
          isOpen={true}
          order={statusToChange.order}
          nextStatus={statusToChange.nextStatus}
          onClose={() => setStatusToChange(null)}
          onConfirm={() => {
            handleStatusChange(statusToChange.order, statusToChange.nextStatus);
            setStatusToChange(null);
          }}
        />
      )}

      {orderToCancel && (
        <CancelOrderModal
          isOpen={true}
          onClose={() => setOrderToCancel(null)}
          order={orderToCancel}
          onOrderCancelled={onOrderUpdate}
        />
      )}
    </>
  );
}