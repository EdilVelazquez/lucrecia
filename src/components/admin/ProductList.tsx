import React, { useState } from 'react';
import { Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import type { Product } from '../../types';
import { EditProductModal } from './EditProductModal';

interface ProductListProps {
  products: Product[];
  onUpdateProduct: (productId: string, updates: Partial<Product>) => Promise<void>;
  onDeleteProduct: (productId: string) => Promise<void>;
}

export function ProductList({ products, onUpdateProduct, onDeleteProduct }: ProductListProps) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleToggleAvailability = async (product: Product) => {
    await onUpdateProduct(product.id, { available: !product.available });
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div
            key={product.id}
            className={`bg-white rounded-lg shadow-md overflow-hidden ${
              !product.available ? 'opacity-75' : ''
            }`}
          >
            <div className="relative">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              {!product.available && (
                <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                  <span className="text-white font-medium px-3 py-1 rounded-full bg-gray-800">
                    No disponible
                  </span>
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {product.description}
                  </p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                  {product.category === 'bouquets'
                    ? 'Ramo'
                    : product.category === 'arrangements'
                    ? 'Arreglo'
                    : 'Individual'}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-lg font-bold text-pink-600">
                  ${product.price.toFixed(2)}
                </p>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => handleToggleAvailability(product)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                  title={product.available ? 'Deshabilitar' : 'Habilitar'}
                >
                  {product.available ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
                <button
                  onClick={() => setEditingProduct(product)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                  title="Editar"
                >
                  <Pencil className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDeleteProduct(product.id)}
                  className="p-2 text-gray-400 hover:text-red-500"
                  title="Eliminar"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingProduct && (
        <EditProductModal
          isOpen={true}
          onClose={() => setEditingProduct(null)}
          product={editingProduct}
          onProductUpdated={() => {
            setEditingProduct(null);
          }}
        />
      )}
    </>
  );
}