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
  proveedor_id: string;
  razon_social: string;
  nit: string;
  tipo_proveedor: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  pais: string;
  certificaciones: string[];
  estado: string;
  validacion_regulatoria: string;
  calificacion: number | null;
  tiempo_entrega_promedio: number | null;
  created_at: string;
  updated_at: string;
  version: number;
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

export interface ProviderPaginatedResponse {
  total: number;
  skip: number;
  limit: number;
  data: Provider[];
}
