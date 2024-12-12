export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'bouquets' | 'arrangements' | 'single';
  imageUrl: string;
  available: boolean;
}

export type Order = {
  id: string;
  customerName: string;
  customerWhatsapp: string;
  totalAmount: number;
  characteristics: string;
  status: 'pending' | 'in_process' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: Date;
  processedAt?: Date;
  confirmedAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  cancellationNote?: string;
  
  // Información de entrega (se llena cuando el cliente confirma)
  deliveryDate?: Date;
  deliveryTime?: string;
  senderName?: string;
  senderPhone?: string;
  deliveryAddress?: string;
  addressReferences?: string;
  recipientName?: string;
  recipientPhone?: string;
  cardMessage?: string;
};

export interface TimeSlot {
  date: Date;
  available: boolean;
}