import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import * as constants from '@/lib/constants';

import * as authHook from '@/hooks/useAuth';
import { useFuelTypes } from '@/hooks/useFuelTypes';

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

describe('useFuelTypes', () => {
  const mockAuthToken = 'mock-token';
  const mockFuelTypes = [
    {
      id: '1',
      name: 'test-fuel',
      createdBy: 'test@test.com',
      modifiedBy: 'test@test.com',
      modifiedOn: '2024-01-01T00:00:00.000',
    },
  ];

  beforeEach(() => {
    vi.spyOn(authHook, 'useAuth').mockReturnValue(mockAuthToken);
    global.fetch = vi.fn();
  });

  it('should fetch fuel types in production mode', async () => {
    vi.spyOn(constants, 'DEV', 'get').mockReturnValue(false);

    (global.fetch as Mock).mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, data: mockFuelTypes }),
    });

    const { result } = renderHook(() => useFuelTypes(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockFuelTypes);
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/cpp-backend/v1/fuelType/load',
      {
        headers: {
          Authorization: `Bearer ${mockAuthToken}`,
        },
      },
    );
  });

  it('should return mock data in development mode', async () => {
    vi.spyOn(constants, 'DEV', 'get').mockReturnValue(true);

    const { result } = renderHook(() => useFuelTypes(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(2);
    expect(result.current.data?.[0].name).toBe('gas');
    expect(result.current.data?.[1].name).toBe('diesel');
  });

  it('should handle API error', async () => {
    vi.spyOn(constants, 'DEV', 'get').mockReturnValue(false);

    (global.fetch as Mock).mockResolvedValueOnce({
      json: () => Promise.resolve({ success: false, message: 'API Error' }),
    });

    const { result } = renderHook(() => useFuelTypes(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe('API Error');
  });

  it('should not fetch when auth token is missing', async () => {
    vi.spyOn(authHook, 'useAuth').mockReturnValue('');
    vi.spyOn(constants, 'DEV', 'get').mockReturnValue(false);

    const { result } = renderHook(() => useFuelTypes(), {
      wrapper: createWrapper(),
    });

    // Wait for the query to settle
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Verify that no data was fetched
    expect(result.current.data).toBeUndefined();
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
