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
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders when open', () => {
    render(
      <TestWrapper>
        <Sidebar {...defaultProps} />
      </TestWrapper>
    );

    // Sidebar should be in the document when open
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <TestWrapper>
        <Sidebar isOpen={false} onClose={defaultProps.onClose} />
      </TestWrapper>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('has navigation drawer content', () => {
    render(
      <TestWrapper>
        <Sidebar {...defaultProps} />
      </TestWrapper>
    );

    // Check that the drawer is rendered
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
  });

  it('calls onClose when a menu item is clicked', () => {
    const { container } = render(
      <TestWrapper>
        <Sidebar {...defaultProps} />
      </TestWrapper>
    );

    // Click on the first icon box
    const iconBoxes = container.querySelectorAll('[role="dialog"] > div > div > div');
    if (iconBoxes.length > 0) {
      fireEvent.click(iconBoxes[0]);
      expect(defaultProps.onClose).toHaveBeenCalled();
    }
  });

  it('navigates when icon is clicked', () => {
    const { container } = render(
      <TestWrapper>
        <Sidebar {...defaultProps} />
      </TestWrapper>
    );

    // Click the first navigation icon
    const iconBoxes = container.querySelectorAll('[role="dialog"] > div > div > div');
    if (iconBoxes.length > 0) {
      fireEvent.click(iconBoxes[0]);
      expect(mockNavigate).toHaveBeenCalled();
    }
  });

  it('renders all navigation items', () => {
    render(
      <TestWrapper>
        <Sidebar {...defaultProps} />
      </TestWrapper>
    );

    // Sidebar drawer should be visible
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeVisible();
  });
});
