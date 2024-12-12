import React from 'react';
import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <nav className="bg-pink-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center">
            <img 
              src="/images/products/Mi proyecto.png" 
              alt="Lucrecia Florería Logo" 
              className="h-16 w-16 object-contain rounded-full shadow-lg transition-transform hover:scale-105 border-2 border-pink-200"
            />
          </Link>
          <div className="flex space-x-6">
            <Link 
              to="/catalog" 
              className="text-pink-600 hover:text-pink-800 px-4 py-2 text-lg font-medium transition-colors duration-200 hover:bg-pink-100 rounded-lg"
            >
              Catálogo
            </Link>
            <Link 
              to="/track-order" 
              className="text-pink-600 hover:text-pink-800 px-4 py-2 text-lg font-medium transition-colors duration-200 hover:bg-pink-100 rounded-lg"
            >
              Seguir Pedido
            </Link>
            <Link 
              to="/admin" 
              className="text-pink-600 hover:text-pink-800 px-4 py-2 text-lg font-medium transition-colors duration-200 hover:bg-pink-100 rounded-lg"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}