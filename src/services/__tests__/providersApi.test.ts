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
          proveedor_id: 'b0868c58-9f91-4ba6-9faf-41a19fe3e8cc',
          razon_social: 'Distribuidora Médica S.A.',
          nit: '900123456-7',
          tipo_proveedor: 'distribuidor',
          email: 'contacto@medidistribuidora.com',
          telefono: '+57 1 234 5678',
          direccion: 'Calle 100 #15-20',
          ciudad: 'Bogotá',
          pais: 'colombia',
          certificaciones: [],
          estado: 'activo',
          validacion_regulatoria: 'en_revision',
          calificacion: null,
          tiempo_entrega_promedio: null,
          created_at: '2025-11-03T03:55:38.552601Z',
          updated_at: '2025-11-03T03:55:38.552606Z',
          version: 0
        },
        {
          proveedor_id: 'c1868c58-9f91-4ba6-9faf-41a19fe3e8dd',
          razon_social: 'Farmacéutica del Sur Ltda.',
          nit: '900234567-8',
          tipo_proveedor: 'laboratorio',
          email: 'contacto@farmasur.com',
          telefono: '+57 2 345 6789',
          direccion: 'Carrera 50 #20-30',
          ciudad: 'Medellín',
          pais: 'colombia',
          certificaciones: ['ISO 9001'],
          estado: 'activo',
          validacion_regulatoria: 'aprobado',
          calificacion: 4.5,
          tiempo_entrega_promedio: 3,
          created_at: '2025-11-03T04:00:00.000000Z',
          updated_at: '2025-11-03T04:00:00.000000Z',
          version: 0
        }
      ]

      mockedAxios.get.mockResolvedValueOnce({
        data: {
          total: 2,
          skip: 0,
          limit: 10,
          data: mockProviders
        }
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
        data: {
          total: 0,
          skip: 0,
          limit: 10,
          data: []
        }
      })

      await providersApi.getProviders()

      expect(mockedAxios.get).toHaveBeenCalledWith(`${API_URL}/proveedores/`)
    })
  })

  describe('createProvider', () => {
    it('should create a provider successfully', async () => {
      const newProvider = {
        razon_social: 'Nueva Distribuidora S.A.',
        nit: '900345678-9',
        tipo_proveedor: 'distribuidor',
        email: 'contacto@nuevadistribuidora.com',
        telefono: '+57 3 456 7890',
        direccion: 'Avenida 80 #25-35',
        ciudad: 'Cali',
        pais: 'colombia',
        certificaciones: ['ISO 9001'],
        estado: 'activo',
        validacion_regulatoria: 'en_revision',
        calificacion: null,
        tiempo_entrega_promedio: null
      }

      const createdProvider: Provider = {
        ...newProvider,
        proveedor_id: 'd2868c58-9f91-4ba6-9faf-41a19fe3e8ee',
        created_at: '2025-11-03T05:00:00.000000Z',
        updated_at: '2025-11-03T05:00:00.000000Z',
        version: 0
      }

      mockedAxios.post.mockResolvedValueOnce({
        data: createdProvider
      })

      const result = await providersApi.createProvider(newProvider)

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${API_URL}/proveedores/`,
        newProvider,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Idempotency-Key': 'Administrador de Compras',
          },
        }
      )
      expect(result).toEqual(createdProvider)
    })

    it('should handle create provider errors', async () => {
      const newProvider = {
        razon_social: 'Nueva Distribuidora S.A.',
        nit: '900345678-9',
        tipo_proveedor: 'distribuidor',
        email: 'contacto@nuevadistribuidora.com',
        telefono: '+57 3 456 7890',
        direccion: 'Avenida 80 #25-35',
        ciudad: 'Cali',
        pais: 'colombia',
        certificaciones: ['ISO 9001'],
        estado: 'activo',
        validacion_regulatoria: 'en_revision',
        calificacion: null,
        tiempo_entrega_promedio: null
      }

      const errorMessage = 'Validation Error'
      mockedAxios.post.mockRejectedValueOnce(new Error(errorMessage))

      await expect(providersApi.createProvider(newProvider)).rejects.toThrow(errorMessage)
    })
  })
})
