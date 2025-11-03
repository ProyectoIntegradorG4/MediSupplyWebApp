export interface Product {
  productoId: string;
  sku: string;
  nombre: string;
  descripcion: string;
  categoriaId: string;
  subcategoria: string;
  laboratorio: string;
  principioActivo: string;
  concentracion: string;
  formaFarmaceutica: string;
  registroSanitario: string;
  requierePrescripcion: boolean;
  codigoBarras: string;
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
