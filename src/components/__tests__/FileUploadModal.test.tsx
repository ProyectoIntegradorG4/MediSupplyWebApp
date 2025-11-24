import { render, screen, fireEvent, waitFor } from '../../test/test-utils'
import { vi } from 'vitest'
import FileUploadModal from '../FileUploadModal'

describe('FileUploadModal Component', () => {
  const mockUploadFunction = vi.fn(() => Promise.resolve())

  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onUploadSuccess: vi.fn(),
    uploadFunction: mockUploadFunction,
    entityType: 'products' as const
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders modal when open', () => {
    render(<FileUploadModal {...defaultProps} />)

    expect(screen.getByText('Cargar Archivo CSV')).toBeInTheDocument()
    expect(screen.getByText(/Tamaño máximo de archivo/i)).toBeInTheDocument()
    expect(screen.getByText('Link or drag and drop')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(<FileUploadModal {...defaultProps} isOpen={false} />)

    expect(screen.queryByText('Cargar Archivo CSV')).not.toBeInTheDocument()
  })

  it('accepts CSV file selection', () => {
    render(<FileUploadModal {...defaultProps} />)

    const file = new File(['test content'], 'test.csv', { type: 'text/csv' })
    const input = document.querySelector('input[type="file"]') as HTMLInputElement

    fireEvent.change(input, { target: { files: [file] } })

    expect(screen.getByText('test.csv')).toBeInTheDocument()
  })

  it('shows error for files larger than 3MB', async () => {
    render(<FileUploadModal {...defaultProps} />)

    // Create a file larger than 3MB
    const largeFile = new File(['x'.repeat(4 * 1024 * 1024)], 'large.csv', { type: 'text/csv' })
    const input = document.querySelector('input[type="file"]') as HTMLInputElement

    fireEvent.change(input, { target: { files: [largeFile] } })

    await waitFor(() => {
      expect(screen.getByText(/El archivo es demasiado grande/i)).toBeInTheDocument()
    })
  })

  it('shows error for non-CSV files', async () => {
    render(<FileUploadModal {...defaultProps} />)

    const txtFile = new File(['test'], 'test.txt', { type: 'text/plain' })
    const input = document.querySelector('input[type="file"]') as HTMLInputElement

    fireEvent.change(input, { target: { files: [txtFile] } })

    await waitFor(() => {
      expect(screen.getByText(/Solo se permiten archivos CSV/i)).toBeInTheDocument()
    })
  })

  it('uploads file successfully', async () => {
    render(<FileUploadModal {...defaultProps} />)

    const file = new File(['test content'], 'test.csv', { type: 'text/csv' })
    const input = document.querySelector('input[type="file"]') as HTMLInputElement

    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(screen.getByText('test.csv')).toBeInTheDocument()
    })

    const acceptButton = screen.getByText('ACEPTAR')
    fireEvent.click(acceptButton)

    await waitFor(() => {
      expect(mockUploadFunction).toHaveBeenCalledWith(file)
      expect(defaultProps.onUploadSuccess).toHaveBeenCalled()
      expect(defaultProps.onClose).toHaveBeenCalled()
    })
  })

  it('handles upload errors', async () => {
    const errorUploadFunction = vi.fn(() => Promise.reject(new Error('Upload failed')))
    const errorProps = { ...defaultProps, uploadFunction: errorUploadFunction }

    render(<FileUploadModal {...errorProps} />)

    const file = new File(['test content'], 'test.csv', { type: 'text/csv' })
    const input = document.querySelector('input[type="file"]') as HTMLInputElement

    fireEvent.change(input, { target: { files: [file] } })

    const acceptButton = screen.getByText('ACEPTAR')
    fireEvent.click(acceptButton)

    await waitFor(() => {
      expect(screen.getByText(/Error al cargar el archivo/i)).toBeInTheDocument()
    })
  })

  it('shows sales plan title when entityType is salesPlans', () => {
    const salesPlanProps = { ...defaultProps, entityType: 'salesPlans' as const }
    render(<FileUploadModal {...salesPlanProps} />)

    expect(screen.getByText('Cargar Plan de Ventas CSV')).toBeInTheDocument()
  })

  it('shows sales plan success message when entityType is salesPlans', async () => {
    const salesPlanProps = { ...defaultProps, entityType: 'salesPlans' as const }
    render(<FileUploadModal {...salesPlanProps} />)

    const file = new File(['test content'], 'test.csv', { type: 'text/csv' })
    const input = document.querySelector('input[type="file"]') as HTMLInputElement

    fireEvent.change(input, { target: { files: [file] } })

    const acceptButton = screen.getByText('ACEPTAR')
    fireEvent.click(acceptButton)

    await waitFor(() => {
      expect(screen.getByText(/Plan de ventas cargado exitosamente/i)).toBeInTheDocument()
    })
  })

  it('shows sales plan error message when entityType is salesPlans', async () => {
    const errorUploadFunction = vi.fn(() => Promise.reject(new Error('Upload failed')))
    const salesPlanProps = {
      ...defaultProps,
      uploadFunction: errorUploadFunction,
      entityType: 'salesPlans' as const
    }

    render(<FileUploadModal {...salesPlanProps} />)

    const file = new File(['test content'], 'test.csv', { type: 'text/csv' })
    const input = document.querySelector('input[type="file"]') as HTMLInputElement

    fireEvent.change(input, { target: { files: [file] } })

    const acceptButton = screen.getByText('ACEPTAR')
    fireEvent.click(acceptButton)

    await waitFor(() => {
      expect(screen.getByText(/Error al cargar el plan de ventas/i)).toBeInTheDocument()
    })
  })

  it('closes modal when cancel is clicked', () => {
    render(<FileUploadModal {...defaultProps} />)

    const cancelButton = screen.getByText('CANCELAR')
    fireEvent.click(cancelButton)

    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('disables accept button when no file selected', () => {
    render(<FileUploadModal {...defaultProps} />)

    const acceptButton = screen.getByText('ACEPTAR')
    expect(acceptButton).toBeDisabled()
  })

  it('handles drag and drop', () => {
    render(<FileUploadModal {...defaultProps} />)

    const file = new File(['test content'], 'test.csv', { type: 'text/csv' })
    const dropZone = screen.getByText(/Link or drag and drop/i).closest('div')

    fireEvent.drop(dropZone!, {
      dataTransfer: {
        files: [file],
      },
    })

    expect(screen.getByText('test.csv')).toBeInTheDocument()
  })

  it('shows error for large files dropped', async () => {
    render(<FileUploadModal {...defaultProps} />)

    const largeFile = new File(['x'.repeat(4 * 1024 * 1024)], 'large.csv', { type: 'text/csv' })
    const dropZone = screen.getByText(/Link or drag and drop/i).closest('div')

    fireEvent.drop(dropZone!, {
      dataTransfer: {
        files: [largeFile],
      },
    })

    await waitFor(() => {
      expect(screen.getByText(/El archivo no debe superar los 3MB/i)).toBeInTheDocument()
    })
  })

  it('shows error for non-CSV files dropped', async () => {
    render(<FileUploadModal {...defaultProps} />)

    const txtFile = new File(['test'], 'test.txt', { type: 'text/plain' })
    const dropZone = screen.getByText(/Link or drag and drop/i).closest('div')

    fireEvent.drop(dropZone!, {
      dataTransfer: {
        files: [txtFile],
      },
    })

    await waitFor(() => {
      expect(screen.getByText(/Solo se permiten archivos CSV/i)).toBeInTheDocument()
    })
  })
})
