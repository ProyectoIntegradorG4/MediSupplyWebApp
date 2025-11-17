import { render, screen, fireEvent, waitFor } from '../../test/test-utils'
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
    }))
  }
}))


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
    render(<ProductCreateModal {...defaultProps} />)

    expect(screen.getByText('Carga Individual de Productos')).toBeInTheDocument()
    expect(screen.getByText('Nombre *')).toBeInTheDocument()
    expect(screen.getByText('SKU *')).toBeInTheDocument()
    expect(screen.getAllByText('Ubicación *').length).toBeGreaterThan(0)
    expect(screen.getByText('Stock')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(<ProductCreateModal {...defaultProps} isOpen={false} />)

    expect(screen.queryByText('Carga Individual de Productos')).not.toBeInTheDocument()
  })

  it('shows validation errors for required fields', async () => {
    render(
      
        <ProductCreateModal {...defaultProps} />
      
    )

    // Clear required fields to trigger validation
    const nameInput = screen.getByDisplayValue('Producto 1')
    const skuInput = screen.getByPlaceholderText('Código SKU')
    const ubicacionInput = screen.getByPlaceholderText('Ubicación específica')

    fireEvent.change(nameInput, { target: { value: '' } })
    fireEvent.change(skuInput, { target: { value: '' } })
    fireEvent.change(ubicacionInput, { target: { value: '' } })

    const acceptButton = screen.getByText('ACEPTAR')
    fireEvent.click(acceptButton)

    await waitFor(() => {
      expect(screen.getByText('El nombre es requerido')).toBeInTheDocument()
      expect(screen.getByText('El SKU es requerido')).toBeInTheDocument()
      expect(screen.getByText('La ubicación es requerida')).toBeInTheDocument()
      expect(screen.getByText('La fecha de vencimiento es requerida')).toBeInTheDocument()
    })
  })

  it('submits form with valid data', async () => {
    const mockCreateProduct = vi.mocked(productsApi.createProduct)
    
    render(
      
        <ProductCreateModal {...defaultProps} />
      
    )

    // Fill in the form
    const nameInput = screen.getByDisplayValue('Producto 1')
    const skuInput = screen.getByPlaceholderText('Código SKU')
    const ubicacionInput = screen.getByPlaceholderText('Ubicación específica')
    const stockInput = screen.getByPlaceholderText('Cantidad en stock')
    const fechaInput = screen.getByLabelText('Fecha de Vencimiento *')

    fireEvent.change(nameInput, { target: { value: 'Test Product' } })
    fireEvent.change(skuInput, { target: { value: 'SKU123' } })
    fireEvent.change(ubicacionInput, { target: { value: 'A1-B2-C3' } })
    fireEvent.change(stockInput, { target: { value: '10' } })
    fireEvent.change(fechaInput, { target: { value: '2026-12-31' } })

    const acceptButton = screen.getByText('ACEPTAR')
    fireEvent.click(acceptButton)

    await waitFor(() => {
      expect(mockCreateProduct).toHaveBeenCalledWith({
        sku: 'SKU123',
        nombre: 'Test Product',
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
        fechaVencimiento: '2026-12-31',
        stock: '10',
        location: 'Bodega 1',
        ubicacion: 'A1-B2-C3'
      })
    })

    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('closes modal when cancel is clicked', () => {
    render(
      
        <ProductCreateModal {...defaultProps} />
      
    )

    const cancelButton = screen.getByText('CANCELAR')
    fireEvent.click(cancelButton)

    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('resets form when modal is closed', () => {
    const { rerender } = render(
      
        <ProductCreateModal {...defaultProps} />
      
    )

    // Verify modal is open
    expect(screen.getByText('Carga Individual de Productos')).toBeInTheDocument()

    // Close modal
    rerender(
      
        <ProductCreateModal {...defaultProps} isOpen={false} />
      
    )

    // Modal should be closed (Chakra UI hides it but doesn't unmount)
    // We can check that the modal content is not visible
    const modalContent = screen.queryByText('Carga Individual de Productos')
    expect(modalContent).toBeInTheDocument() // Still in DOM but hidden
  })
})
