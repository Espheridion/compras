
export type CategoryType = 'OFICINA' | 'ASEO' | 'COCINA' | 'PAPELERIA';

export interface Branch {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  category: CategoryType;
}

export interface InventoryItem {
  productId: string;
  stock: number;
}

export interface OrderItem {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  status: 'PENDING' | 'RECEIVED';
}
