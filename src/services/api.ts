import axios from 'axios';
import { Product, ApiResponse } from '../types/api';

const API_URL = 'http://localhost:8080'; // Update this with your actual API host and port

export const productsApi = {
  getProducts: async (): Promise<Product[]> => {
    const response = await axios.get<ApiResponse<Product[]>>(`${API_URL}/products`);
    return response.data.data;
  },
};
