import '@testing-library/jest-dom';

// Mock window.electronAPI — keys match actual preload.ts API
const mockElectronAPI = {
  vehicles: {
    getActive: vi.fn().mockResolvedValue([]),
    getAll: vi.fn().mockResolvedValue([]),
    getById: vi.fn().mockResolvedValue(undefined),
    create: vi.fn().mockResolvedValue({ success: true, id: 1 }),
    checkout: vi.fn().mockResolvedValue({ success: true }),
    update: vi.fn().mockResolvedValue({ success: true }),
    delete: vi.fn().mockResolvedValue({ success: true }),
    getReport: vi.fn().mockResolvedValue({ period: 'daily', rangeStart: '', rangeEnd: '', totalVehicles: 0, totalRevenue: 0, rows: [] }),
  },
  parameters: {
    getAll: vi.fn().mockResolvedValue([]),
    getDefault: vi.fn().mockResolvedValue(undefined),
    getById: vi.fn().mockResolvedValue(undefined),
    create: vi.fn().mockResolvedValue({ success: true, id: 1 }),
    update: vi.fn().mockResolvedValue({ success: true }),
    setDefault: vi.fn().mockResolvedValue({ success: true }),
  },
  settings: {
    getAll: vi.fn().mockResolvedValue([]),
    get: vi.fn().mockResolvedValue(undefined),
    save: vi.fn().mockResolvedValue({ success: true }),
  },
  users: {
    getAll: vi.fn().mockResolvedValue([]),
    getById: vi.fn().mockResolvedValue(undefined),
    register: vi.fn().mockResolvedValue({ success: true, id: 1 }),
    update: vi.fn().mockResolvedValue({ success: true }),
    changePassword: vi.fn().mockResolvedValue({ success: true }),
    deactivate: vi.fn().mockResolvedValue({ success: true }),
    delete: vi.fn().mockResolvedValue({ success: true }),
  },
  session: {
    login: vi.fn().mockResolvedValue({ success: true }),
    logout: vi.fn().mockResolvedValue(undefined),
    getCurrent: vi.fn().mockResolvedValue(undefined),
  },
};

Object.defineProperty(window, 'electronAPI', {
  value: mockElectronAPI,
  writable: true,
});

// Reset mocks between tests
beforeEach(() => {
  vi.clearAllMocks();
});
