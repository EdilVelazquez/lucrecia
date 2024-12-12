import React from 'react';
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <div className="relative h-[600px]">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1508182314998-3bd49473002f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
          alt="Flores hermosas"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/70 to-purple-500/70" />
      </div>
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Lucrecia Florería
        </h1>
        <p className="mt-6 text-xl text-white max-w-3xl">
          Creamos arreglos florales únicos que transmiten emociones y belleza. 
          Cada flor es seleccionada con amor para crear momentos inolvidables.
        </p>
        <div className="mt-10">
          <Link
            to="/catalog"
            className="inline-block bg-white px-8 py-3 border border-transparent text-base font-medium rounded-md text-pink-600 hover:bg-pink-50"
          >
            Ver Catálogo
          </Link>
        </div>
      </div>
    </div>
  );
}