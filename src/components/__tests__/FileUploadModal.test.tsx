import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import { vi } from 'vitest'
import FileUploadModal from '../FileUploadModal'
import { productsApi } from '../../services/api'

// Mock the API
vi.mock('../../services/api', () => ({
  productsApi: {
    uploadProductsCsv: vi.fn(() => Promise.resolve())
  }
}))

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return <ChakraProvider>{children}</ChakraProvider>
}

describe('FileUploadModal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onUploadSuccess: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders modal when open', () => {
    render(
      <TestWrapper>
        <FileUploadModal {...defaultProps} />
      </TestWrapper>
    )

    expect(screen.getByText('Carga de Archivos')).toBeInTheDocument()
    expect(screen.getByText(/Por favor seleccione el archivo/i)).toBeInTheDocument()
    expect(screen.getByText('Link or drag and drop')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(
      <TestWrapper>
        <FileUploadModal {...defaultProps} isOpen={false} />
      </TestWrapper>
    )

    expect(screen.queryByText('Carga de Archivos')).not.toBeInTheDocument()
  })

  it('accepts CSV file selection', () => {
    render(
      <TestWrapper>
        <FileUploadModal {...defaultProps} />
      </TestWrapper>
    )

    const file = new File(['test content'], 'test.csv', { type: 'text/csv' })
    const input = document.querySelector('input[type="file"]') as HTMLInputElement

    fireEvent.change(input, { target: { files: [file] } })

    expect(screen.getByText('test.csv')).toBeInTheDocument()
  })

  it('shows error for files larger than 3MB', async () => {
    render(
      <TestWrapper>
        <FileUploadModal {...defaultProps} />
      </TestWrapper>
    )

    // Create a file larger than 3MB
    const largeFile = new File(['x'.repeat(4 * 1024 * 1024)], 'large.csv', { type: 'text/csv' })
    const input = document.querySelector('input[type="file"]') as HTMLInputElement

    fireEvent.change(input, { target: { files: [largeFile] } })

    await waitFor(() => {
      expect(screen.getByText(/El archivo no debe superar los 3MB/i)).toBeInTheDocument()
    })
  })

  it('shows error for non-CSV files', async () => {
    render(
      <TestWrapper>
        <FileUploadModal {...defaultProps} />
      </TestWrapper>
    )

    const txtFile = new File(['test'], 'test.txt', { type: 'text/plain' })
    const input = document.querySelector('input[type="file"]') as HTMLInputElement

    fireEvent.change(input, { target: { files: [txtFile] } })

    await waitFor(() => {
      expect(screen.getByText(/Solo se permiten archivos CSV/i)).toBeInTheDocument()
    })
  })

  it('uploads file successfully', async () => {
    const mockUpload = vi.mocked(productsApi.uploadProductsCsv)

    render(
      <TestWrapper>
        <FileUploadModal {...defaultProps} />
      </TestWrapper>
    )

    const file = new File(['test content'], 'test.csv', { type: 'text/csv' })
    const input = document.querySelector('input[type="file"]') as HTMLInputElement

    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(screen.getByText('test.csv')).toBeInTheDocument()
    })

    const acceptButton = screen.getByText('ACEPTAR')
    fireEvent.click(acceptButton)

    await waitFor(() => {
      expect(mockUpload).toHaveBeenCalledWith(file)
      expect(defaultProps.onUploadSuccess).toHaveBeenCalled()
      expect(defaultProps.onClose).toHaveBeenCalled()
    })
  })

  it('handles upload errors', async () => {
    const mockUpload = vi.mocked(productsApi.uploadProductsCsv)
    mockUpload.mockRejectedValueOnce(new Error('Upload failed'))

    render(
      <TestWrapper>
        <FileUploadModal {...defaultProps} />
      </TestWrapper>
    )

    const file = new File(['test content'], 'test.csv', { type: 'text/csv' })
    const input = document.querySelector('input[type="file"]') as HTMLInputElement

    fireEvent.change(input, { target: { files: [file] } })

    const acceptButton = screen.getByText('ACEPTAR')
    fireEvent.click(acceptButton)

    await waitFor(() => {
      expect(screen.getByText(/Error al cargar el archivo/i)).toBeInTheDocument()
    })
  })

  it('closes modal when cancel is clicked', () => {
    render(
      <TestWrapper>
        <FileUploadModal {...defaultProps} />
      </TestWrapper>
    )

    const cancelButton = screen.getByText('CANCELAR')
    fireEvent.click(cancelButton)

    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('disables accept button when no file selected', () => {
    render(
      <TestWrapper>
        <FileUploadModal {...defaultProps} />
      </TestWrapper>
    )

    const acceptButton = screen.getByText('ACEPTAR')
    expect(acceptButton).toBeDisabled()
  })

  it('handles drag and drop', () => {
    render(
      <TestWrapper>
        <FileUploadModal {...defaultProps} />
      </TestWrapper>
    )

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
    render(
      <TestWrapper>
        <FileUploadModal {...defaultProps} />
      </TestWrapper>
    )

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
    render(
      <TestWrapper>
        <FileUploadModal {...defaultProps} />
      </TestWrapper>
    )

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
