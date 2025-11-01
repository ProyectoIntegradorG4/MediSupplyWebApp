import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { providersApi } from '../api'
import { Provider } from '../../types/api'

// Mock axios
vi.mock('axios')
const mockedAxios = axios as any

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

describe('Providers API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getProviders', () => {
    it('should fetch providers successfully', async () => {
      const mockProviders: Provider[] = [
        {
          id: 123,
          nombre: 'Laboratorio 1',
          pais: 'Colombia',
          rating: 4.2,
          activo: true
        },
        {
          id: 234,
          nombre: 'Laboratorio 2',
          pais: 'México',
          rating: 3.5,
          activo: false
        }
      ]

      mockedAxios.get.mockResolvedValueOnce({
        data: mockProviders
      })

      const result = await providersApi.getProviders()

      expect(mockedAxios.get).toHaveBeenCalledWith(`${API_URL}/proveedores/`)
      expect(result).toEqual(mockProviders)
    })

    it('should handle API errors', async () => {
      const errorMessage = 'Network Error'
      mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage))

      await expect(providersApi.getProviders()).rejects.toThrow(errorMessage)
    })

    it('should use configured API URL', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: []
      })

      await providersApi.getProviders()

      expect(mockedAxios.get).toHaveBeenCalledWith(`${API_URL}/proveedores/`)
    })
  })

  describe('createProvider', () => {
    it('should create a provider successfully', async () => {
      const newProvider = {
        nombre: 'Laboratorio 3',
        pais: 'Brasil',
        rating: 4.5,
        activo: true
      }

      const createdProvider: Provider = {
        ...newProvider,
        id: 345
      }

      mockedAxios.post.mockResolvedValueOnce({
        data: createdProvider
      })

      const result = await providersApi.createProvider(newProvider)

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${API_URL}/proveedores/`,
        newProvider
      )
      expect(result).toEqual(createdProvider)
    })

    it('should handle create provider errors', async () => {
      const newProvider = {
        nombre: 'Laboratorio 3',
        pais: 'Brasil',
        rating: 4.5,
        activo: true
      }

      const errorMessage = 'Validation Error'
      mockedAxios.post.mockRejectedValueOnce(new Error(errorMessage))

      await expect(providersApi.createProvider(newProvider)).rejects.toThrow(errorMessage)
    })
  })
})
