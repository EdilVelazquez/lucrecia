import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { MapPin, Phone, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import type { Order } from '../../types';

interface DeliveryDetailsProps {
  order: Order;
  isExpanded: boolean;
  onToggle: () => void;
}

export function DeliveryDetails({ order, isExpanded, onToggle }: DeliveryDetailsProps) {
  const deliveryDate = order.deliveryDate?.toDate();

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {/* Cabecera siempre visible */}
      <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50" onClick={onToggle}>
        <div className="flex-1">
          <div className="flex items-center gap-x-3">
            <span className="text-lg font-medium text-gray-900">#{order.id}</span>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
              order.status === 'completed' ? 'bg-green-100 text-green-800' : 
              order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {order.status === 'completed' ? 'Entregado' : 
               order.status === 'cancelled' ? 'Cancelado' : 
               'Pendiente de Entrega'}
            </span>
          </div>
          <div className="mt-1 text-sm text-gray-500">
            {deliveryDate && (
              <div className="flex items-center gap-2">
                <span>{format(deliveryDate, "d 'de' MMMM, yyyy", { locale: es })}</span>
                <span>•</span>
                <span>{order.deliveryTime}</span>
              </div>
            )}
          </div>
        </div>
        <button className="p-1 hover:bg-gray-100 rounded-full">
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
      </div>

      {/* Detalles expandibles */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-100">
          {/* Información del Cliente */}
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-900">Cliente</h4>
            <div className="mt-2 text-sm text-gray-600">
              <p className="font-medium">{order.customerName}</p>
              <p>{order.customerWhatsapp}</p>
            </div>
          </div>

          {/* Información de Entrega */}
          <div>
            <h4 className="text-sm font-medium text-gray-900">Información de Entrega</h4>
            <div className="mt-2 space-y-2">
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p>{order.deliveryAddress}</p>
                  {order.addressReferences && (
                    <p className="text-gray-500">{order.addressReferences}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{order.recipientPhone}</span>
              </div>
              {order.cardMessage && (
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <MessageSquare className="h-4 w-4 mt-0.5" />
                  <p>{order.cardMessage}</p>
                </div>
              )}
            </div>
          </div>

          {/* Características del Pedido */}
          <div>
            <h4 className="text-sm font-medium text-gray-900">Detalles del Pedido</h4>
            <div className="mt-2 text-sm text-gray-600">
              <p>{order.characteristics}</p>
              <p className="mt-1 font-medium">Total: ${order.totalAmount?.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
