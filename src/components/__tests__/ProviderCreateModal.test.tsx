import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import ProviderCreateModal from '../ProviderCreateModal';
import { providersApi } from '../../services/api';

// Mock the API
vi.mock('../../services/api', () => ({
  providersApi: {
    createProvider: vi.fn(() => Promise.resolve({
      proveedor_id: 'new-id',
      razon_social: 'Test Provider',
      nit: '123456789',
      tipo_proveedor: 'distribuidor',
      email: 'test@test.com',
      telefono: '+57 1 234 5678',
      direccion: 'Test Address',
      ciudad: 'Bogotá',
      pais: 'colombia',
      certificaciones: [],
      estado: 'activo',
      validacion_regulatoria: 'en_revision',
      calificacion: null,
      tiempo_entrega_promedio: null,
      created_at: '2025-11-03T05:00:00.000000Z',
      updated_at: '2025-11-03T05:00:00.000000Z',
      version: 0,
    })),
  },
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>{children}</ChakraProvider>
    </QueryClientProvider>
  );
};

describe('ProviderCreateModal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal when open', () => {
    render(
      <TestWrapper>
        <ProviderCreateModal {...defaultProps} />
      </TestWrapper>
    );

    expect(screen.getByText('Creación de Proveedor')).toBeInTheDocument();
    expect(screen.getByLabelText(/Razón Social/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/NIT/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/País/i)).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <TestWrapper>
        <ProviderCreateModal {...defaultProps} isOpen={false} />
      </TestWrapper>
    );

    expect(screen.queryByText('Creación de Proveedor')).not.toBeInTheDocument();
  });

  it('has all required form fields', () => {
    render(
      <TestWrapper>
        <ProviderCreateModal {...defaultProps} />
      </TestWrapper>
    );

    expect(screen.getByLabelText(/Razón Social/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/NIT/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/País/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Tipo de Proveedor/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Ciudad/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Teléfono/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Dirección/i)).toBeInTheDocument();
    expect(screen.getByText(/¿Está Activo?/i)).toBeInTheDocument();
  });

  it('disables accept button when required fields are empty', () => {
    render(
      <TestWrapper>
        <ProviderCreateModal {...defaultProps} />
      </TestWrapper>
    );

    const acceptButton = screen.getByText('ACEPTAR');
    expect(acceptButton).toBeDisabled();
  });

  it('enables accept button when required fields are filled', () => {
    render(
      <TestWrapper>
        <ProviderCreateModal {...defaultProps} />
      </TestWrapper>
    );

    const razonSocialInput = screen.getByLabelText(/Razón Social/i);
    const nitInput = screen.getByLabelText(/NIT/i);

    fireEvent.change(razonSocialInput, { target: { value: 'Test Provider' } });
    fireEvent.change(nitInput, { target: { value: '123456789' } });

    const acceptButton = screen.getByText('ACEPTAR');
    expect(acceptButton).not.toBeDisabled();
  });

  it('submits form with correct data', async () => {
    const mockCreate = vi.mocked(providersApi.createProvider);

    render(
      <TestWrapper>
        <ProviderCreateModal {...defaultProps} />
      </TestWrapper>
    );

    const razonSocialInput = screen.getByLabelText(/Razón Social/i);
    const nitInput = screen.getByLabelText(/NIT/i);
    const emailInput = screen.getByLabelText(/Email/i);

    fireEvent.change(razonSocialInput, { target: { value: 'Test Provider' } });
    fireEvent.change(nitInput, { target: { value: '123456789' } });
    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });

    const acceptButton = screen.getByText('ACEPTAR');
    fireEvent.click(acceptButton);

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledOnce();
      const callArgs = mockCreate.mock.calls[0][0];
      expect(callArgs).toEqual({
        razon_social: 'Test Provider',
        nit: '123456789',
        tipo_proveedor: 'distribuidor',
        email: 'test@test.com',
        telefono: '',
        direccion: '',
        ciudad: '',
        pais: 'colombia',
        certificaciones: [],
        estado: 'activo',
        validacion_regulatoria: 'en_revision',
        calificacion: null,
        tiempo_entrega_promedio: null,
      });
    });
  });

  it('handles checkbox for active status', () => {
    render(
      <TestWrapper>
        <ProviderCreateModal {...defaultProps} />
      </TestWrapper>
    );

    const checkbox = screen.getByRole('checkbox', { name: /¿Está Activo?/i });
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it('closes modal when cancel is clicked', () => {
    render(
      <TestWrapper>
        <ProviderCreateModal {...defaultProps} />
      </TestWrapper>
    );

    const cancelButton = screen.getByText('CANCELAR');
    fireEvent.click(cancelButton);

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('handles form submission errors', async () => {
    const mockCreate = vi.mocked(providersApi.createProvider);
    mockCreate.mockRejectedValueOnce(new Error('Network error'));

    render(
      <TestWrapper>
        <ProviderCreateModal {...defaultProps} />
      </TestWrapper>
    );

    const razonSocialInput = screen.getByLabelText(/Razón Social/i);
    const nitInput = screen.getByLabelText(/NIT/i);

    fireEvent.change(razonSocialInput, { target: { value: 'Test Provider' } });
    fireEvent.change(nitInput, { target: { value: '123456789' } });

    const acceptButton = screen.getByText('ACEPTAR');
    fireEvent.click(acceptButton);

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalled();
    });
  });

  it('has correct default values', () => {
    render(
      <TestWrapper>
        <ProviderCreateModal {...defaultProps} />
      </TestWrapper>
    );

    const tipoSelect = screen.getByLabelText(/Tipo de Proveedor/i) as HTMLSelectElement;
    const paisSelect = screen.getByLabelText(/País/i) as HTMLSelectElement;

    expect(tipoSelect.value).toBe('distribuidor');
    expect(paisSelect.value).toBe('colombia');
  });

  it('allows changing tipo_proveedor select', () => {
    render(
      <TestWrapper>
        <ProviderCreateModal {...defaultProps} />
      </TestWrapper>
    );

    const tipoSelect = screen.getByLabelText(/Tipo de Proveedor/i) as HTMLSelectElement;

    fireEvent.change(tipoSelect, { target: { value: 'laboratorio' } });
    expect(tipoSelect.value).toBe('laboratorio');
  });

  it('allows changing país select', () => {
    render(
      <TestWrapper>
        <ProviderCreateModal {...defaultProps} />
      </TestWrapper>
    );

    const paisSelect = screen.getByLabelText(/País/i) as HTMLSelectElement;

    fireEvent.change(paisSelect, { target: { value: 'mexico' } });
    expect(paisSelect.value).toBe('mexico');
  });
});
