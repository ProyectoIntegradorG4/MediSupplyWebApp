import axios from 'axios';
import { Product, ApiResponse } from '../types/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const productsApi = {
  getProducts: async (): Promise<Product[]> => {
    const response = await axios.get<ApiResponse<Product[]>>(`${API_URL}/products`);
    return response.data.data;
  },
  
  createProduct: async (product: Omit<Product, 'category'> & { category?: string }): Promise<Product> => {
    const productData = {
      ...product,
      category: product.category || 'General'
    };
    const response = await axios.post<ApiResponse<Product>>(`${API_URL}/products`, productData);
    return response.data.data;
  },
};
