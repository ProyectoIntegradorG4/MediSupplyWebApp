import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { productsApi } from '../api'
import { Product } from '../../types/api'

// Mock axios
vi.mock('axios')
const mockedAxios = vi.mocked(axios)

describe('Products API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getProducts', () => {
    it('should fetch products successfully', async () => {
      const mockProducts: Product[] = [
        {
          sku: 'SKU001',
          name: 'Test Product 1',
          category: 'General',
          stock: 10,
          location: 'Bodega 1'
        },
        {
          sku: 'SKU002',
          name: 'Test Product 2', 
          category: 'General',
          stock: 5,
          location: 'Bodega 2'
        }
      ]

      mockedAxios.get.mockResolvedValueOnce({
        data: {
          data: mockProducts
        }
      })

      const result = await productsApi.getProducts()

      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:8080/products')
      expect(result).toEqual(mockProducts)
    })

    it('should handle API errors', async () => {
      const errorMessage = 'Network Error'
      mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage))

      await expect(productsApi.getProducts()).rejects.toThrow(errorMessage)
    })

    it('should use default API URL when environment variable is not set', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: { data: [] }
      })

      await productsApi.getProducts()

      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:8080/products')
    })
  })

  describe('createProduct', () => {
    it('should create a product successfully', async () => {
      const newProduct = {
        sku: 'SKU003',
        name: 'New Product',
        stock: 0,
        location: 'Bodega 1',
        category: 'General'
      }

      const createdProduct: Product = {
        ...newProduct,
        sku: 'SKU003',
        name: 'New Product',
        category: 'General',
        stock: 0,
        location: 'Bodega 1'
      }

      mockedAxios.post.mockResolvedValueOnce({
        data: {
          data: createdProduct
        }
      })

      const result = await productsApi.createProduct(newProduct)

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:8080/products',
        newProduct
      )
      expect(result).toEqual(createdProduct)
    })

    it('should handle create product errors', async () => {
      const newProduct = {
        sku: 'SKU003',
        name: 'New Product',
        stock: 0,
        location: 'Bodega 1'
      }

      const errorMessage = 'Validation Error'
      mockedAxios.post.mockRejectedValueOnce(new Error(errorMessage))

      await expect(productsApi.createProduct(newProduct)).rejects.toThrow(errorMessage)
    })

    it('should add default category if not provided', async () => {
      const newProduct = {
        sku: 'SKU003',
        name: 'New Product',
        stock: 0,
        location: 'Bodega 1'
      }

      const createdProduct: Product = {
        ...newProduct,
        category: 'General'
      }

      mockedAxios.post.mockResolvedValueOnce({
        data: {
          data: createdProduct
        }
      })

      await productsApi.createProduct(newProduct)

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:8080/products',
        {
          ...newProduct,
          category: 'General'
        }
      )
    })
  })
})
