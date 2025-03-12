import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import AvailabilitiesForm from '.';

vi.mock('@/contexts/AppContext', () => ({
  AppProvider: ({ children }: { children: React.ReactNode }) => children,
  useUnit: vi.fn().mockReturnValue({
    value: { id: 1 },
    setId: vi.fn(),
  }),
  useDate: vi.fn().mockReturnValue({
    value: new Date(),
    setValue: vi.fn(),
    dateDiff: 0,
  }),
  useMarket: vi.fn().mockReturnValue({
    value: 'test-market',
    setValue: vi.fn(),
  }),
  useUpsertInsumosState: vi.fn().mockReturnValue({
    errors: {},
    setErrors: vi.fn(),
    setIsFlashingSuccess: vi.fn(),
    setIsFlashingErrors: vi.fn(),
    setData: vi.fn(),
  }),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
}));

const mockMutate = vi.fn();
vi.mock('@/hooks/useUpsertInsumos', () => ({
  useUpsertInsumos: () => ({
    mutate: mockMutate,
    data: null,
    isSuccess: false,
    isPending: false,
  }),
}));

const queryClient = new QueryClient();

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const renderComponent = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <AvailabilitiesForm formRef={{ current: null }}>
        <button type="submit">Submit</button>
      </AvailabilitiesForm>
    </QueryClientProvider>,
  );
};

describe('AvailabilitiesForm', () => {
  beforeEach(() => {
    mockMutate.mockClear();
  });

  it('renders without crashing', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('calls mutate function on form submit', async () => {
    renderComponent();

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalled();
    });
  });
});
