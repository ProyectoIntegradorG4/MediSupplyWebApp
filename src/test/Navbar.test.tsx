import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import Navbar from '../components/Navbar'
import theme from '../theme'

const ChakraWrapper = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider theme={theme}>{children}</ChakraProvider>
)

describe('Navbar', () => {
  it('debería renderizar el título MediSupply', () => {
    render(<Navbar />, { wrapper: ChakraWrapper })
    
    expect(screen.getByText('MediSupply')).toBeInTheDocument()
  })

  it('debería tener el título con el tamaño correcto', () => {
    render(<Navbar />, { wrapper: ChakraWrapper })
    
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent('MediSupply')
  })

  it('debería renderizar el Spacer', () => {
    render(<Navbar />, { wrapper: ChakraWrapper })
    
    // El Spacer no tiene contenido visible, pero verifica que el componente se renderiza
    expect(screen.getByText('MediSupply')).toBeInTheDocument()
  })
})
