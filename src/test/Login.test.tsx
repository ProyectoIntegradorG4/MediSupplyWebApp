import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import Login from '../pages/Login'
import theme from '../theme'

// Mock de react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </ChakraProvider>
    </QueryClientProvider>
  )
}

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debería renderizar el formulario de login', () => {
    render(<Login />, { wrapper: TestWrapper })
    
    expect(screen.getByText('Label')).toBeInTheDocument()
    expect(screen.getByText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'LOG IN' })).toBeInTheDocument()
  })

  it('debería mostrar errores cuando los campos están vacíos', async () => {
    render(<Login />, { wrapper: TestWrapper })
    
    const submitButton = screen.getByRole('button', { name: 'LOG IN' })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Username is required')).toBeInTheDocument()
      expect(screen.getByText('Password is required')).toBeInTheDocument()
    })
  })

  it('debería permitir escribir en los campos de entrada', () => {
    render(<Login />, { wrapper: TestWrapper })
    
    const usernameInput = screen.getByPlaceholderText('Value')
    const passwordInput = screen.getByPlaceholderText('••••••••')
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } })
    fireEvent.change(passwordInput, { target: { value: 'testpass' } })
    
    expect(usernameInput).toHaveValue('testuser')
    expect(passwordInput).toHaveValue('testpass')
  })

  it('debería navegar a /products cuando el login es exitoso', async () => {
    render(<Login />, { wrapper: TestWrapper })
    
    const usernameInput = screen.getByPlaceholderText('Value')
    const passwordInput = screen.getByPlaceholderText('••••••••')
    const submitButton = screen.getByRole('button', { name: 'LOG IN' })
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } })
    fireEvent.change(passwordInput, { target: { value: 'testpass' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/products')
    }, { timeout: 2000 })
  })

  it('debería mostrar estado de carga durante el submit', async () => {
    render(<Login />, { wrapper: TestWrapper })
    
    const usernameInput = screen.getByPlaceholderText('Value')
    const passwordInput = screen.getByPlaceholderText('••••••••')
    const submitButton = screen.getByRole('button', { name: 'LOG IN' })
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } })
    fireEvent.change(passwordInput, { target: { value: 'testpass' } })
    fireEvent.click(submitButton)
    
    // Verificar que el botón está en estado de carga
    expect(submitButton).toBeDisabled()
  })

})
