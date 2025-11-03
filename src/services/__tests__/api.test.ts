import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { productsApi } from '../api'
import { Product } from '../../types/api'

// Mock axios
vi.mock('axios')
const mockedAxios = axios as any

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

describe('Products API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getProducts', () => {
    it('should fetch products successfully', async () => {
      const mockProducts: Product[] = [
        {
          productoId: '1',
          sku: 'SKU001',
          nombre: 'Test Product 1',
          descripcion: 'Test Descripcion',
          categoriaId: 'CAT-VAC-001',
          subcategoria: 'Vacunas',
          laboratorio: '',
          principioActivo: '',
          concentracion: '',
          formaFarmaceutica: 'Tableta',
          registroSanitario: 'INVIMA-123',
          requierePrescripcion: false,
          codigoBarras: '',
          estado_producto: 'activo',
          actualizado_en: '2025-11-03T01:00:00',
          fechaVencimiento: '2026-01-01',
          stock: '10',
          location: 'Bodega 1',
          ubicacion: 'Bogotá D.C.'
        },
        {
          productoId: '2',
          sku: 'SKU002',
          nombre: 'Test Product 2',
          descripcion: 'Test Descripcion',
          categoriaId: 'CAT-VAC-001',
          subcategoria: 'Vacunas',
          laboratorio: '',
          principioActivo: '',
          concentracion: '',
          formaFarmaceutica: 'Tableta',
          registroSanitario: 'INVIMA-124',
          requierePrescripcion: false,
          codigoBarras: '',
          estado_producto: 'activo',
          actualizado_en: '2025-11-03T01:00:00',
          fechaVencimiento: '2026-01-01',
          stock: '5',
          location: 'Bodega 2',
          ubicacion: 'Medellín'
        }
      ]

      mockedAxios.get.mockResolvedValueOnce({
        data: {
          total: 2,
          items: mockProducts,
          page: 1,
          page_size: 25
        }
      })

      const result = await productsApi.getProducts()

      expect(mockedAxios.get).toHaveBeenCalledWith(`${API_URL}/productos`)
      expect(result).toEqual(mockProducts)
    })

    it('should handle API errors', async () => {
      const errorMessage = 'Network Error'
      mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage))

      await expect(productsApi.getProducts()).rejects.toThrow(errorMessage)
    })

    it('should use configured API URL', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          total: 0,
          items: [],
          page: 1,
          page_size: 25
        }
      })

      await productsApi.getProducts()

      expect(mockedAxios.get).toHaveBeenCalledWith(`${API_URL}/productos`)
    })
  })

  describe('createProduct', () => {
    it('should create a product successfully', async () => {
      const newProduct = {
        sku: 'SKU003',
        nombre: 'New Product',
        descripcion: 'Test Descripcion',
        categoriaId: 'CAT-VAC-001',
        subcategoria: 'Vacunas',
        laboratorio: '',
        principioActivo: '',
        concentracion: '',
        formaFarmaceutica: 'Test',
        registroSanitario: 'INVIMA 2025M-000123-R1',
        requierePrescripcion: false,
        codigoBarras: '',
        fechaVencimiento: '2026-01-01',
        stock: '0',
        location: 'Bodega 1',
        ubicacion: 'Bogotá D.C.'
      }

      const createdProduct: Product = {
        productoId: '3',
        sku: 'SKU003',
        nombre: 'New Product',
        descripcion: 'Test Descripcion',
        categoriaId: 'CAT-VAC-001',
        subcategoria: 'Vacunas',
        laboratorio: '',
        principioActivo: '',
        concentracion: '',
        formaFarmaceutica: 'Test',
        registroSanitario: 'INVIMA 2025M-000123-R1',
        requierePrescripcion: false,
        codigoBarras: '',
        estado_producto: 'activo',
        actualizado_en: '2025-11-03T01:00:00',
        fechaVencimiento: '2026-01-01',
        stock: '0',
        location: 'Bodega 1',
        ubicacion: 'Bogotá D.C.'
      }

      mockedAxios.post.mockResolvedValueOnce({
        data: createdProduct
      })

      const result = await productsApi.createProduct(newProduct)

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${API_URL}/productos`,
        newProduct
      )
      expect(result).toEqual(createdProduct)
    })

    it('should handle create product errors', async () => {
      const newProduct = {
        sku: 'SKU003',
        nombre: 'New Product',
        descripcion: 'Test Descripcion',
        categoriaId: 'CAT-VAC-001',
        subcategoria: 'Vacunas',
        laboratorio: '',
        principioActivo: '',
        concentracion: '',
        formaFarmaceutica: 'Test',
        registroSanitario: 'INVIMA 2025M-000123-R1',
        requierePrescripcion: false,
        codigoBarras: '',
        fechaVencimiento: '2026-01-01',
        stock: '0',
        location: 'Bodega 1',
        ubicacion: 'Bogotá D.C.'
      }

      const errorMessage = 'Validation Error'
      mockedAxios.post.mockRejectedValueOnce(new Error(errorMessage))

      await expect(productsApi.createProduct(newProduct)).rejects.toThrow(errorMessage)
    })

    it('should send all product fields to backend', async () => {
      const newProduct = {
        sku: 'SKU003',
        nombre: 'New Product',
        descripcion: 'Test Descripcion',
        categoriaId: 'CAT-VAC-001',
        subcategoria: 'Vacunas',
        laboratorio: '',
        principioActivo: '',
        concentracion: '',
        formaFarmaceutica: 'Test',
        registroSanitario: 'INVIMA 2025M-000123-R1',
        requierePrescripcion: false,
        codigoBarras: '',
        fechaVencimiento: '2026-01-01',
        stock: '0',
        location: 'Bodega 1',
        ubicacion: 'Bogotá D.C.'
      }

      const createdProduct: Product = {
        productoId: '3',
        sku: 'SKU003',
        nombre: 'New Product',
        descripcion: 'Test Descripcion',
        categoriaId: 'CAT-VAC-001',
        subcategoria: 'Vacunas',
        laboratorio: '',
        principioActivo: '',
        concentracion: '',
        formaFarmaceutica: 'Test',
        registroSanitario: 'INVIMA 2025M-000123-R1',
        requierePrescripcion: false,
        codigoBarras: '',
        estado_producto: 'activo',
        actualizado_en: '2025-11-03T01:00:00',
        fechaVencimiento: '2026-01-01',
        stock: '0',
        location: 'Bodega 1',
        ubicacion: 'Bogotá D.C.'
      }

      mockedAxios.post.mockResolvedValueOnce({
        data: createdProduct
      })

      await productsApi.createProduct(newProduct)

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${API_URL}/productos`,
        newProduct
      )
    })
  })
})
