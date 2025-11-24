import axios from 'axios';
import { Product, Provider, PaginatedResponse, ProviderPaginatedResponse, User, SalesPlan, UsersPaginatedResponse, SalesPlansPaginatedResponse, Salesman, SalesmanPaginatedResponse, CreateSalesmanRequest, DashboardReportResponse, SellerKPIResponse, RegionReportResponse, KPISummaryResponse, Delivery, DeliveryPaginatedResponse } from '../types/api';
import { mockSellers, mockSalesPlans, mockDeliveries } from '../mocks';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const ORDERS_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8007';

// Configure axios to include Authorization header on most requests
// Skip for logistics endpoints which use custom headers
axios.interceptors.request.use((config) => {
  // Don't add Authorization header for logistics endpoints
  if (!config.url?.includes('/logistica/')) {
    config.headers.Authorization = 'Bearer test-token';
  }
  return config;
});

export const productsApi = {
  getProducts: async (): Promise<Product[]> => {
    const response = await axios.get<PaginatedResponse<Product>>(`${API_URL}/productos`);
    return response.data.items;
  },

  createProduct: async (productData: {
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
    fechaVencimiento: string;
    stock: string;
    location: string;
    ubicacion: string;
  }): Promise<Product> => {
    const response = await axios.post<Product>(`${API_URL}/productos`, productData, {
      headers: {
        'X-User-Role': 'Administrador de Compras',
      },
    });
    return response.data;
  },

  uploadProductsCsv: async (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);

    await axios.post(`${API_URL}/cargamasiva/import-products`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer test-token',
        'x-user-role': 'gerente_cuenta',
      },
    });
  },
};

export const providersApi = {
  getProviders: async (): Promise<Provider[]> => {
    const response = await axios.get<ProviderPaginatedResponse>(`${API_URL}/proveedores/`);
    return response.data.data;
  },

  createProvider: async (provider: Omit<Provider, 'proveedor_id' | 'created_at' | 'updated_at' | 'version'>): Promise<Provider> => {
    const response = await axios.post<Provider>(`${API_URL}/proveedores/`, provider, {
      headers: {
        'Content-Type': 'application/json',
        'X-Idempotency-Key': 'Administrador de Compras',
      },
    });
    return response.data;
  },
};

export const usersApi = {
  getUsers: async (): Promise<User[]> => {
    try {
      const response = await axios.get<UsersPaginatedResponse>(`${API_URL}/users`);
      const users = response?.data?.items;
      if (!Array.isArray(users) || users.length === 0) {
        console.warn('No users found from API, using mock data');
        return mockSellers;
      }
      return users;
    } catch (error) {
      console.error('Error fetching users, using mock data:', error);
      return mockSellers;
    }
  },
};

export const salesPlansApi = {
  getSalesPlans: async (): Promise<SalesPlan[]> => {
    try {
      const response = await axios.get<SalesPlansPaginatedResponse>(`${API_URL}/planes-venta`);
      const plans = response?.data?.items;
      if (!Array.isArray(plans) || plans.length === 0) {
        console.warn('No sales plans found from API, using mock data');
        return mockSalesPlans;
      }
      return plans;
    } catch (error) {
      console.error('Error fetching sales plans, using mock data:', error);
      return mockSalesPlans;
    }
  },

  createSalesPlan: async (salesPlanData: {
    nombre: string;
    periodo: {
      desde: string;
      hasta: string;
    };
    territorios: string[];
    metas: Array<{
      productoId: string;
      territorioId: string;
      vendedorId: string;
      objetivo_cantidad: number;
      objetivo_valor: number;
      nota: string;
    }>;
  }): Promise<SalesPlan> => {
    const response = await axios.post<SalesPlan>(`${API_URL}/v1/planes-venta/`, salesPlanData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  // TODO: Update endpoint when backend is ready
  uploadSalesPlansCsv: async (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);

    await axios.post(`${API_URL}/cargamasiva/import-sales-plans`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer test-token',
        'x-user-role': 'gerente_cuenta',
      },
    });
  },
};

