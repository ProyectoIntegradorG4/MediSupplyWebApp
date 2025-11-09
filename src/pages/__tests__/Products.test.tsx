import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { vi } from 'vitest'
import Products from '../Products'
import { productsApi } from '../../services/api'

// Mock the API
vi.mock('../../services/api', () => ({
  productsApi: {
    getProducts: vi.fn(() => Promise.resolve([
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
    ])),
    createProduct: vi.fn(() => Promise.resolve({
      productoId: '3',
      sku: 'SKU003',
      nombre: 'New Product',
      descripcion: 'Test Descripcion',
      categoriaId: 'CAT-VAC-001',
      subcategoria: 'Vacunas',
      laboratorio: '',
      principioActivo: '',
      concentracion: '',
      formaFarmaceutica: 'Tableta',
      registroSanitario: 'INVIMA-125',
      requierePrescripcion: false,
      codigoBarras: '',
      estado_producto: 'activo',
      actualizado_en: '2025-11-03T01:00:00',
      fechaVencimiento: '2026-01-01',
      stock: '0',
      location: 'Bodega 1',
      ubicacion: 'Bogotá D.C.'
    }))
  }
}))

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </ChakraProvider>
    </QueryClientProvider>
  )
}

describe('Products Component', () => {
  it('renders products page elements', async () => {
    render(
      <TestWrapper>
        <Products />
      </TestWrapper>
    )

    expect(screen.getByText('Proveedores y Productos')).toBeInTheDocument()
    expect(screen.getByText('PROVEEDORES')).toBeInTheDocument()
    expect(screen.getByText('PRODUCTOS')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('SKU')).toBeInTheDocument()
    expect(screen.getByText('CARGA INDIVIDUAL')).toBeInTheDocument()
    expect(screen.getByText('CARGA MASIVA')).toBeInTheDocument()
  })

  it('displays products table with data', async () => {
    render(
      <TestWrapper>
        <Products />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('SKU001')).toBeInTheDocument()
      expect(screen.getByText('Test Product 1')).toBeInTheDocument()
      expect(screen.getByText('SKU002')).toBeInTheDocument()
      expect(screen.getByText('Test Product 2')).toBeInTheDocument()
    })

    // Check table headers
    expect(screen.getByText('SKU')).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Ubicación')).toBeInTheDocument()
    expect(screen.getByText('Stock')).toBeInTheDocument()
    expect(screen.getByText('Location')).toBeInTheDocument()

    // Check that ubicacion data is displayed
    expect(screen.getByText('Bogotá D.C.')).toBeInTheDocument()
    expect(screen.getByText('Medellín')).toBeInTheDocument()
  })

  it('filters products by SKU search', async () => {
    render(
      <TestWrapper>
        <Products />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('SKU001')).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText('SKU')
    fireEvent.change(searchInput, { target: { value: 'SKU001' } })

    await waitFor(() => {
      expect(screen.getByText('SKU001')).toBeInTheDocument()
      expect(screen.queryByText('SKU002')).not.toBeInTheDocument()
    })
  })

  it('opens individual product creation modal', async () => {
    render(
      <TestWrapper>
        <Products />
      </TestWrapper>
    )

    const individualButton = screen.getByText('CARGA INDIVIDUAL')
    fireEvent.click(individualButton)

    await waitFor(() => {
      expect(screen.getByText('Carga Individual de Productos')).toBeInTheDocument()
    })
  })

  it('opens bulk upload modal', async () => {
    render(
      <TestWrapper>
        <Products />
      </TestWrapper>
    )

    const bulkButton = screen.getByText('CARGA MASIVA')
    fireEvent.click(bulkButton)

    await waitFor(() => {
      expect(screen.getByText('Carga de Archivos')).toBeInTheDocument()
    })
  })

  it('shows loading state while fetching products', () => {
    // Mock a delayed response
    const mockGetProducts = vi.mocked(productsApi.getProducts)
    mockGetProducts.mockImplementationOnce(
      () => new Promise(resolve => setTimeout(() => resolve([]), 1000))
    )

    render(
      <TestWrapper>
        <Products />
      </TestWrapper>
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('filters products by location', async () => {
    render(
      <TestWrapper>
        <Products />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('SKU001')).toBeInTheDocument()
    })

    const locationInput = screen.getByPlaceholderText('Location')
    fireEvent.change(locationInput, { target: { value: 'Bodega 1' } })

    await waitFor(() => {
      expect(screen.getByText('SKU001')).toBeInTheDocument()
      expect(screen.queryByText('SKU002')).not.toBeInTheDocument()
    })
  })

  it('changes rows per page', async () => {
    // Mock more products to test pagination
    const mockGetProducts = vi.mocked(productsApi.getProducts)
    mockGetProducts.mockImplementationOnce(() => Promise.resolve(
      Array.from({ length: 15 }, (_, i) => ({
        productoId: `${i + 1}`,
        sku: `SKU${String(i + 1).padStart(3, '0')}`,
        nombre: `Test Product ${i + 1}`,
        descripcion: 'Test Descripcion',
        categoriaId: 'CAT-VAC-001',
        subcategoria: 'Vacunas',
        laboratorio: '',
        principioActivo: '',
        concentracion: '',
        formaFarmaceutica: 'Tableta',
        registroSanitario: `INVIMA-${i + 1}`,
        requierePrescripcion: false,
        codigoBarras: '',
        estado_producto: 'activo',
        actualizado_en: '2025-11-03T01:00:00',
        fechaVencimiento: '2026-01-01',
        stock: '10',
        location: 'Bodega 1',
        ubicacion: 'Bogotá D.C.'
      }))
    ))

    render(
      <TestWrapper>
        <Products />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('SKU001')).toBeInTheDocument()
    })

    const rowsPerPageSelect = screen.getByDisplayValue('10')
    fireEvent.change(rowsPerPageSelect, { target: { value: '5' } })

    await waitFor(() => {
      expect(screen.getByText(/1-5 of 15/)).toBeInTheDocument()
    })
  })

  it('navigates between pages', async () => {
    // Mock more products to test pagination
    const mockGetProducts = vi.mocked(productsApi.getProducts)
    mockGetProducts.mockImplementationOnce(() => Promise.resolve(
      Array.from({ length: 15 }, (_, i) => ({
        productoId: `${i + 1}`,
        sku: `SKU${String(i + 1).padStart(3, '0')}`,
        nombre: `Test Product ${i + 1}`,
        descripcion: 'Test Descripcion',
        categoriaId: 'CAT-VAC-001',
        subcategoria: 'Vacunas',
        laboratorio: '',
        principioActivo: '',
        concentracion: '',
        formaFarmaceutica: 'Tableta',
        registroSanitario: `INVIMA-${i + 1}`,
        requierePrescripcion: false,
        codigoBarras: '',
        estado_producto: 'activo',
        actualizado_en: '2025-11-03T01:00:00',
        fechaVencimiento: '2026-01-01',
        stock: '10',
        location: 'Bodega 1',
        ubicacion: 'Bogotá D.C.'
      }))
    ))

    render(
      <TestWrapper>
        <Products />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('SKU001')).toBeInTheDocument()
    })

    // Check initial page
    expect(screen.getByText(/Page 1 of 2/)).toBeInTheDocument()

    // Click next page button
    const nextButton = screen.getByLabelText('Next page')
    fireEvent.click(nextButton)

    await waitFor(() => {
      expect(screen.getByText(/Page 2 of 2/)).toBeInTheDocument()
    })

    // Click previous page button
    const prevButton = screen.getByLabelText('Previous page')
    fireEvent.click(prevButton)

    await waitFor(() => {
      expect(screen.getByText(/Page 1 of 2/)).toBeInTheDocument()
    })
  })
})
