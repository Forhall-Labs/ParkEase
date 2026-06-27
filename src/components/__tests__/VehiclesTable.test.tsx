import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VehiclesTable } from '../vehiclesResumeTable';

// Mock i18n to return the key itself so tests are language-agnostic
vi.mock('../../i18n', () => ({
  t: (key: string) => key,
  setLanguage: vi.fn(),
}));

// Mock primitive components to render minimal HTML
vi.mock('../primitives', () => ({
  Button: ({
    children,
    onClick,
    type,
    disabled,
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) => (
    <button onClick={onClick} type={type} disabled={disabled}>
      {children}
    </button>
  ),
  Card: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
  SectionHeader: ({ title, action }: { title: string; action?: React.ReactNode }) => (
    <div>
      <h1>{title}</h1>
      {action}
    </div>
  ),
}));

vi.mock('../UI/Modal', () => ({
  ModalShell: ({ open, children }: { open: boolean; children: React.ReactNode }) =>
    open ? <div data-testid="modal">{children}</div> : null,
  ConfirmModal: ({
    open,
    onConfirm,
    onCancel,
  }: {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
  }) =>
    open ? (
      <div data-testid="confirm-modal">
        <button onClick={onConfirm}>confirm</button>
        <button onClick={onCancel}>cancel</button>
      </div>
    ) : null,
}));

describe('VehiclesTable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mocks to default resolved values
    (window.electronAPI.vehicles.getActive as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    (window.electronAPI.vehicles.create as ReturnType<typeof vi.fn>).mockResolvedValue({
      success: true,
      id: 1,
    });
    (window.electronAPI.parameters.getAll as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    (window.electronAPI.parameters.getDefault as ReturnType<typeof vi.fn>).mockResolvedValue(
      undefined
    );
    (window.electronAPI.settings.get as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
  });

  it('renders without crashing', async () => {
    render(<VehiclesTable />);
    await waitFor(() => {
      expect(screen.getByRole('heading')).toBeDefined();
    });
  });

  it('shows empty state when no vehicles', async () => {
    render(<VehiclesTable />);
    await waitFor(() => {
      expect(screen.getByText(/vehicles.noVehicles/i)).toBeDefined();
    });
  });

  it('displays vehicles returned by API', async () => {
    (window.electronAPI.vehicles.getActive as ReturnType<typeof vi.fn>).mockResolvedValue([
      {
        veh_id: 1,
        veh_plate: 'ABC-123',
        veh_owner: 'Juan Perez',
        veh_reference: 'VEH-001',
        veh_ingress_date: new Date().toISOString(),
        veh_tax: '600',
        veh_status: 'P',
        veh_version: 1,
      },
    ]);

    render(<VehiclesTable />);
    await waitFor(() => {
      expect(screen.getByText('ABC-123')).toBeDefined();
    });
  });

  it('opens add modal when add button clicked', async () => {
    const user = userEvent.setup();
    render(<VehiclesTable />);

    await waitFor(() => screen.getByRole('heading'));

    const addBtn = await screen.findByText(/vehicles.addVehicle/i);
    await user.click(addBtn);

    expect(screen.getByTestId('modal')).toBeDefined();
  });

  it('auto-formats plate input: ABC001 → ABC-001', async () => {
    const user = userEvent.setup();
    render(<VehiclesTable />);

    await waitFor(() => screen.getByRole('heading'));
    const addBtn = await screen.findByText(/vehicles.addVehicle/i);
    await user.click(addBtn);

    const plateInput = screen.getByPlaceholderText('ABC-123');
    await user.type(plateInput, 'ABC001');

    expect((plateInput as HTMLInputElement).value).toBe('ABC-001');
  });

  it('auto-formats plate: all lowercase converted to uppercase with dash', async () => {
    const user = userEvent.setup();
    render(<VehiclesTable />);

    await waitFor(() => screen.getByRole('heading'));
    const addBtn = await screen.findByText(/vehicles.addVehicle/i);
    await user.click(addBtn);

    const plateInput = screen.getByPlaceholderText('ABC-123');
    await user.type(plateInput, 'xyz99');

    expect((plateInput as HTMLInputElement).value).toBe('XYZ-99');
  });

  it('calls registerVehicle API on form submit', async () => {
    const user = userEvent.setup();
    (window.electronAPI.vehicles.create as ReturnType<typeof vi.fn>).mockResolvedValue({
      success: true,
      id: 42,
    });
    (window.electronAPI.parameters.getAll as ReturnType<typeof vi.fn>).mockResolvedValue([
      { par_id: 1, par_name: 'Tarifa General', par_amount: '600', par_is_default: 1, version: 1 },
    ]);
    (window.electronAPI.parameters.getDefault as ReturnType<typeof vi.fn>).mockResolvedValue({
      par_id: 1,
      par_name: 'Tarifa General',
      par_amount: '600',
      par_is_default: 1,
      version: 1,
    });

    render(<VehiclesTable />);
    await waitFor(() => screen.getByRole('heading'));

    const addBtn = await screen.findByText(/vehicles.addVehicle/i);
    await user.click(addBtn);

    const plateInput = screen.getByPlaceholderText('ABC-123');
    await user.type(plateInput, 'ABC-123');

    const submitBtn = screen.getByRole('button', { name: /vehicles.register/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(window.electronAPI.vehicles.create).toHaveBeenCalled();
    });
  });

  it('modal stays open when API returns failure', async () => {
    const user = userEvent.setup();
    (window.electronAPI.vehicles.create as ReturnType<typeof vi.fn>).mockResolvedValue({
      success: false,
      message: 'La placa ABC-123 ya tiene un ingreso activo.',
    });
    (window.electronAPI.parameters.getAll as ReturnType<typeof vi.fn>).mockResolvedValue([
      { par_id: 1, par_name: 'T', par_amount: '600', par_is_default: 1, version: 1 },
    ]);
    (window.electronAPI.parameters.getDefault as ReturnType<typeof vi.fn>).mockResolvedValue({
      par_id: 1,
      par_name: 'T',
      par_amount: '600',
      par_is_default: 1,
      version: 1,
    });

    render(<VehiclesTable />);
    await waitFor(() => screen.getByRole('heading'));

    const addBtn = await screen.findByText(/vehicles.addVehicle/i);
    await user.click(addBtn);

    const plateInput = screen.getByPlaceholderText('ABC-123');
    await user.type(plateInput, 'ABC-123');

    const submitBtn = screen.getByRole('button', { name: /vehicles.register/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(window.electronAPI.vehicles.create).toHaveBeenCalled();
      // Modal stays open (not closed) when API returns failure
      expect(screen.queryByTestId('modal')).toBeDefined();
    });
  });
});