export const salesmenApi = {
  getSalesmen: async (): Promise<Salesman[]> => {
    const response = await axios.get<SalesmanPaginatedResponse>(`${API_URL}/vendedores`);
    return response.data.items;
  },

  createSalesman: async (salesmanData: CreateSalesmanRequest): Promise<Salesman> => {
    const response = await axios.post<Salesman>(`${API_URL}/vendedores`, salesmanData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },
};

export const dashboardApi = {
  getSalesDashboard: async (desde: string, hasta: string): Promise<DashboardReportResponse> => {
    const response = await axios.get<DashboardReportResponse>(
      `${ORDERS_API_URL}/reportes/vendedores/dashboard`,
      {
        params: {
          desde,
          hasta,
        },
      }
    );
    return response.data;
  },
};

export const reportsApi = {
  // KPI de Vendedor individual
  getSellerKPI: async (
    vendedorId: string,
    desde: string,
    hasta: string,
    territorioId?: string,
    productoId?: string
  ): Promise<SellerKPIResponse> => {
    const response = await axios.get<SellerKPIResponse>(
      `${ORDERS_API_URL}/reportes/vendedores/kpi`,
      {
        params: {
          vendedor_id: vendedorId,
          desde,
          hasta,
          ...(territorioId && { territorio_id: territorioId }),
          ...(productoId && { producto_id: productoId }),
        },
      }
    );
    return response.data;
  },

  // Reporte Regional
  getRegionReport: async (
    territorioId: string,
    desde: string,
    hasta: string,
    productoId?: string
  ): Promise<RegionReportResponse> => {
    const response = await axios.get<RegionReportResponse>(
      `${ORDERS_API_URL}/reportes/vendedores/region`,
      {
        params: {
          territorio_id: territorioId,
          desde,
          hasta,
          ...(productoId && { producto_id: productoId }),
        },
      }
    );
    return response.data;
  },

  // Resumen Rápido KPI
  getKPISummary: async (
    vendedorId: string,
    desde: string,
    hasta: string
  ): Promise<KPISummaryResponse> => {
    const response = await axios.get<KPISummaryResponse>(
      `${ORDERS_API_URL}/reportes/vendedores/kpi/resumen`,
      {
        params: {
          vendedor_id: vendedorId,
          desde,
          hasta,
        },
      }
    );
    return response.data;
  },
};

export const deliveriesApi = {
  getDeliveries: async (): Promise<Delivery[]> => {
    try {
      const response = await axios.get<DeliveryPaginatedResponse>(`${API_URL}/logistica/rutas`, {
        headers: {
          'rol-usuario': 'admin',
          'usuario-id': '1',
          'nit-usuario': '111111111-1',
        },
      });
      const deliveries = response?.data?.rutas;
      if (!Array.isArray(deliveries) || deliveries.length === 0) {
        console.warn('No deliveries found from API, using mock data');
        return mockDeliveries;
      }
      return deliveries;
    } catch (error) {
      console.error('Error fetching deliveries, using mock data:', error);
      return mockDeliveries;
    }
  },

  generateRoutes: async (routeData: {
    objetivo: string;
    vehiculos: Array<{
      id: string;
      capacidad_volumen: number;
      capacidad_peso: number;
      cadena_frio: boolean;
      depot: {
        lat: number;
        lon: number;
      };
      duracion_maxima_minutos: number;
    }>;
    pedidos: Array<{
      id: string;
      lat: number;
      lon: number;
      ventana_inicio: string;
      ventana_fin: string;
      tiempo_servicio_minutos: number;
      requiere_frio: boolean;
      volumen: number;
      peso: number;
    }>;
  }): Promise<any> => {
    const response = await axios.post(`${API_URL}/logistica/rutas/generar`, routeData, {
      headers: {
        'Content-Type': 'application/json',
        'rol-usuario': 'admin',
        'usuario-id': '1',
        'nit-usuario': '111111111-1',
      },
    });
    return response.data;
  },
};
