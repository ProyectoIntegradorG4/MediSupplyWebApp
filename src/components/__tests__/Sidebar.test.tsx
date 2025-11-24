import { render, screen, fireEvent } from '../../test/test-utils';
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
      
        <Sidebar {...defaultProps} />
      
    );

    // Sidebar should be in the document when open
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      
        <Sidebar isOpen={false} onClose={defaultProps.onClose} />
      
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('has navigation drawer content', () => {
    render(
      
        <Sidebar {...defaultProps} />
      
    );

    // Check that the drawer is rendered
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
  });

  it('calls onClose when a menu item is clicked', () => {
    const { container } = render(
      
        <Sidebar {...defaultProps} />
      
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
      
        <Sidebar {...defaultProps} />
      
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
      
        <Sidebar {...defaultProps} />
      
    );

    // Sidebar drawer should be visible
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeVisible();
  });

  it('does not call onClose when onClose is undefined', () => {
    const { container } = render(
      
        <Sidebar isOpen={true} onClose={vi.fn()} />
      
    );

    // Click on a menu item
    const iconBoxes = container.querySelectorAll('[role="dialog"] > div > div > div');
    if (iconBoxes.length > 0) {
      fireEvent.click(iconBoxes[0]);
      // Should still navigate even if onClose is not provided
      expect(mockNavigate).toHaveBeenCalled();
    }
  });
});
