import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import * as constants from '@/lib/constants';

import * as authHook from '../useAuth';
import { useUnits } from '../useUnits';

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

describe('useUnits', () => {
  const mockApiResponse = [
    {
      id: '0194ae0b-a075-32d6-797f-73cf343d231b',
      name: '01AMD-U1',
      portfolioName: 'MEM_SIN',
      fuelTypeList: [
        { id: '0191c3c4-395b-c5e9-d17f-a77ed4f7e618', name: 'Gas' },
        { id: '0191c3c4-4b0e-8bfd-6186-4a0472e4918f', name: 'Diesel' },
      ],
      includeCil: true,
      includeLie: false,
    },
    {
      id: '0194ae0f-7d95-a90c-ca92-23bbe7178067',
      name: '02EAT-PTA',
      portfolioName: 'MEM_SIN',
      fuelTypeList: [
        { id: '0191c3c4-395b-c5e9-d17f-a77ed4f7e618', name: 'Gas' },
        { id: '0191c3c4-4b0e-8bfd-6186-4a0472e4918f', name: 'Diesel' },
      ],
      includeCil: true,
      includeLie: false,
    },
    {
      id: '0194ae10-eb7d-8677-5be2-2e0d6630e6f9',
      name: '02EOC-PTA',
      portfolioName: 'MEM_SIN',
      fuelTypeList: [
        { id: '0191c3c4-395b-c5e9-d17f-a77ed4f7e618', name: 'Gas' },
        { id: '0191c3c4-4b0e-8bfd-6186-4a0472e4918f', name: 'Diesel' },
      ],
      includeCil: true,
      includeLie: true,
    },
    {
      id: '01956d41-6556-62a4-2b7a-789c058e063d',
      name: '04FEN-PTA',
      portfolioName: 'MEM_SIN',
      fuelTypeList: [
        { id: '0191c3c4-395b-c5e9-d17f-a77ed4f7e618', name: 'Gas' },
        null,
      ],
      includeCil: true,
      includeLie: true,
    },
  ];

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it('should fetch units in production mode', async () => {
    vi.spyOn(constants, 'DEV', 'get').mockReturnValue(false);

    (global.fetch as Mock).mockResolvedValueOnce({
      json: () => Promise.resolve(mockApiResponse),
    });

    const { result } = renderHook(() => useUnits(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current).toMatchObject(mockApiResponse);

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/cpp-backend/v1/unit/load/all',
      {
        headers: {
          Authorization: `Bearer ${mockAuthToken}`,
        },
      },
    );
  });

  it('should return mock data in development mode', async () => {
    vi.spyOn(constants, 'DEV', 'get').mockReturnValue(true);

    const { result } = renderHook(() => useUnits(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.[0]).toHaveProperty('name', 'unit1');
    expect(result.current.data?.[0].fuelType1).toBeDefined();
    expect(result.current.data?.[0].fuelType2).toBeDefined();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should handle API error', async () => {
    vi.spyOn(constants, 'DEV', 'get').mockReturnValue(false);

    (global.fetch as Mock).mockResolvedValueOnce({
      json: () => Promise.resolve({ success: false, message: 'API Error' }),
    });

    const { result } = renderHook(() => useUnits(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe('API Error');
  });

  it('should not fetch when auth token is missing', async () => {
    vi.spyOn(authHook, 'useAuth').mockReturnValue('');
    vi.spyOn(constants, 'DEV', 'get').mockReturnValue(false);

    const { result } = renderHook(() => useUnits(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toBeUndefined();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should map fuel types correctly', async () => {
    vi.spyOn(constants, 'DEV', 'get').mockReturnValue(false);

    (global.fetch as Mock).mockResolvedValueOnce({
      json: () => Promise.resolve(mockApiResponse),
    });

    const { result } = renderHook(() => useUnits(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const unit = result.current.data?.[0];
    expect(unit?.fuelType1).toEqual(mockFuelTypes[0]);
    expect(unit?.fuelType2).toEqual(mockFuelTypes[1]);
  });
});
