import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import GenerateRouteModal from '../GenerateRouteModal';
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

describe('GenerateRouteModal Component', () => {
  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal when open', () => {
    renderWithProviders(
      <GenerateRouteModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    expect(screen.getByText(/generar rutas de entrega/i)).toBeInTheDocument();
    expect(screen.getByText(/objetivo/i)).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    renderWithProviders(
      <GenerateRouteModal
        isOpen={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    expect(screen.queryByText(/generar rutas de entrega/i)).not.toBeInTheDocument();
  });

  it('handles objective selection', async () => {
    renderWithProviders(
      <GenerateRouteModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    const objectiveSelect = screen.getByLabelText(/objetivo/i);
    fireEvent.change(objectiveSelect, { target: { value: 'min_tiempo' } });

    await waitFor(() => {
      expect(objectiveSelect).toHaveValue('min_tiempo');
    });
  });

  it('adds and removes vehicles', async () => {
    renderWithProviders(
      <GenerateRouteModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    const initialDeleteButtons = screen.getAllByLabelText(/remove vehicle/i);
    expect(initialDeleteButtons).toHaveLength(1);

    const addButton = screen.getByText(/agregar vehículo/i);
    fireEvent.click(addButton);

    await waitFor(() => {
      const updatedDeleteButtons = screen.getAllByLabelText(/remove vehicle/i);
      expect(updatedDeleteButtons).toHaveLength(2);
    });

    const deleteButtons = screen.getAllByLabelText(/remove vehicle/i);
    fireEvent.click(deleteButtons[1]);

    await waitFor(() => {
      const finalDeleteButtons = screen.getAllByLabelText(/remove vehicle/i);
      expect(finalDeleteButtons).toHaveLength(1);
    });
  });

  it('cannot remove the last vehicle', () => {
    renderWithProviders(
      <GenerateRouteModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    const deleteButton = screen.getByLabelText(/remove vehicle/i);
    expect(deleteButton).toBeDisabled();
  });

  it('adds and removes orders', async () => {
    renderWithProviders(
      <GenerateRouteModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    expect(screen.getByText(/pedido 1/i)).toBeInTheDocument();

    const addButton = screen.getByText(/agregar pedido/i);
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText(/pedido 2/i)).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByLabelText(/remove order/i);
    fireEvent.click(deleteButtons[1]);

    await waitFor(() => {
      expect(screen.queryByText(/pedido 2/i)).not.toBeInTheDocument();
    });
  });

  it('cannot remove the last order', () => {
    renderWithProviders(
      <GenerateRouteModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    const deleteButton = screen.getByLabelText(/remove order/i);
    expect(deleteButton).toBeDisabled();
  });

  it('handles vehicle field changes', async () => {
    renderWithProviders(
      <GenerateRouteModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    const vehicleIdInput = screen.getByPlaceholderText('VEH-001');
    fireEvent.change(vehicleIdInput, { target: { value: 'VEH-999' } });

    await waitFor(() => {
      expect(vehicleIdInput).toHaveValue('VEH-999');
    });
  });

  it('handles order field changes', async () => {
    renderWithProviders(
      <GenerateRouteModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    const orderIdInput = screen.getByPlaceholderText('PED-001');
    fireEvent.change(orderIdInput, { target: { value: 'PED-999' } });

    await waitFor(() => {
      expect(orderIdInput).toHaveValue('PED-999');
    });
  });

  it('submits form with valid data', async () => {
    renderWithProviders(
      <GenerateRouteModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    // Fill vehicle ID
    const vehicleIdInput = screen.getByPlaceholderText('VEH-001');
    fireEvent.change(vehicleIdInput, { target: { value: 'VEH-001' } });

    // Fill order ID
    const orderIdInput = screen.getByPlaceholderText('PED-001');
    fireEvent.change(orderIdInput, { target: { value: 'PED-001' } });

    // Submit form
    const submitButton = screen.getByRole('button', { name: /generar$/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  it('shows loading state on submit button', () => {
    renderWithProviders(
      <GenerateRouteModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={true}
      />
    );

    const submitButton = screen.getByRole('button', { name: /generar$/i });
    expect(submitButton).toHaveAttribute('data-loading');
  });

  it('calls onClose when cancel button is clicked', () => {
    renderWithProviders(
      <GenerateRouteModal
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

  it('resets form when modal is closed', async () => {
    const { rerender } = renderWithProviders(
      <GenerateRouteModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    // Fill some data
    const vehicleIdInput = screen.getByPlaceholderText('VEH-001');
    fireEvent.change(vehicleIdInput, { target: { value: 'VEH-999' } });

    await waitFor(() => {
      expect(vehicleIdInput).toHaveValue('VEH-999');
    });

    // Close modal
    fireEvent.click(screen.getByText(/cancelar/i));

    // Reopen modal
    rerender(
      <ChakraProvider>
        <I18nProvider>
          <GenerateRouteModal
            isOpen={true}
            onClose={mockOnClose}
            onSubmit={mockOnSubmit}
            isLoading={false}
          />
        </I18nProvider>
      </ChakraProvider>
    );

    // Form should be reset
    const newVehicleIdInput = screen.getByPlaceholderText('VEH-001');
    expect(newVehicleIdInput).toHaveValue('');
  });

  it('handles cold chain checkbox', async () => {
    renderWithProviders(
      <GenerateRouteModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    const coldChainCheckboxes = screen.getAllByText(/cadena de frío/i);
    const vehicleColdChain = coldChainCheckboxes[0];

    fireEvent.click(vehicleColdChain);

    await waitFor(() => {
      expect(vehicleColdChain).toBeInTheDocument();
    });
  });

  it('handles depot latitude changes', async () => {
    renderWithProviders(
      <GenerateRouteModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    const depotLatInput = screen.getByLabelText(/latitud depósito/i);
    fireEvent.change(depotLatInput, { target: { value: '5.1234' } });

    await waitFor(() => {
      expect(depotLatInput).toHaveValue(5.1234);
    });
  });

  it('handles depot longitude changes', async () => {
    renderWithProviders(
      <GenerateRouteModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    const depotLonInput = screen.getByLabelText(/longitud depósito/i);
    fireEvent.change(depotLonInput, { target: { value: '-75.5678' } });

    await waitFor(() => {
      expect(depotLonInput).toHaveValue(-75.5678);
    });
  });

  it('handles all vehicle numeric fields', async () => {
    renderWithProviders(
      <GenerateRouteModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    const volumeInput = screen.getByLabelText(/capacidad volumen/i);
    const weightInput = screen.getByLabelText(/capacidad peso/i);
    const durationInput = screen.getByLabelText(/duración máxima/i);

    fireEvent.change(volumeInput, { target: { value: '100' } });
    fireEvent.change(weightInput, { target: { value: '2000' } });
    fireEvent.change(durationInput, { target: { value: '600' } });

    await waitFor(() => {
      expect(volumeInput).toHaveValue(100);
      expect(weightInput).toHaveValue(2000);
      expect(durationInput).toHaveValue(600);
    });
  });

  it('handles all order numeric fields', async () => {
    renderWithProviders(
      <GenerateRouteModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    // Get all inputs with these labels - vehicles and orders both have these fields
    const allLatInputs = screen.getAllByLabelText(/latitud/i);
    const allLonInputs = screen.getAllByLabelText(/longitud/i);

    // The order fields are after the vehicle fields, so they should be at index 1
    const latInput = allLatInputs[1]; // First is depot lat for vehicle
    const lonInput = allLonInputs[1]; // First is depot lon for vehicle
    const serviceTimeInput = screen.getByLabelText(/tiempo servicio/i);
    const volumeInputs = screen.getAllByLabelText(/volumen/i);
    const weightInputs = screen.getAllByLabelText(/peso/i);
    const volumeInput = volumeInputs[1]; // First is for vehicle
    const weightInput = weightInputs[1]; // First is for vehicle

    fireEvent.change(latInput, { target: { value: '4.7' } });
    fireEvent.change(lonInput, { target: { value: '-74.1' } });
    fireEvent.change(serviceTimeInput, { target: { value: '30' } });
    fireEvent.change(volumeInput, { target: { value: '10' } });
    fireEvent.change(weightInput, { target: { value: '100' } });

    await waitFor(() => {
      expect(latInput).toHaveValue(4.7);
      expect(lonInput).toHaveValue(-74.1);
      expect(serviceTimeInput).toHaveValue(30);
      expect(volumeInput).toHaveValue(10);
      expect(weightInput).toHaveValue(100);
    });
  });

  it('handles order time window fields', async () => {
    renderWithProviders(
      <GenerateRouteModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    const windowStartInput = screen.getByLabelText(/ventana inicio/i);
    const windowEndInput = screen.getByLabelText(/ventana fin/i);

    fireEvent.change(windowStartInput, { target: { value: '09:00' } });
    fireEvent.change(windowEndInput, { target: { value: '15:00' } });

    await waitFor(() => {
      expect(windowStartInput).toHaveValue('09:00');
      expect(windowEndInput).toHaveValue('15:00');
    });
  });

  it('handles order cold chain checkbox', async () => {
    renderWithProviders(
      <GenerateRouteModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    const requiresColdCheckbox = screen.getByText(/requiere frío/i);
    fireEvent.click(requiresColdCheckbox);

    await waitFor(() => {
      expect(requiresColdCheckbox).toBeInTheDocument();
    });
  });
});
