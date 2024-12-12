import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import type { Product } from '../../types';

interface ProductListProps {
  products: Product[];
  onUpdateProduct: (productId: string, updates: Partial<Product>) => Promise<void>;
  onDeleteProduct: (productId: string) => Promise<void>;
}

export function ProductList({ products, onUpdateProduct, onDeleteProduct }: ProductListProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{product.description}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onUpdateProduct(product.id, { available: !product.available })}
                  className={`px-2 py-1 text-xs font-medium rounded ${
                    product.available
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {product.available ? 'Disponible' : 'No disponible'}
                </button>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-lg font-bold text-pink-600">
                ${product.price.toFixed(2)}
              </p>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => {/* Implement edit modal */}}
                className="p-2 text-gray-400 hover:text-gray-500"
              >
                <Pencil className="h-5 w-5" />
              </button>
              <button
                onClick={() => onDeleteProduct(product.id)}
                className="p-2 text-gray-400 hover:text-red-500"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}