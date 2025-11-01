export interface Product {
  sku: string;
  name: string;
  category: string;
  stock: number;
  location: string;
}

export interface Provider {
  id: number;
  nombre: string;
  pais: string;
  rating: number;
  activo: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}
