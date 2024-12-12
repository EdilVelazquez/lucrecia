import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { LoginPage } from './pages/admin/LoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import { AdminProducts } from './pages/admin/AdminProducts';
import AdminCalendar from './pages/admin/AdminCalendar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <HomePage />
              </>
            }
          />
          <Route
            path="/catalog"
            element={
              <>
                <Navbar />
                <CatalogPage />
              </>
            }
          />
          <Route
            path="/track-order"
            element={
              <>
                <Navbar />
                <TrackOrderPage />
              </>
            }
          />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/calendar" element={<AdminCalendar />} />
        </Routes>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;