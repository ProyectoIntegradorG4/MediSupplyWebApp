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

export interface User {
  id: number;
  nombre: string;
  pais: string;
  metaDeVentas: number;
  rendimiento: string;
}

export interface SalesPlan {
  planId: string;
  nombre: string;
  periodo: {
    desde: string;
    hasta: string;
  };
  estado: string;
  territorios_count: number;
  metas_count: number;
  actualizado_en: string;
}

export interface UsersPaginatedResponse {
  total: number;
  items: User[];
  page: number;
  page_size: number;
}

export interface SalesPlansPaginatedResponse {
  total: number;
  items: SalesPlan[];
  page: number;
  page_size: number;
}

export interface Salesman {
  vendedorId: string;
  nombres: string;
  apellidos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  email: string;
  pais: string;
  territorio: string | null;
  territorioId: string;
  estado: string;
  actualizado_en: string;
}

export interface CreateSalesmanRequest {
  nombres: string;
  apellidos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  email: string;
  telefono: string;
  pais: string;
  territorioId: string;
}

export interface SalesmanPaginatedResponse {
  total: number;
  items: Salesman[];
  page: number;
  page_size: number;
}

// Dashboard Reportes Vendedores
export interface Periodo {
  desde: string;
  hasta: string;
}

export interface KPI {
  label: string;
  valor: number;
  unidad: string;
  tendencia: 'up' | 'down' | 'neutral';
  variacion: number | null;
}

export interface ChartDataset {
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string | string[];
  borderWidth?: number;
  tension?: number;
  fill?: boolean;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface TopVendedor {
  vendedorId: string;
  nombre: string;
  ventas_valor: number;
  ventas_unidades: number;
  pedidos: number;
  cumplimiento_unidades: number | null;
  cumplimiento_valor: number | null;
  posicion: number;
}

export interface DashboardReportResponse {
  periodo: Periodo;
  kpis: KPI[];
  grafico_tendencia: ChartData;
  grafico_vendedores: ChartData;
  grafico_cumplimiento: ChartData;
  top_vendedores: TopVendedor[];
  alertas: string[];
}

// Reportes - KPI Vendedor
export interface TendenciaPoint {
  fecha: string;
  valor: number;
  unidades: number;
  pedidos: number;
}

export interface SellerKPIResponse {
  periodo: Periodo;
  vendedor: {
    id: string;
    nombre: string;
  };
  ventas_valor: number;
  ventas_unidades: number;
  pedidos: number;
  cumplimiento_unidades: number | null;
  cumplimiento_valor: number | null;
  meta_unidades: number | null;
  meta_valor: number | null;
  tendencia: TendenciaPoint[];
}

// Reportes - Reporte Regional
export interface RegionSummary {
  ventas_valor: number;
  ventas_unidades: number;
  pedidos: number;
  cumplimiento_unidades: number | null;
  cumplimiento_valor: number | null;
  meta_unidades: number | null;
  meta_valor: number | null;
}

export interface RegionRanking {
  vendedorId: string;
  nombre: string;
  ventas_valor: number;
  ventas_unidades: number;
  pedidos: number;
  cumplimiento_unidades: number | null;
  cumplimiento_valor: number | null;
  posicion: number;
}

export interface RegionReportResponse {
  periodo: Periodo;
  territorio: {
    id: string;
    nombre: string;
  };
  resumen: RegionSummary;
  ranking: RegionRanking[];
  tendencia: TendenciaPoint[];
}

// Reportes - Resumen Rápido KPI
export interface KPISummaryResponse {
  vendedor_id: number;
  periodo: Periodo;
  ventas_valor: number;
  ventas_unidades: number;
  pedidos: number;
  cumplimiento_porcentaje: number | null;
}
 
export interface Delivery {
  ruta_id: string;
  vehiculo_id: string;
  estado: string;
  total_pedidos: number;
  distancia_total_km: number;
  duracion_total_minutos: number;
  fecha_creacion: string;
  creado_por: number;
}

export interface DeliveryPaginatedResponse {
  total: number;
  rutas: Delivery[];
  filtros_aplicados: {
    estado: string | null;
    vehiculo_id: string | null;
    fecha_desde: string | null;
    fecha_hasta: string | null;
    limit: string;
  };
}
