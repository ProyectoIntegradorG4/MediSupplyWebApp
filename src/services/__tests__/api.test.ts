import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { productsApi, salesmenApi, usersApi, salesPlansApi } from '../api'
import { Product, Salesman, User, SalesPlan } from '../../types/api'
import { mockSellers, mockSalesPlans } from '../../mocks'

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
        newProduct,
        {
          headers: {
            'X-User-Role': 'Administrador de Compras',
          },
        }
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
        newProduct,
        {
          headers: {
            'X-User-Role': 'Administrador de Compras',
          },
        }
      )
    })
  })

  describe('uploadProductsCsv', () => {
    it('should upload CSV file successfully', async () => {
      const mockFile = new File(['test content'], 'products.csv', { type: 'text/csv' })

      mockedAxios.post.mockResolvedValueOnce({ data: {} })

      await productsApi.uploadProductsCsv(mockFile)

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${API_URL}/cargamasiva/import-products`,
        expect.any(FormData),
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer test-token',
            'x-user-role': 'gerente_cuenta',
          },
        }
      )

      // Verify FormData contents
      const formData = mockedAxios.post.mock.calls[0][1] as FormData
      expect(formData.get('file')).toBe(mockFile)
    })

    it('should handle upload errors', async () => {
      const mockFile = new File(['test content'], 'products.csv', { type: 'text/csv' })
      const errorMessage = 'Upload failed'

      mockedAxios.post.mockRejectedValueOnce(new Error(errorMessage))

      await expect(productsApi.uploadProductsCsv(mockFile)).rejects.toThrow(errorMessage)
    })
  })
})

describe('Salesmen API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getSalesmen', () => {
    it('should fetch salesmen successfully', async () => {
      const mockSalesmen: Salesman[] = [
        {
          vendedorId: '1',
          nombres: 'John',
          apellidos: 'Doe',
          tipoDocumento: 'CC',
          numeroDocumento: 'ID001',
          email: 'john@example.com',
          pais: 'Colombia',
          territorio: 'Bogotá',
          territorioId: 'T001',
          estado: 'Activo',
          actualizado_en: '2024-01-01T00:00:00Z'
        }
      ]

      mockedAxios.get.mockResolvedValueOnce({
        data: {
          items: mockSalesmen
        }
      })

      const result = await salesmenApi.getSalesmen()

      expect(mockedAxios.get).toHaveBeenCalledWith(`${API_URL}/vendedores`)
      expect(result).toEqual(mockSalesmen)
    })

    it('should handle API errors', async () => {
      const errorMessage = 'Network Error'
      mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage))

      await expect(salesmenApi.getSalesmen()).rejects.toThrow(errorMessage)
    })
  })

  describe('createSalesman', () => {
    it('should create a salesman successfully', async () => {
      const newSalesman = {
        nombres: 'Jane',
        apellidos: 'Smith',
        tipoDocumento: 'CC',
        numeroDocumento: 'ID002',
        email: 'jane@example.com',
        telefono: '9876543210',
        pais: 'Colombia',
        territorioId: 'T002'
      }

      const createdSalesman: Salesman = {
        vendedorId: '2',
        nombres: 'Jane',
        apellidos: 'Smith',
        tipoDocumento: 'CC',
        numeroDocumento: 'ID002',
        email: 'jane@example.com',
        pais: 'Colombia',
        territorio: null,
        territorioId: 'T002',
        estado: 'Activo',
        actualizado_en: '2024-02-01T00:00:00Z'
      }

      mockedAxios.post.mockResolvedValueOnce({
        data: createdSalesman
      })

      const result = await salesmenApi.createSalesman(newSalesman)

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${API_URL}/vendedores`,
        newSalesman,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      expect(result).toEqual(createdSalesman)
    })

    it('should handle create salesman errors', async () => {
      const newSalesman = {
        nombres: 'Jane',
        apellidos: 'Smith',
        tipoDocumento: 'CC',
        numeroDocumento: 'ID002',
        email: 'jane@example.com',
        telefono: '9876543210',
        pais: 'Colombia',
        territorioId: 'T002'
      }

      const errorMessage = 'Validation Error'
      mockedAxios.post.mockRejectedValueOnce(new Error(errorMessage))

      await expect(salesmenApi.createSalesman(newSalesman)).rejects.toThrow(errorMessage)
    })
  })
})

describe('Users API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getUsers', () => {
    it('should fetch users successfully', async () => {
      const mockUsers: User[] = [
        {
          id: 1,
          nombre: 'Admin User',
          pais: 'Colombia',
          metaDeVentas: 100000,
          rendimiento: 'Excelente'
        }
      ]

      mockedAxios.get.mockResolvedValueOnce({
        data: {
          items: mockUsers
        }
      })

      const result = await usersApi.getUsers()

      expect(mockedAxios.get).toHaveBeenCalledWith(`${API_URL}/users`)
      expect(result).toEqual(mockUsers)
    })

    it('should return mock data when API returns empty array', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          items: []
        }
      })

      const result = await usersApi.getUsers()

      expect(result).toEqual(mockSellers)
    })

    it('should return mock data when API returns undefined', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: {}
      })

      const result = await usersApi.getUsers()

      expect(result).toEqual(mockSellers)
    })

    it('should return mock data on API error', async () => {
      const errorMessage = 'Network Error'
      mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage))

      const result = await usersApi.getUsers()

      expect(result).toEqual(mockSellers)
    })
  })
})

describe('Sales Plans API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getSalesPlans', () => {
    it('should fetch sales plans successfully', async () => {
      const mockPlans: SalesPlan[] = [
        {
          id: 1,
          nombre: 'Plan A',
          periodo: '2024-Q1',
          estado: 'Activo',
          cantidad: 100000
        }
      ]

      mockedAxios.get.mockResolvedValueOnce({
        data: {
          items: mockPlans
        }
      })

      const result = await salesPlansApi.getSalesPlans()

      expect(mockedAxios.get).toHaveBeenCalledWith(`${API_URL}/ventas`)
      expect(result).toEqual(mockPlans)
    })

    it('should return mock data when API returns empty array', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          items: []
        }
      })

      const result = await salesPlansApi.getSalesPlans()

      expect(result).toEqual(mockSalesPlans)
    })

    it('should return mock data when API returns undefined', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: {}
      })

      const result = await salesPlansApi.getSalesPlans()

      expect(result).toEqual(mockSalesPlans)
    })

    it('should return mock data on API error', async () => {
      const errorMessage = 'Network Error'
      mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage))

      const result = await salesPlansApi.getSalesPlans()

      expect(result).toEqual(mockSalesPlans)
    })
  })
})
