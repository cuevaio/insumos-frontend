import * as AppContext from '@/contexts/AppContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Unit } from '@/hooks/useUnits';

import AvailabilitiesTable from '.';

vi.mock('@/contexts/AppContext', () => ({
  AppProvider: ({ children }: { children: React.ReactNode }) => children,
  useShowFT1Columns: vi.fn(),
  useShowFT2Columns: vi.fn(),
}));

const MOCK_UNIT = {
  id: '01930e48-70fe-0e9a-1c18-bff758c72abe',
  name: 'unit1',
  createdBy: 'test',
  modifiedBy: 'test',
  modifiedOn: '2021-01-01',
  includeCil: true,
  includeLie: true,
  ippId: '1',
  ipp: {
    id: '1',
    createdBy: 'test',
    modifiedBy: 'test',
    modifiedOn: '2021-01-01',
    name: 'gas',
  },
  timeZone: 'America/New_York',
  fuelType1: {
    id: '1',
    createdBy: 'test',
    modifiedBy: 'test',
    modifiedOn: '2021-01-01',
    name: 'gas',
  },
  fuelType2: {
    id: '2',
    createdBy: 'test',
    modifiedBy: 'test',
    modifiedOn: '2021-01-01',
    name: 'diesel',
  },
  fuelType1ID: '1',
  fuelType2ID: '2',
} as Unit;

const queryClient = new QueryClient();

describe('AvailabilitiesTable', () => {
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
    useShowFT1Columns: vi.fn().mockReturnValue({
      value: false,
      setValue: vi.fn(),
    }),
    useShowFT2Columns: vi.fn().mockReturnValue({
      value: false,
      setValue: vi.fn(),
    }),
    useUpsertInsumosState: vi.fn().mockReturnValue({
      errors: {},
      setErrors: vi.fn(),
      isFlashingSuccess: false,
      setIsFlashingSuccess: vi.fn(),
      isFlashingErrors: false,
      setIsFlashingErrors: vi.fn(),
      data: undefined,
      setData: vi.fn(),
    }),
  }));

  vi.mock('react-i18next', () => ({
    useTranslation: () => ({
      t: (key: string) => key,
    }),
  }));

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <AvailabilitiesTable />
      </QueryClientProvider>,
    );
  };

  it('renders the component without errors', () => {
    vi.mocked(AppContext.useUnit).mockReturnValue({
      value: MOCK_UNIT,
      setId: vi.fn(),
    });

    renderComponent();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('renders 15 <th> elements when showFT1Columns is false', () => {
    renderComponent();
    expect(screen.getAllByRole('columnheader')).toHaveLength(15);
  });

  it('renders 23 <th> elements when showFT1Columns is true and showFT2Columns is false', () => {
    vi.mocked(AppContext.useShowFT1Columns).mockReturnValue({
      value: true,
      setValue: vi.fn(),
    });

    renderComponent();

    expect(screen.getAllByRole('columnheader')).toHaveLength(23);
  });

  it('renders 29 <th> elements when showFT2Columns is true', () => {
    vi.mocked(AppContext.useShowFT2Columns).mockReturnValue({
      value: true,
      setValue: vi.fn(),
    });

    renderComponent();

    expect(screen.getAllByRole('columnheader')).toHaveLength(29);
  });
});
