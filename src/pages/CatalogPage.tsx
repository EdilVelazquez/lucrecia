import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Product } from '../types';

export function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product));
      setProducts(productsData);
    };

    fetchProducts();
  }, []);

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Nuestro Catálogo</h1>
      
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-md ${
            selectedCategory === 'all' 
              ? 'bg-pink-600 text-white' 
              : 'bg-pink-100 text-pink-600'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setSelectedCategory('bouquets')}
          className={`px-4 py-2 rounded-md ${
            selectedCategory === 'bouquets' 
              ? 'bg-pink-600 text-white' 
              : 'bg-pink-100 text-pink-600'
          }`}
        >
          Ramos
        </button>
        <button
          onClick={() => setSelectedCategory('arrangements')}
          className={`px-4 py-2 rounded-md ${
            selectedCategory === 'arrangements' 
              ? 'bg-pink-600 text-white' 
              : 'bg-pink-100 text-pink-600'
          }`}
        >
          Arreglos
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
              <p className="mt-2 text-gray-600">{product.description}</p>
              <p className="mt-4 text-xl font-bold text-pink-600">
                ${product.price.toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}