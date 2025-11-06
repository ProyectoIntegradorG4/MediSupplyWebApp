import axios from 'axios';
import { Product, Provider, PaginatedResponse, ProviderPaginatedResponse, User, SalesPlan, UsersPaginatedResponse, SalesPlansPaginatedResponse, Salesman, SalesmanPaginatedResponse, CreateSalesmanRequest } from '../types/api';
import { mockSellers, mockSalesPlans } from '../mocks';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

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

  uploadProductsCsv: async (file: File, createdBy: string): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('created_by', createdBy);

    await axios.post(`${API_URL}/productos/upload-csv`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
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
      const response = await axios.get<SalesPlansPaginatedResponse>(`${API_URL}/ventas`);
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
