import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import Layout from '../components/Layout'
import theme from '../theme'

const ChakraWrapper = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider theme={theme}>{children}</ChakraProvider>
)

describe('Layout', () => {
  it('debería renderizar el navbar y el contenido', () => {
    render(
      <Layout>
        <div data-testid="test-content">Contenido de prueba</div>
      </Layout>,
      { wrapper: ChakraWrapper }
    )
    
    expect(screen.getByText('MediSupply')).toBeInTheDocument()
    expect(screen.getByTestId('test-content')).toBeInTheDocument()
  })

  it('debería renderizar múltiples elementos hijos', () => {
    render(
      <Layout>
        <div data-testid="child-1">Hijo 1</div>
        <div data-testid="child-2">Hijo 2</div>
      </Layout>,
      { wrapper: ChakraWrapper }
    )
    
    expect(screen.getByTestId('child-1')).toBeInTheDocument()
    expect(screen.getByTestId('child-2')).toBeInTheDocument()
  })

  it('debería renderizar sin hijos', () => {
    render(<Layout>{null}</Layout>, { wrapper: ChakraWrapper })
    
    expect(screen.getByText('MediSupply')).toBeInTheDocument()
  })
})
