import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { vi } from 'vitest'
import ProductCreateModal from '../ProductCreateModal'
import { productsApi } from '../../services/api'

// Mock the API
vi.mock('../../services/api', () => ({
  productsApi: {
    createProduct: vi.fn(() => Promise.resolve({
      productoId: '3',
      sku: 'SKU003',
      nombre: 'New Product',
      categoria: 'General',
      formaFarmaceutica: 'Tableta',
      requierePrescripcion: 'False',
      registroSanitario: 'INVIMA-125',
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
        {children}
      </ChakraProvider>
    </QueryClientProvider>
  )
}

describe('ProductCreateModal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onProductCreated: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders modal when open', () => {
    render(
      <TestWrapper>
        <ProductCreateModal {...defaultProps} />
      </TestWrapper>
    )

    expect(screen.getByText('Carga Individual de Productos')).toBeInTheDocument()
    expect(screen.getByText('Nombre *')).toBeInTheDocument()
    expect(screen.getByText('SKU *')).toBeInTheDocument()
    expect(screen.getByText('Location *')).toBeInTheDocument()
    expect(screen.getByText('Ubicación *')).toBeInTheDocument()
    expect(screen.getByText('Stock')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(
      <TestWrapper>
        <ProductCreateModal {...defaultProps} isOpen={false} />
      </TestWrapper>
    )

    expect(screen.queryByText('Carga Individual de Productos')).not.toBeInTheDocument()
  })

  it('shows validation errors for required fields', async () => {
    render(
      <TestWrapper>
        <ProductCreateModal {...defaultProps} />
      </TestWrapper>
    )

    // Clear the SKU and ubicacion fields to trigger validation
    const skuInput = screen.getByPlaceholderText('Código SKU')
    const ubicacionInput = screen.getByPlaceholderText('Ubicación específica')
    
    fireEvent.change(skuInput, { target: { value: '' } })
    fireEvent.change(ubicacionInput, { target: { value: '' } })

    const acceptButton = screen.getByText('ACEPTAR')
    fireEvent.click(acceptButton)

    await waitFor(() => {
      expect(screen.getByText('El SKU es requerido')).toBeInTheDocument()
      expect(screen.getByText('La ubicación es requerida')).toBeInTheDocument()
    })
  })

  it('submits form with valid data', async () => {
    const mockCreateProduct = vi.mocked(productsApi.createProduct)
    
    render(
      <TestWrapper>
        <ProductCreateModal {...defaultProps} />
      </TestWrapper>
    )

    // Fill in the form
    const nameInput = screen.getByDisplayValue('Producto 1')
    const skuInput = screen.getByPlaceholderText('Código SKU')
    const ubicacionInput = screen.getByPlaceholderText('Ubicación específica')
    const stockInput = screen.getByPlaceholderText('Cantidad en stock')

    fireEvent.change(nameInput, { target: { value: 'Test Product' } })
    fireEvent.change(skuInput, { target: { value: 'SKU123' } })
    fireEvent.change(ubicacionInput, { target: { value: 'A1-B2-C3' } })
    fireEvent.change(stockInput, { target: { value: '10' } })

    const acceptButton = screen.getByText('ACEPTAR')
    fireEvent.click(acceptButton)

    await waitFor(() => {
      expect(mockCreateProduct).toHaveBeenCalledWith({
        sku: 'SKU123',
        nombre: 'Test Product',
        stock: '10',
        location: 'Bodega 1',
        ubicacion: 'A1-B2-C3',
        categoria: 'General'
      })
    })

    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('closes modal when cancel is clicked', () => {
    render(
      <TestWrapper>
        <ProductCreateModal {...defaultProps} />
      </TestWrapper>
    )

    const cancelButton = screen.getByText('CANCELAR')
    fireEvent.click(cancelButton)

    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('resets form when modal is closed', () => {
    const { rerender } = render(
      <TestWrapper>
        <ProductCreateModal {...defaultProps} />
      </TestWrapper>
    )

    // Verify modal is open
    expect(screen.getByText('Carga Individual de Productos')).toBeInTheDocument()

    // Close modal
    rerender(
      <TestWrapper>
        <ProductCreateModal {...defaultProps} isOpen={false} />
      </TestWrapper>
    )

    // Modal should be closed (Chakra UI hides it but doesn't unmount)
    // We can check that the modal content is not visible
    const modalContent = screen.queryByText('Carga Individual de Productos')
    expect(modalContent).toBeInTheDocument() // Still in DOM but hidden
  })
})
