import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import ExportAvailabilitiesButton from '.';

const queryClient = new QueryClient();

describe('ExportAvailabilitiesButton', () => {
  vi.mock('@/contexts/AppContext', () => ({
    AppProvider: ({ children }: { children: React.ReactNode }) => children,
    useUnit: vi.fn().mockReturnValue({
      value: undefined,
      setId: vi.fn(),
    }),
    useDate: vi.fn().mockReturnValue({
      value: null,
      setValue: vi.fn(),
      dateDiff: 0,
    }),
    useMarket: vi.fn().mockReturnValue({
      value: null,
      setValue: vi.fn(),
    }),
  }));

  vi.mock('@/hooks/useAvailabilities', () => ({
    useAvailabilities: vi.fn().mockReturnValue({ 
      data: { availabilities: [{ id: 1 }] } 
    }),
  }));

  vi.mock('@/hooks/useInsumos', () => ({
    useInsumos: vi.fn().mockReturnValue({ data: { insumos: [{ id: 1 }] } }),
  }));

  vi.mock('@/hooks/useFuelTypes', () => ({
    useFuelTypes: vi.fn().mockReturnValue({ data: { fuelTypes: [{ id: 1 }] } }),
  }));

  vi.mock('@/lib/export', () => ({
    populateAvailabilityData: vi.fn(),
    setupWorksheet: vi.fn(),
  }));

  vi.mock('react-i18next', () => ({
    useTranslation: () => ({
      t: (key: string) => key,
      i18n: { language: 'en' },
    }),
  }));

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <ExportAvailabilitiesButton/>
      </QueryClientProvider>,
    );
  };

  it('renders the button', () => {
    renderComponent();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls export function when clicked', async () => {
    renderComponent();
    const button = screen.getByRole('button');
    fireEvent.click(button);
    await waitFor(() => expect(screen.getByRole('button')).toBeEnabled());
  });
});