import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import Sellers from '../pages/Sellers'
import theme from '../theme'

const ChakraWrapper = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider theme={theme}>{children}</ChakraProvider>
)

describe('Sellers', () => {
  it('debería renderizar el título y la tabla de vendedores', () => {
    render(<Sellers />, { wrapper: ChakraWrapper })
    
    expect(screen.getByText('Información de Vendedores')).toBeInTheDocument()
    expect(screen.getByText('Fernando Torres')).toBeInTheDocument()
    expect(screen.getByText('Maximiliano Rodriguez')).toBeInTheDocument()
  })

  it('debería mostrar todos los vendedores iniciales', () => {
    render(<Sellers />, { wrapper: ChakraWrapper })
    
    expect(screen.getByText('Fernando Torres')).toBeInTheDocument()
    expect(screen.getByText('Luis Diaz')).toBeInTheDocument()
    expect(screen.getByText('José Reina')).toBeInTheDocument()
    expect(screen.getByText('Luis Suárez')).toBeInTheDocument()
    expect(screen.getByText('José Enrique')).toBeInTheDocument()
    expect(screen.getByText('Sebastián Coates')).toBeInTheDocument()
    expect(screen.getByText('Darwin Núñez')).toBeInTheDocument()
  })

  it('debería filtrar vendedores por nombre', () => {
    render(<Sellers />, { wrapper: ChakraWrapper })
    
    const searchInput = screen.getByPlaceholderText('Buscar')
    fireEvent.change(searchInput, { target: { value: 'Fernando' } })
    
    expect(screen.getByText('Fernando Torres')).toBeInTheDocument()
    expect(screen.queryByText('Maximiliano Rodriguez')).not.toBeInTheDocument()
  })

  it('debería mostrar el botón de carga de plan de ventas', () => {
    render(<Sellers />, { wrapper: ChakraWrapper })
    
    expect(screen.getByRole('button', { name: 'CARGA DE PLAN DE VENTAS' })).toBeInTheDocument()
  })

  it('debería mostrar los encabezados de la tabla', () => {
    render(<Sellers />, { wrapper: ChakraWrapper })
    
    expect(screen.getByText('ID')).toBeInTheDocument()
    expect(screen.getByText('Nombre')).toBeInTheDocument()
    expect(screen.getByText('País')).toBeInTheDocument()
    expect(screen.getByText('Meta de Ventas')).toBeInTheDocument()
    expect(screen.getByText('Rendimiento')).toBeInTheDocument()
  })

  it('debería mostrar los datos de los vendedores en la tabla', () => {
    render(<Sellers />, { wrapper: ChakraWrapper })
    
    // Verificar algunos datos específicos
    expect(screen.getByText('123')).toBeInTheDocument() // ID de Fernando Torres
    expect(screen.getAllByText('España')).toHaveLength(3) // Hay 3 vendedores de España
    expect(screen.getByText('15,000')).toBeInTheDocument() // Meta de ventas
    expect(screen.getByText('50%')).toBeInTheDocument() // Rendimiento
  })

  it('debería permitir cambiar el número de filas por página', () => {
    render(<Sellers />, { wrapper: ChakraWrapper })
    
    const select = screen.getByDisplayValue('10')
    fireEvent.change(select, { target: { value: '20' } })
    
    expect(select).toHaveValue('20')
  })

  it('debería mostrar información de paginación', () => {
    render(<Sellers />, { wrapper: ChakraWrapper })
    
    expect(screen.getByText('Rows per page:')).toBeInTheDocument()
    expect(screen.getByText('1-5 of 13')).toBeInTheDocument()
  })
})
