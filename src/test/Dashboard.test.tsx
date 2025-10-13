import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import Dashboard from '../pages/Dashboard'
import theme from '../theme'

const ChakraWrapper = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider theme={theme}>{children}</ChakraProvider>
)

describe('Dashboard', () => {
  it('debería renderizar el título Dashboard', () => {
    render(<Dashboard />, { wrapper: ChakraWrapper })
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('debería mostrar las estadísticas correctas', () => {
    render(<Dashboard />, { wrapper: ChakraWrapper })
    
    expect(screen.getByText('Total Items')).toBeInTheDocument()
    expect(screen.getByText('1,024')).toBeInTheDocument()
    expect(screen.getByText('In inventory')).toBeInTheDocument()
    
    expect(screen.getByText('Low Stock Items')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('Below minimum threshold')).toBeInTheDocument()
    
    expect(screen.getByText('Pending Orders')).toBeInTheDocument()
    expect(screen.getByText('8')).toBeInTheDocument()
    expect(screen.getByText('Awaiting processing')).toBeInTheDocument()
  })

  it('debería renderizar todas las estadísticas', () => {
    render(<Dashboard />, { wrapper: ChakraWrapper })
    
    // Verificar que hay 3 estadísticas (StatNumber elements)
    const statNumbers = screen.getAllByRole('definition')
    expect(statNumbers.length).toBeGreaterThanOrEqual(3)
  })
})
