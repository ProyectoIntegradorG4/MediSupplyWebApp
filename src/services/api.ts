import axios from 'axios';
import { Product, Provider, PaginatedResponse, ProviderPaginatedResponse, User, SalesPlan, UsersPaginatedResponse, SalesPlansPaginatedResponse, Salesman, SalesmanPaginatedResponse, CreateSalesmanRequest, Delivery, DeliveryPaginatedResponse } from '../types/api';
import { mockSellers, mockSalesPlans, mockDeliveries } from '../mocks';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Configure axios to include Authorization header on all requests
axios.interceptors.request.use((config) => {
  config.headers.Authorization = 'Bearer test-token';
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

export const deliveriesApi = {
  getDeliveries: async (): Promise<Delivery[]> => {
    try {
      const response = await axios.get<DeliveryPaginatedResponse>(`${API_URL}/entregas`);
      const deliveries = response?.data?.items;
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
};
