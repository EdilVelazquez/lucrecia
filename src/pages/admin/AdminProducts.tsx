import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { AdminLayout } from '../../components/AdminLayout';
import { ProductList } from '../../components/admin/ProductList';
import { CreateProductModal } from '../../components/admin/CreateProductModal';
import { Plus, Database } from 'lucide-react';
import type { Product } from '../../types';
import { toast } from 'react-hot-toast';
import { loadSampleProducts } from '../../utils/loadSampleProducts';

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const q = query(collection(db, 'products'));
      const querySnapshot = await getDocs(q);
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product));
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleUpdateProduct = async (productId: string, updates: Partial<Product>) => {
    try {
      await updateDoc(doc(db, 'products', productId), updates);
      await fetchProducts();
      toast.success('Producto actualizado');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Error al actualizar el producto');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        await deleteDoc(doc(db, 'products', productId));
        await fetchProducts();
        toast.success('Producto eliminado');
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Error al eliminar el producto');
      }
    }
  };

  const handleLoadSampleProducts = async () => {
    if (products.length > 0) {
      toast.error('Ya existen productos en la base de datos');
      return;
    }
    
    setLoading(true);
    await loadSampleProducts();
    await fetchProducts();
    setLoading(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Productos</h1>
          <div className="flex gap-2">
            {products.length === 0 && (
              <button
                onClick={handleLoadSampleProducts}
                className="inline-flex items-center px-4 py-2 border border-pink-600 rounded-md shadow-sm text-sm font-medium text-pink-600 bg-white hover:bg-pink-50"
              >
                <Database className="h-5 w-5 mr-2" />
                Cargar Productos de Muestra
              </button>
            )}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nuevo Producto
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <Database className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay productos</h3>
            <p className="mt-1 text-sm text-gray-500">
              Comienza agregando productos o carga los productos de muestra.
            </p>
          </div>
        ) : (
          <ProductList
            products={products}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        )}

        <CreateProductModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onProductCreated={fetchProducts}
        />
      </div>
    </AdminLayout>
  );
}