import type { Product } from '../types';

export const sampleProducts: Omit<Product, 'id'>[] = [
  {
    name: "Ramo Primaveral Deluxe",
    description: "Hermoso arreglo con rosas, gerberas y lilies en tonos rosados y blancos. Perfecto para ocasiones especiales.",
    price: 899.99,
    category: "bouquets",
    imageUrl: "/images/products/bouquet-1.jpg",
    available: true
  },
  {
    name: "Rosas Eternas",
    description: "12 rosas rojas premium en arreglo clásico. Un regalo romántico y elegante.",
    price: 699.99,
    category: "bouquets",
    imageUrl: "/images/products/bouquet-2.jpg",
    available: true
  },
  {
    name: "Jardín Silvestre",
    description: "Arreglo natural con flores silvestres y margaritas. Trae la frescura del campo a tu hogar.",
    price: 549.99,
    category: "arrangements",
    imageUrl: "/images/products/arrangement-1.jpg",
    available: true
  },
  {
    name: "Orquídeas Elegantes",
    description: "Arreglo sofisticado con orquídeas phalaenopsis en base de cerámica.",
    price: 1299.99,
    category: "arrangements",
    imageUrl: "/images/products/arrangement-2.jpg",
    available: true
  },
  {
    name: "Girasoles Radiantes",
    description: "Ramo alegre de girasoles frescos con toques de flores silvestres.",
    price: 649.99,
    category: "bouquets",
    imageUrl: "/images/products/bouquet-3.jpg",
    available: true
  },
  {
    name: "Dulce Romance",
    description: "Delicado arreglo de peonías y rosas en tonos pasteles.",
    price: 799.99,
    category: "arrangements",
    imageUrl: "/images/products/arrangement-3.jpg",
    available: true
  },
  {
    name: "Tropical Paradise",
    description: "Exótico arreglo con aves del paraíso, heliconias y follaje tropical.",
    price: 899.99,
    category: "arrangements",
    imageUrl: "/images/products/arrangement-4.jpg",
    available: true
  },
  {
    name: "Ramo Vintage",
    description: "Ramo nostálgico con rosas antiguas, lavanda y flores secas.",
    price: 749.99,
    category: "bouquets",
    imageUrl: "/images/products/bouquet-4.jpg",
    available: true
  },
  {
    name: "Serenidad Zen",
    description: "Arreglo minimalista con bambú, orquídeas blancas y piedras decorativas.",
    price: 849.99,
    category: "arrangements",
    imageUrl: "/images/products/arrangement-5.jpg",
    available: true
  },
  {
    name: "Celebración Festiva",
    description: "Vibrante ramo con lilies, crisantemos y rosas en colores vivos.",
    price: 779.99,
    category: "bouquets",
    imageUrl: "/images/products/bouquet-5.jpg",
    available: true
  }
];