import React from 'react';

export function Hero() {
  const handleCatalogClick = () => {
    // Navigate to catalog page 
    // You can replace this with your preferred navigation method
    window.location.href = '/catalog';
  };

  return (
    <section className="relative h-[600px]">
      {/* Background Image and Gradient Overlay */}
      <div className="absolute inset-0">
        <img
          src="/images/products/Fondogeneral.jpg"
          alt="Flores hermosas"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/60 to-purple-500/60 backdrop-blur-[2px]" />
      </div>

      {/* Content Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div 
            className="
              bg-white/95 p-4 rounded-full shadow-2xl 
              transform transition-all duration-300 
              hover:scale-105 hover:shadow-pink-300/50 
              backdrop-blur-md border-2 border-pink-100
            "
          >
            <img
              src="/images/products/Logo.png"
              alt="Lucrecia Florería"
              className="h-28 w-28 object-contain rounded-full"
            />
          </div>
        </div>

        {/* Tagline */}
        <p 
          className="
            text-2xl text-white max-w-2xl text-center mx-auto 
            font-medium leading-relaxed 
            drop-shadow-[6_7px_10px_rgba(0,0,0,0.9)]
          "
        >
          Creamos arreglos florales únicos que transmiten emociones y belleza. 
          Cada flor es seleccionada con amor para crear momentos inolvidables.
        </p>

        {/* Call to Action */}
        <div className="mt-10 text-center">
          <button
            onClick={handleCatalogClick}
            className="
              inline-block bg-white/95 px-8 py-3 
              border-2 border-white text-lg font-medium 
              rounded-full text-pink-600 
              hover:bg-white hover:scale-105 
              transition-all duration-300 
              shadow-lg hover:shadow-pink-300/50
            "
          >
            Ver Catálogo
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;