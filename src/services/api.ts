import axios from 'axios';
import { ApiResponse, Product, Provider, PaginatedResponse } from '../types/api';

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
    const response = await axios.get<ApiResponse<Provider[]>>(`${API_URL}/proveedores/`);
    return response.data.data;
  },

  createProvider: async (provider: Omit<Provider, 'id'>): Promise<Provider> => {
    const response = await axios.post<Provider>(`${API_URL}/proveedores/`, provider);
    return response.data;
  },
};
