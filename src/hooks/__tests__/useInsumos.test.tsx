import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useInsumos } from '../useInsumos';
import type { ExtendedInsumo } from '../useInsumos';

// Mock wrapper for React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useInsumos', () => {
  const mockInsumoData: ExtendedInsumo = {
    date: '2024-03-20',
    market: 'MDA',
    unit_id: 'UNIT1',
    insumos: [
      {
        hour: 1,
        min: 100,
        max: 200,
        note: "c_amb",
        agc: true,
        price_ft1: 50,
        created_at: '2024-03-20T00:00:00Z',
        updated_at: '2024-03-20T00:00:00Z',
        modified_by: 'Admin',
      },
    ],
  };

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it('should fetch insumos when all parameters are provided', async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      json: () => Promise.resolve({ data: mockInsumoData }),
    });

    const { result } = renderHook(
      () =>
        useInsumos({
          date: '2024-03-20',
          unitId: 'UNIT1',
          market: 'MDA',
        }),
      {
        wrapper: createWrapper(),
      }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockInsumoData);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://cpp.cueva.io/api/insumos?date=2024-03-20&unit_id=UNIT1&market=MDA'
    );
  });

  it('should not fetch when date is missing', async () => {
    const { result } = renderHook(
      () =>
        useInsumos({
          date: null,
          unitId: 'UNIT1',
          market: 'MDA',
        }),
      {
        wrapper: createWrapper(),
      }
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toBeUndefined();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should not fetch when unitId is missing', async () => {
    const { result } = renderHook(
      () =>
        useInsumos({
          date: '2024-03-20',
          unitId: null,
          market: 'MDA',
        }),
      {
        wrapper: createWrapper(),
      }
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toBeUndefined();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should not fetch when market is missing', async () => {
    const { result } = renderHook(
      () =>
        useInsumos({
          date: '2024-03-20',
          unitId: 'UNIT1',
          market: null,
        }),
      {
        wrapper: createWrapper(),
      }
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toBeUndefined();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should handle API error', async () => {
    const errorMessage = 'API Error';
    (global.fetch as Mock).mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(
      () =>
        useInsumos({
          date: '2024-03-20',
          unitId: 'UNIT1',
          market: 'MDA',
        }),
      {
        wrapper: createWrapper(),
      }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });
}); 