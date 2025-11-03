import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { vi } from 'vitest';
import Sidebar from '../Sidebar';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/dashboard' }),
  };
});

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <ChakraProvider>{children}</ChakraProvider>
    </BrowserRouter>
  );
};

describe('Sidebar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all navigation items on desktop', () => {
    render(
      <TestWrapper>
        <Sidebar />
      </TestWrapper>
    );

    // Check that all nav items are present (visible on desktop)
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Inventory')).toBeInTheDocument();
    expect(screen.getByText('Delivery')).toBeInTheDocument();
    expect(screen.getByText('People')).toBeInTheDocument();
    expect(screen.getByText('Supplies')).toBeInTheDocument();
    expect(screen.getByText('Reports')).toBeInTheDocument();
  });

  it('navigates to correct route when menu item is clicked', () => {
    render(
      <TestWrapper>
        <Sidebar />
      </TestWrapper>
    );

    const inventoryLink = screen.getByText('Inventory');
    fireEvent.click(inventoryLink);

    expect(mockNavigate).toHaveBeenCalledWith('/products');
  });

  it('navigates to dashboard when Home is clicked', () => {
    render(
      <TestWrapper>
        <Sidebar />
      </TestWrapper>
    );

    const homeLink = screen.getByText('Home');
    fireEvent.click(homeLink);

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('navigates to providers when Supplies is clicked', () => {
    render(
      <TestWrapper>
        <Sidebar />
      </TestWrapper>
    );

    const suppliesLink = screen.getByText('Supplies');
    fireEvent.click(suppliesLink);

    expect(mockNavigate).toHaveBeenCalledWith('/providers');
  });

  it('navigates to delivery when Delivery is clicked', () => {
    render(
      <TestWrapper>
        <Sidebar />
      </TestWrapper>
    );

    const deliveryLink = screen.getByText('Delivery');
    fireEvent.click(deliveryLink);

    expect(mockNavigate).toHaveBeenCalledWith('/delivery');
  });

  it('navigates to people when People is clicked', () => {
    render(
      <TestWrapper>
        <Sidebar />
      </TestWrapper>
    );

    const peopleLink = screen.getByText('People');
    fireEvent.click(peopleLink);

    expect(mockNavigate).toHaveBeenCalledWith('/people');
  });

  it('navigates to reports when Reports is clicked', () => {
    render(
      <TestWrapper>
        <Sidebar />
      </TestWrapper>
    );

    const reportsLink = screen.getByText('Reports');
    fireEvent.click(reportsLink);

    expect(mockNavigate).toHaveBeenCalledWith('/reports');
  });
});
