// src/pages/admin/AdminDashboard.tsx
import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { ShoppingBag, Calendar, Package, Clock, CheckCircle, Truck, MessageSquare, DollarSign, TrendingUp } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { Order } from '../../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { es } from 'date-fns/locale';


interface DashboardStats {
  pendingOrders: number;
  confirmedOrders: number;
  readyToShip: number;
  pendingMessages: number;
  deliveriesToday: number;
  totalActive: number;
  totalRevenue: number;
  averageOrderValue: number;
  orderCompletionRate: number;
}

interface ChartData {
  date: string;
  pedidos: number;
  valor: number;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    pendingOrders: 0,
    confirmedOrders: 0,
    readyToShip: 0,
    pendingMessages: 0,
    deliveriesToday: 0,
    totalActive: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    orderCompletionRate: 0
  });
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const ordersRef = collection(db, 'orders');
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const ordersSnapshot = await getDocs(ordersRef);
      const orders = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];

      // Calcular estadísticas básicas
      const completedOrders = orders.filter(order => order.status === 'completed');
      const totalRevenue = completedOrders.reduce((sum, order) => sum + (order.total || 0), 0);
      const averageOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;
      const orderCompletionRate = (completedOrders.length / orders.length) * 100;

      const stats = {
        pendingOrders: orders.filter(order => order.status === 'pending').length,
        confirmedOrders: orders.filter(order => order.status === 'confirmed').length,
        readyToShip: orders.filter(order => 
          order.status === 'confirmed' && 
          order.deliveryDate?.toDate().getTime() <= today.getTime() + 86400000
        ).length,
        pendingMessages: orders.filter(order => !order.cardMessage).length,
        deliveriesToday: orders.filter(order => {
          const deliveryDate = order.deliveryDate?.toDate();
          return deliveryDate && 
                 deliveryDate.getDate() === today.getDate() &&
                 deliveryDate.getMonth() === today.getMonth() &&
                 deliveryDate.getFullYear() === today.getFullYear();
        }).length,
        totalActive: orders.filter(order => 
          order.status !== 'completed' && order.status !== 'cancelled'
        ).length,
        totalRevenue,
        averageOrderValue,
        orderCompletionRate
      };

      setStats(stats);

      // Preparar datos para la gráfica
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(today, i);
        const start = startOfDay(date);
        const end = endOfDay(date);
        
        const dayOrders = orders.filter(order => {
          const orderDate = order.createdAt?.toDate();
          return orderDate && orderDate >= start && orderDate <= end;
        });

        const dayRevenue = dayOrders.reduce((sum, order) => sum + (order.total || 0), 0);

        return {
          date: format(date, 'dd/MM', { locale: es }),
          pedidos: dayOrders.length,
          valor: dayRevenue
        };
      }).reverse();

      setChartData(last7Days);
    };

    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        
        {/* KPIs principales */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Pedidos Pendientes */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="bg-pink-100 rounded-md p-3">
                    <Clock className="h-6 w-6 text-pink-600" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Pedidos Pendientes
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">{stats.pendingOrders}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Ingresos Totales */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="bg-green-100 rounded-md p-3">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Ingresos Totales
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      ${stats.totalRevenue.toLocaleString('es-MX')}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Valor Promedio por Pedido */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="bg-blue-100 rounded-md p-3">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Valor Promedio por Pedido
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      ${stats.averageOrderValue.toLocaleString('es-MX', { maximumFractionDigits: 2 })}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Tasa de Finalización */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="bg-purple-100 rounded-md p-3">
                    <CheckCircle className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Tasa de Finalización
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {stats.orderCompletionRate.toFixed(1)}%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Resto de los KPIs existentes */}
          {/* ... */}
        </div>

        {/* Gráfica de tendencias */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tendencias de Pedidos</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="pedidos"
                  stroke="#8884d8"
                  name="Número de Pedidos"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="valor"
                  stroke="#82ca9d"
                  name="Valor Total ($)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}