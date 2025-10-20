import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { vi } from 'vitest'
import Login from '../Login'

// Mock react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

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

describe('Login Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  it('renders login form elements', () => {
    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    )

    // Check that the form elements are present
    expect(screen.getByPlaceholderText('Value')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument()
  })

  it('shows validation errors for empty fields', async () => {
    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    )

    const submitButton = screen.getByRole('button', { name: /log in/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Please fill in all required fields')).toBeInTheDocument()
    })

    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('navigates to products page on successful login', async () => {
    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    )

    const usernameInput = screen.getByPlaceholderText('Value')
    const passwordInput = screen.getByPlaceholderText('••••••••')
    const submitButton = screen.getByRole('button', { name: /log in/i })

    fireEvent.change(usernameInput, { target: { value: 'testuser' } })
    fireEvent.change(passwordInput, { target: { value: 'testpass' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/products')
    })
  })

  it('displays loading state during login', async () => {
    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    )

    const usernameInput = screen.getByPlaceholderText('Value')
    const passwordInput = screen.getByPlaceholderText('••••••••')
    const submitButton = screen.getByRole('button', { name: /log in/i })

    fireEvent.change(usernameInput, { target: { value: 'testuser' } })
    fireEvent.change(passwordInput, { target: { value: 'testpass' } })
    fireEvent.click(submitButton)

    // Check if button shows loading state
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })
})
