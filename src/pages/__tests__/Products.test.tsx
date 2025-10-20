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
    ])),
    createProduct: vi.fn(() => Promise.resolve({
      sku: 'SKU003',
      name: 'New Product',
      category: 'General',
      stock: 0,
      location: 'Bodega 1'
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

    expect(screen.getByText('Ventas y Proveedores')).toBeInTheDocument()
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
    expect(screen.getByText('Category')).toBeInTheDocument()
    expect(screen.getByText('Stock')).toBeInTheDocument()
    expect(screen.getByText('Location')).toBeInTheDocument()
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
})
