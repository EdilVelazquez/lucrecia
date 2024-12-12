import React from 'react';
import { Link } from 'react-router-dom';
import { Flower2 } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="bg-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Flower2 className="h-8 w-8 text-pink-600" />
            <span className="text-2xl font-serif text-pink-600">Lucrecia</span>
          </Link>
          <div className="flex space-x-4">
            <Link to="/catalog" className="text-pink-600 hover:text-pink-800 px-3 py-2">
              Catálogo
            </Link>
            <Link to="/track-order" className="text-pink-600 hover:text-pink-800 px-3 py-2">
              Seguir Pedido
            </Link>
            <Link to="/admin" className="text-pink-600 hover:text-pink-800 px-3 py-2">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}