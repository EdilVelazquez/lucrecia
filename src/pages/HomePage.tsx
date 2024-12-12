import React from 'react';
import { Hero } from '../components/Hero';
import { Heart, Truck, Clock, Phone } from 'lucide-react';

export function HomePage() {
  return (
    <div>
      <Hero />
      
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="text-center">
            <Heart className="h-8 w-8 text-pink-600 mx-auto" />
            <h3 className="mt-2 text-lg font-medium">Diseños Únicos</h3>
            <p className="mt-1 text-gray-500">Arreglos personalizados con amor</p>
          </div>
          <div className="text-center">
            <Truck className="h-8 w-8 text-pink-600 mx-auto" />
            <h3 className="mt-2 text-lg font-medium">Entrega a Domicilio</h3>
            <p className="mt-1 text-gray-500">Envíos seguros y puntuales</p>
          </div>
          <div className="text-center">
            <Clock className="h-8 w-8 text-pink-600 mx-auto" />
            <h3 className="mt-2 text-lg font-medium">Flores Frescas</h3>
            <p className="mt-1 text-gray-500">Selección diaria de las mejores flores</p>
          </div>
          <div className="text-center">
            <Phone className="h-8 w-8 text-pink-600 mx-auto" />
            <h3 className="mt-2 text-lg font-medium">Atención Personalizada</h3>
            <p className="mt-1 text-gray-500">Estamos para ayudarte</p>
          </div>
        </div>
      </div>
    </div>
  );
}