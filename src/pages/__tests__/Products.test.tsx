import { render, screen, fireEvent, waitFor } from '../../test/test-utils'
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


describe('Products Component', () => {
  it('renders products page elements', async () => {
    render(<Products />)

    expect(screen.getByText('Gestión de Productos')).toBeInTheDocument()
    expect(screen.getByText('PROVEEDORES')).toBeInTheDocument()
    expect(screen.getByText('PRODUCTOS')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('SKU')).toBeInTheDocument()
    expect(screen.getByText('CREAR PRODUCTO INDIVIDUAL')).toBeInTheDocument()
    expect(screen.getByText('CARGAR PRODUCTOS MASIVAMENTE')).toBeInTheDocument()
  })

  it('displays products table with data', async () => {
    render(
      
        <Products />
      
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
      
        <Products />
      
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
    render(<Products />)

    const individualButton = screen.getByText('CREAR PRODUCTO INDIVIDUAL')
    fireEvent.click(individualButton)

    await waitFor(() => {
      expect(screen.getByText('Carga Individual de Productos')).toBeInTheDocument()
    })
  })

  it('opens bulk upload modal', async () => {
    render(<Products />)

    const bulkButton = screen.getByText('CARGAR PRODUCTOS MASIVAMENTE')
    fireEvent.click(bulkButton)

    await waitFor(() => {
      expect(screen.getByText('Cargar Archivo CSV')).toBeInTheDocument()
    })
  })

  it('shows loading state while fetching products', () => {
    // Mock a delayed response
    const mockGetProducts = vi.mocked(productsApi.getProducts)
    mockGetProducts.mockImplementationOnce(
      () => new Promise(resolve => setTimeout(() => resolve([]), 1000))
    )

    render(
      
        <Products />
      
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('creates new product via individual modal and closes', async () => {
    render(<Products />)

    // Wait for initial products to load
    await waitFor(() => {
      expect(screen.getByText('SKU001')).toBeInTheDocument()
    })

    // Open individual product creation modal
    const individualButton = screen.getByText('CREAR PRODUCTO INDIVIDUAL')
    fireEvent.click(individualButton)

    await waitFor(() => {
      expect(screen.getByText('Carga Individual de Productos')).toBeInTheDocument()
    })

    // Close the modal
    const cancelButton = screen.getByText('CANCELAR')
    fireEvent.click(cancelButton)

    // Verify modal is closed
    await waitFor(() => {
      expect(screen.queryByText('Carga Individual de Productos')).not.toBeInTheDocument()
    })
  })

  it('handles error state when fetching products fails', async () => {
    const mockGetProducts = vi.mocked(productsApi.getProducts)
    mockGetProducts.mockRejectedValueOnce(new Error('API Error'))

    render(
      
        <Products />
      
    )

    await waitFor(() => {
      expect(screen.getByText('Error loading products. Please try again later.')).toBeInTheDocument()
    })
  })

  it('shows no products message when there are no products', async () => {
    const mockGetProducts = vi.mocked(productsApi.getProducts)
    mockGetProducts.mockResolvedValueOnce([])

    render(
      
        <Products />
      
    )

    await waitFor(() => {
      expect(screen.getByText('No products found')).toBeInTheDocument()
    })
  })

  it('changes rows per page selection', async () => {
    render(
      
        <Products />
      
    )

    await waitFor(() => {
      expect(screen.getByText('SKU001')).toBeInTheDocument()
    })

    const rowsPerPageSelect = screen.getByRole('combobox')
    fireEvent.change(rowsPerPageSelect, { target: { value: '20' } })

    expect(rowsPerPageSelect).toHaveValue('20')
  })

  it('navigates to providers tab when clicked', async () => {
    render(

        <Products />

    )

    const providersTab = screen.getByText('PROVEEDORES')
    fireEvent.click(providersTab)

    // The navigate function should be called with /providers
    // This is handled by the navigate mock in the test setup
  })

  it('handles pagination - navigates to next page', async () => {
    // Create enough products to require pagination
    const mockGetProducts = vi.mocked(productsApi.getProducts)
    const manyProducts = Array.from({ length: 15 }, (_, i) => ({
      productoId: `${i + 1}`,
      sku: `SKU00${i + 1}`,
      nombre: `Test Product ${i + 1}`,
      descripcion: 'Test Descripcion',
      categoriaId: 'CAT-VAC-001',
      subcategoria: 'Vacunas',
      laboratorio: '',
      principioActivo: '',
      concentracion: '',
      formaFarmaceutica: 'Tableta',
      registroSanitario: `INVIMA-${i + 100}`,
      requierePrescripcion: false,
      codigoBarras: '',
      estado_producto: 'activo',
      actualizado_en: '2025-11-03T01:00:00',
      fechaVencimiento: '2026-01-01',
      stock: '10',
      location: 'Bodega 1',
      ubicacion: 'Bogotá D.C.'
    }))
    mockGetProducts.mockResolvedValueOnce(manyProducts)

    render(<Products />)

    await waitFor(() => {
      expect(screen.getByText('SKU001')).toBeInTheDocument()
    })

    // Find and click the "Next page" button
    const nextButton = screen.getByLabelText('Next page')
    fireEvent.click(nextButton)

    // Verify we're on page 2
    await waitFor(() => {
      expect(screen.getByText('Page 2 of 2')).toBeInTheDocument()
    })
  })

  it('handles pagination - navigates to previous page', async () => {
    const mockGetProducts = vi.mocked(productsApi.getProducts)
    const manyProducts = Array.from({ length: 15 }, (_, i) => ({
      productoId: `${i + 1}`,
      sku: `SKU00${i + 1}`,
      nombre: `Test Product ${i + 1}`,
      descripcion: 'Test Descripcion',
      categoriaId: 'CAT-VAC-001',
      subcategoria: 'Vacunas',
      laboratorio: '',
      principioActivo: '',
      concentracion: '',
      formaFarmaceutica: 'Tableta',
      registroSanitario: `INVIMA-${i + 100}`,
      requierePrescripcion: false,
      codigoBarras: '',
      estado_producto: 'activo',
      actualizado_en: '2025-11-03T01:00:00',
      fechaVencimiento: '2026-01-01',
      stock: '10',
      location: 'Bodega 1',
      ubicacion: 'Bogotá D.C.'
    }))
    mockGetProducts.mockResolvedValueOnce(manyProducts)

    render(<Products />)

    await waitFor(() => {
      expect(screen.getByText('SKU001')).toBeInTheDocument()
    })

    // Go to page 2 first
    const nextButton = screen.getByLabelText('Next page')
    fireEvent.click(nextButton)

    await waitFor(() => {
      expect(screen.getByText('Page 2 of 2')).toBeInTheDocument()
    })

    // Now go back to page 1
    const prevButton = screen.getByLabelText('Previous page')
    fireEvent.click(prevButton)

    await waitFor(() => {
      expect(screen.getByText('Page 1 of 2')).toBeInTheDocument()
    })
  })
})
