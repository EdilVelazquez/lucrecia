import React from 'react';
import { Database } from 'lucide-react';
import { loadSampleProducts } from '../utils/loadSampleProducts';

interface EmptyCatalogProps {
  onProductsLoaded: () => void;
}

export function EmptyCatalog({ onProductsLoaded }: EmptyCatalogProps) {
  const handleLoadSampleProducts = async () => {
    await loadSampleProducts();
    onProductsLoaded();
  };

  return (
    <div className="text-center py-16">
      <Database className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-lg font-medium text-gray-900">
        No hay productos en el catálogo
      </h3>
      <p className="mt-1 text-gray-500">
        Inicia el catálogo con algunos productos de muestra.
      </p>
      <div className="mt-6">
        <button
          onClick={handleLoadSampleProducts}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
        >
          <Database className="h-5 w-5 mr-2" />
          Cargar Productos de Muestra
        </button>
      </div>
    </div>
  );
}