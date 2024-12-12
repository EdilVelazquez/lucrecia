import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { EmptyCatalog } from '../components/EmptyCatalog';
import type { Product } from '../types';

export function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const q = query(
        collection(db, 'products'),
        where('available', '==', true)
      );
      const querySnapshot = await getDocs(q);
      const productsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((product) => product.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <EmptyCatalog onProductsLoaded={fetchProducts} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Nuestro Catálogo
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Descubre nuestra selección de hermosos arreglos florales, ramos y flores
          individuales, cuidadosamente diseñados para cada ocasión especial.
        </p>
      </div>

      <div className="flex justify-center space-x-4 mb-12">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === 'all'
              ? 'bg-pink-600 text-white'
              : 'bg-pink-100 text-pink-600 hover:bg-pink-200'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setSelectedCategory('bouquets')}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === 'bouquets'
              ? 'bg-pink-600 text-white'
              : 'bg-pink-100 text-pink-600 hover:bg-pink-200'
          }`}
        >
          Ramos
        </button>
        <button
          onClick={() => setSelectedCategory('arrangements')}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === 'arrangements'
              ? 'bg-pink-600 text-white'
              : 'bg-pink-100 text-pink-600 hover:bg-pink-200'
          }`}
        >
          Arreglos
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
          >
            <div className="relative pb-[66.666667%]">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {product.name}
                </h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                  {product.category === 'bouquets'
                    ? 'Ramo'
                    : product.category === 'arrangements'
                    ? 'Arreglo'
                    : 'Individual'}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-pink-600">
                  ${product.price.toFixed(2)}
                </span>
                <a
                  href={`https://wa.me/+523312345678?text=Hola, me interesa el producto: ${product.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                  Ordenar por WhatsApp
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}