import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import FileUploadModal from '../components/FileUploadModal'
import theme from '../theme'
import axios from 'axios'

// Mock de axios
vi.mock('axios')
const mockedAxios = vi.mocked(axios, true)

const ChakraWrapper = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider theme={theme}>{children}</ChakraProvider>
)

describe('FileUploadModal', () => {
  const mockOnClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debería renderizar el modal cuando está abierto', () => {
    render(<FileUploadModal isOpen={true} onClose={mockOnClose} />, { wrapper: ChakraWrapper })
    
    expect(screen.getByText('Carga de Archivos')).toBeInTheDocument()
    expect(screen.getByText('Por favor seleccione el archivo para la carga másiva en formato .csv y con un tamaño no mayor a 3MB.')).toBeInTheDocument()
  })

  it('no debería renderizar el modal cuando está cerrado', () => {
    render(<FileUploadModal isOpen={false} onClose={mockOnClose} />, { wrapper: ChakraWrapper })
    
    expect(screen.queryByText('Carga de Archivos')).not.toBeInTheDocument()
  })

  it('debería permitir seleccionar un archivo CSV válido', () => {
    render(<FileUploadModal isOpen={true} onClose={mockOnClose} />, { wrapper: ChakraWrapper })
    
    const fileInput = screen.getByDisplayValue('')
    const file = new File(['test,data'], 'test.csv', { type: 'text/csv' })
    
    fireEvent.change(fileInput, { target: { files: [file] } })
    
    expect(screen.getByText('test.csv')).toBeInTheDocument()
  })

  it('debería mostrar error para archivos que no son CSV', async () => {
    render(<FileUploadModal isOpen={true} onClose={mockOnClose} />, { wrapper: ChakraWrapper })
    
    const fileInput = screen.getByDisplayValue('')
    const file = new File(['test'], 'test.txt', { type: 'text/plain' })
    
    fireEvent.change(fileInput, { target: { files: [file] } })
    
    await waitFor(() => {
      expect(screen.getByText('Solo se permiten archivos CSV')).toBeInTheDocument()
    })
  })

  it('debería mostrar error para archivos muy grandes', async () => {
    render(<FileUploadModal isOpen={true} onClose={mockOnClose} />, { wrapper: ChakraWrapper })
    
    const fileInput = screen.getByDisplayValue('')
    // Crear un archivo de más de 3MB
    const largeFile = new File(['x'.repeat(4 * 1024 * 1024)], 'large.csv', { type: 'text/csv' })
    
    fireEvent.change(fileInput, { target: { files: [largeFile] } })
    
    await waitFor(() => {
      expect(screen.getByText('El archivo no debe superar los 3MB')).toBeInTheDocument()
    })
  })

  it('debería cerrar el modal al hacer clic en cancelar', () => {
    render(<FileUploadModal isOpen={true} onClose={mockOnClose} />, { wrapper: ChakraWrapper })
    
    const cancelButton = screen.getByText('CANCELAR')
    fireEvent.click(cancelButton)
    
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('debería mostrar botón de cargar solo cuando hay un archivo seleccionado', () => {
    render(<FileUploadModal isOpen={true} onClose={mockOnClose} />, { wrapper: ChakraWrapper })
    
    // Inicialmente no debería haber botón de cargar
    expect(screen.queryByText('ACEPTAR')).toBeInTheDocument()
    
    // Después de seleccionar un archivo, debería aparecer
    const fileInput = screen.getByDisplayValue('')
    const file = new File(['test,data'], 'test.csv', { type: 'text/csv' })
    
    fireEvent.change(fileInput, { target: { files: [file] } })
    
    expect(screen.getByText('ACEPTAR')).toBeInTheDocument()
  })

  it('debería manejar la carga exitosa del archivo', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { message: 'Archivo cargado exitosamente' } })
    
    render(<FileUploadModal isOpen={true} onClose={mockOnClose} />, { wrapper: ChakraWrapper })
    
    const fileInput = screen.getByDisplayValue('')
    const file = new File(['test,data'], 'test.csv', { type: 'text/csv' })
    
    fireEvent.change(fileInput, { target: { files: [file] } })
    
    const uploadButton = screen.getByText('ACEPTAR')
    fireEvent.click(uploadButton)
    
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalled()
    })
  })

  it('debería manejar errores en la carga del archivo', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('Error de red'))
    
    render(<FileUploadModal isOpen={true} onClose={mockOnClose} />, { wrapper: ChakraWrapper })
    
    const fileInput = screen.getByDisplayValue('')
    const file = new File(['test,data'], 'test.csv', { type: 'text/csv' })
    
    fireEvent.change(fileInput, { target: { files: [file] } })
    
    const uploadButton = screen.getByText('ACEPTAR')
    fireEvent.click(uploadButton)
    
    await waitFor(() => {
      expect(screen.getByText('Error al cargar el archivo')).toBeInTheDocument()
    })
  })
})
