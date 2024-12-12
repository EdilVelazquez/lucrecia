import { collection, addDoc, getDocs, query } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { sampleProducts } from '../data/sampleProducts';
import { toast } from 'react-hot-toast';

export async function loadSampleProducts() {
  try {
    // Primero verificar si ya hay productos
    const querySnapshot = await getDocs(query(collection(db, 'products')));
    if (!querySnapshot.empty) {
      toast.error('Ya existen productos en la base de datos');
      return;
    }

    // Cargar los productos de muestra
    const productsCollection = collection(db, 'products');
    const loadingPromises = sampleProducts.map(product => 
      addDoc(productsCollection, product)
    );

    await Promise.all(loadingPromises);
    toast.success('Productos de muestra cargados exitosamente');
  } catch (error) {
    console.error('Error al cargar productos:', error);
    toast.error('Error al cargar los productos de muestra');
  }
}