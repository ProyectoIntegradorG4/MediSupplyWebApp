export interface Product {
  sku: string;
  name: string;
  category: string;
  stock: number;
  location: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}
