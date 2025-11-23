import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import CreateSalesPlanModal from '../CreateSalesPlanModal';
import { I18nProvider } from '../../i18n/I18nProvider';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ChakraProvider>
      <I18nProvider>
        {component}
      </I18nProvider>
    </ChakraProvider>
  );
};

describe('CreateSalesPlanModal Component', () => {
  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal when open', () => {
    renderWithProviders(
      <CreateSalesPlanModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    expect(screen.getByText(/crear plan de ventas/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nombre del plan/i)).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    renderWithProviders(
      <CreateSalesPlanModal
        isOpen={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    expect(screen.queryByText(/crear plan de ventas/i)).not.toBeInTheDocument();
  });

  it('handles form input changes', async () => {
    renderWithProviders(
      <CreateSalesPlanModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    const nameInput = screen.getByLabelText(/nombre del plan/i);
    fireEvent.change(nameInput, { target: { value: 'Plan Q1 2026' } });

    await waitFor(() => {
      expect(nameInput).toHaveValue('Plan Q1 2026');
    });
  });

  it('handles period date changes', async () => {
    renderWithProviders(
      <CreateSalesPlanModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    const startDateInput = screen.getByLabelText(/fecha de inicio/i);
    const endDateInput = screen.getByLabelText(/fecha de fin/i);

    fireEvent.change(startDateInput, { target: { value: '2026-01-01' } });
    fireEvent.change(endDateInput, { target: { value: '2026-03-31' } });

    await waitFor(() => {
      expect(startDateInput).toHaveValue('2026-01-01');
      expect(endDateInput).toHaveValue('2026-03-31');
    });
  });

  it('adds and removes territories', async () => {
    renderWithProviders(
      <CreateSalesPlanModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    // Initially should have 1 territory delete button
    const initialDeleteButtons = screen.getAllByLabelText(/remove territory/i);
    expect(initialDeleteButtons).toHaveLength(1);

    // Click add territory button
    const addButton = screen.getByText(/agregar territorio/i);
    fireEvent.click(addButton);

    await waitFor(() => {
      const updatedDeleteButtons = screen.getAllByLabelText(/remove territory/i);
      expect(updatedDeleteButtons).toHaveLength(2);
    });

    // Remove territory
    const deleteButtons = screen.getAllByLabelText(/remove territory/i);
    fireEvent.click(deleteButtons[1]);

    await waitFor(() => {
      const finalDeleteButtons = screen.getAllByLabelText(/remove territory/i);
      expect(finalDeleteButtons).toHaveLength(1);
    });
  });

  it('cannot remove the last territory', () => {
    renderWithProviders(
      <CreateSalesPlanModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    const deleteButton = screen.getByLabelText(/remove territory/i);
    expect(deleteButton).toBeDisabled();
  });

  it('adds and removes goals', async () => {
    renderWithProviders(
      <CreateSalesPlanModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    // Initially should have 1 goal
    expect(screen.getByText(/meta 1/i)).toBeInTheDocument();

    // Click add goal button
    const addButton = screen.getByText(/agregar meta/i);
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText(/meta 2/i)).toBeInTheDocument();
    });

    // Remove goal
    const deleteButtons = screen.getAllByLabelText(/remove goal/i);
    fireEvent.click(deleteButtons[1]);

    await waitFor(() => {
      expect(screen.queryByText(/meta 2/i)).not.toBeInTheDocument();
    });
  });

  it('cannot remove the last goal', () => {
    renderWithProviders(
      <CreateSalesPlanModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    const deleteButton = screen.getByLabelText(/remove goal/i);
    expect(deleteButton).toBeDisabled();
  });

  it('handles goal field changes', async () => {
    renderWithProviders(
      <CreateSalesPlanModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    const productIdInput = screen.getByLabelText(/id producto/i);
    const territoryIdInput = screen.getByLabelText(/id territorio/i);
    const sellerIdInput = screen.getByLabelText(/id vendedor/i);
    const quantityInput = screen.getByLabelText(/cantidad objetivo/i);
    const valueInput = screen.getByLabelText(/valor objetivo/i);

    fireEvent.change(productIdInput, { target: { value: 'P008' } });
    fireEvent.change(territoryIdInput, { target: { value: 'TERR-BOGOTA' } });
    fireEvent.change(sellerIdInput, { target: { value: '5' } });
    fireEvent.change(quantityInput, { target: { value: '200' } });
    fireEvent.change(valueInput, { target: { value: '100000' } });

    await waitFor(() => {
      expect(productIdInput).toHaveValue('P008');
      expect(territoryIdInput).toHaveValue('TERR-BOGOTA');
      expect(sellerIdInput).toHaveValue('5');
      expect(quantityInput).toHaveValue(200);
      expect(valueInput).toHaveValue(100000);
    });
  });

  it('submits form with valid data', async () => {
    renderWithProviders(
      <CreateSalesPlanModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    // Fill in required fields
    fireEvent.change(screen.getByLabelText(/nombre del plan/i), {
      target: { value: 'Plan Q1 2026' },
    });
    fireEvent.change(screen.getByLabelText(/fecha de inicio/i), {
      target: { value: '2026-01-01' },
    });
    fireEvent.change(screen.getByLabelText(/fecha de fin/i), {
      target: { value: '2026-03-31' },
    });

    // Fill in territory - use the first input with placeholder
    const territorioInputs = screen.getAllByPlaceholderText(/TERR-ANTIOQUIA/i);
    fireEvent.change(territorioInputs[0], { target: { value: 'TERR-ANTIOQUIA' } });

    // Fill in goal fields using labels
    fireEvent.change(screen.getByLabelText(/id producto/i), {
      target: { value: 'P008' },
    });
    fireEvent.change(screen.getByLabelText(/id territorio/i), {
      target: { value: 'TERR-ANTIOQUIA' },
    });
    fireEvent.change(screen.getByLabelText(/id vendedor/i), {
      target: { value: '1' },
    });
    fireEvent.change(screen.getByLabelText(/cantidad objetivo/i), {
      target: { value: '100' },
    });
    fireEvent.change(screen.getByLabelText(/valor objetivo/i), {
      target: { value: '50000' },
    });

    // Submit form
    const submitButton = screen.getByRole('button', { name: /crear$/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        nombre: 'Plan Q1 2026',
        periodo: {
          desde: '2026-01-01',
          hasta: '2026-03-31',
        },
        territorios: ['TERR-ANTIOQUIA'],
        metas: [
          {
            productoId: 'P008',
            territorioId: 'TERR-ANTIOQUIA',
            vendedorId: '1',
            objetivo_cantidad: 100,
            objetivo_valor: 50000,
            nota: '',
          },
        ],
      });
    });
  });

  it('shows loading state on submit button', () => {
    renderWithProviders(
      <CreateSalesPlanModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={true}
      />
    );

    const submitButton = screen.getByRole('button', { name: /crear$/i });
    expect(submitButton).toHaveAttribute('data-loading');
  });

  it('calls onClose when cancel button is clicked', () => {
    renderWithProviders(
      <CreateSalesPlanModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    const cancelButton = screen.getByText(/cancelar/i);
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('resets form when modal is closed and reopened', async () => {
    const { rerender } = renderWithProviders(
      <CreateSalesPlanModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    // Fill in some data
    const nameInput = screen.getByLabelText(/nombre del plan/i);
    fireEvent.change(nameInput, { target: { value: 'Test Plan' } });

    await waitFor(() => {
      expect(nameInput).toHaveValue('Test Plan');
    });

    // Close modal
    fireEvent.click(screen.getByText(/cancelar/i));

    // Reopen modal
    rerender(
      <ChakraProvider>
        <I18nProvider>
          <CreateSalesPlanModal
            isOpen={true}
            onClose={mockOnClose}
            onSubmit={mockOnSubmit}
            isLoading={false}
          />
        </I18nProvider>
      </ChakraProvider>
    );

    // Form should be reset
    const newNameInput = screen.getByLabelText(/nombre del plan/i);
    expect(newNameInput).toHaveValue('');
  });

  it('handles note field in goals', async () => {
    renderWithProviders(
      <CreateSalesPlanModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    const noteInputs = screen.getAllByPlaceholderText(/meta q1 2026/i);
    fireEvent.change(noteInputs[0], { target: { value: 'Important goal' } });

    await waitFor(() => {
      expect(noteInputs[0]).toHaveValue('Important goal');
    });
  });

  it('handles territory field changes', async () => {
    renderWithProviders(
      <CreateSalesPlanModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    const territoryInputs = screen.getAllByPlaceholderText(/TERR-ANTIOQUIA/i);
    fireEvent.change(territoryInputs[0], { target: { value: 'TERR-CUNDINAMARCA' } });

    await waitFor(() => {
      expect(territoryInputs[0]).toHaveValue('TERR-CUNDINAMARCA');
    });
  });
});
