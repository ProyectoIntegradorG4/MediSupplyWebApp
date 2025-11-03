export interface Product {
  productoId: string;
  sku: string;
  nombre: string;
  categoria: string;
  formaFarmaceutica: string;
  requierePrescripcion: string;
  registroSanitario: string;
  estado_producto: string;
  actualizado_en: string;
  fechaVencimiento: string;
  location: string;
  ubicacion: string;
  stock: string;
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

export interface PaginatedResponse<T> {
  total: number;
  items: T[];
  page: number;
  page_size: number;
}
