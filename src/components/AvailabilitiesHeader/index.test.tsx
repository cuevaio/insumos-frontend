import fs from 'fs';

import {
  useShowFT1Columns,
  useShowFT2Columns,
  useUnit,
} from '@/contexts/AppContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AvailabilitiesHeader } from './index';

export class MockPointerEvent extends Event {
  button: number | undefined;
  ctrlKey: boolean | undefined;

  constructor(type: string, props: PointerEventInit | undefined) {
    super(type, props);
    if (props) {
      if (props.button != null) {
        this.button = props.button;
      }
      if (props.ctrlKey != null) {
        this.ctrlKey = props.ctrlKey;
      }
    }
  }
}

// Create mock data constants
const MOCK_UNIT = {
  id: '1',
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
};

describe('AvailabilitiesHeader', () => {
  const queryClient = new QueryClient();

  beforeEach(() => {
    // Setup window mocks
    window.PointerEvent = MockPointerEvent as any;
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    window.HTMLElement.prototype.hasPointerCapture = vi.fn();
    window.HTMLElement.prototype.releasePointerCapture = vi.fn();

    // Setup default mocks
    vi.mock('@/hooks/useUnits', () => ({
      useUnits: () => ({
        data: [
          {
            id: '1',
            name: 'unit1',
            fuelType1: { name: 'gas' },
            fuelType2: { name: 'diesel' },
          },
          {
            id: '2',
            name: 'unit2',
            fuelType1: { name: 'gas' },
          },
        ],
      }),
    }));

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
    }));

    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
    }));
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <AvailabilitiesHeader />
      </QueryClientProvider>,
    );
  };

  it('renders all main components', () => {
    renderComponent();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Unit')).toBeInTheDocument();
    expect(screen.getByText('Market')).toBeInTheDocument();
  });

  it('allows unit selection', async () => {
    renderComponent();

    // Find and click the unit selector button
    const unitButton = screen.getByRole('combobox');
    fireEvent.click(unitButton);

    // Check if the popover content is rendered with search input
    const searchInput = screen.getByPlaceholderText(/select a unit/i);
    expect(searchInput).toBeInTheDocument();

    // Check if the command menu items are rendered
    const unit1Item = screen.getByRole('option', { name: /unit1/i });
    const unit2Item = screen.getByRole('option', { name: /unit2/i });
    expect(unit1Item).toBeInTheDocument();
    expect(unit2Item).toBeInTheDocument();
  });

  it('allows market selection', () => {
    renderComponent();
    expect(screen.getByText('MDA')).toBeInTheDocument();
    expect(screen.getByText('MTR')).toBeInTheDocument();
  });

  it('shows columns dropdown only when unit is selected', () => {
    // Initial render without unit
    renderComponent();
    expect(screen.queryByText('Columns')).not.toBeInTheDocument();

    // Re-render with selected unit
    vi.mocked(useUnit).mockReturnValue({
      value: MOCK_UNIT,
      setId: vi.fn(),
    });

    renderComponent();
    expect(screen.getByText('Columns')).toBeInTheDocument();
  });

  it('toggles fuel type columns correctly', async () => {
    const user = userEvent.setup();
    const mockSetShowFT1 = vi.fn();
    const mockSetShowFT2 = vi.fn();

    vi.mocked(useUnit).mockReturnValue({
      value: MOCK_UNIT,
      setId: vi.fn(),
    });

    vi.mocked(useShowFT1Columns).mockReturnValue({
      value: false,
      setValue: mockSetShowFT1,
    });

    vi.mocked(useShowFT2Columns).mockReturnValue({
      value: false,
      setValue: mockSetShowFT2,
    });

    renderComponent();

    const columnsButton = screen.getByRole('button', { name: /columns/i });
    await user.click(columnsButton);

    // Write the output HTML to a file for debugging
    const outputFile = fs.createWriteStream('test-html-output.html');
    outputFile.write(document.documentElement.outerHTML);
    outputFile.end();

    // Find and click the checkbox items within the dropdown
    const gasCheckbox = screen.getByTestId('fuel-type-1-checkbox');
    await user.click(gasCheckbox);
    expect(mockSetShowFT1).toHaveBeenCalledWith(true);

    await user.click(columnsButton);

    const dieselCheckbox = screen.getByTestId('fuel-type-2-checkbox');
    await user.click(dieselCheckbox);
    expect(mockSetShowFT2).toHaveBeenCalledWith(true);
  });
});
