import axios from 'axios';
import { Product, Provider } from '../types/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const productsApi = {
  getProducts: async (): Promise<Product[]> => {
    const response = await axios.get<Product[]>(`${API_URL}/productos`);
    return response.data;
  },

  createProduct: async (product: Omit<Product, 'category'> & { category?: string }): Promise<Product> => {
    const productData = {
      ...product,
      category: product.category || 'General'
    };
    const response = await axios.post<Product>(`${API_URL}/productos`, productData);
    return response.data;
  },
};

export const providersApi = {
  getProviders: async (): Promise<Provider[]> => {
    const response = await axios.get<Provider[]>(`${API_URL}/proveedores/`);
    return response.data;
  },

  createProvider: async (provider: Omit<Provider, 'id'>): Promise<Provider> => {
    const response = await axios.post<Provider>(`${API_URL}/proveedores/`, provider);
    return response.data;
  },
  
  createProduct: async (product: Omit<Product, 'category'> & { category?: string }): Promise<Product> => {
    const productData = {
      ...product,
      category: product.category || 'General'
    };
    const response = await axios.post<Product>(`${API_URL}/products`, productData);
    return response.data;
  },
};
