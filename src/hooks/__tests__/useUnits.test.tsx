import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import * as constants from '@/lib/constants';

import * as authHook from '../useAuth';
import * as fuelTypesHook from '../useFuelTypes';
import type { FuelType } from '../useFuelTypes';
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
  const mockAuthToken = 'mock-token';
  const mockFuelTypes: FuelType[] = [
    {
      id: '01930e47-becb-525e-6921-42428aad2825',
      name: 'gas',
      createdBy: 'test@test.com',
      modifiedBy: 'test@test.com',
      modifiedOn: '2024-01-01T00:00:00.000',
    },
    {
      id: '01930e47-cbd1-ec34-77e3-ba7672a95cc5',
      name: 'diesel',
      createdBy: 'test@test.com',
      modifiedBy: 'test@test.com',
      modifiedOn: '2024-01-01T00:00:00.000',
    },
  ];

  const mockApiResponse = {
    success: true,
    data: [
      {
        id: 'unit1',
        name: 'Test Unit',
        createdBy: 'test@test.com',
        modifiedBy: 'test@test.com',
        modifiedOn: '2024-01-01T00:00:00.000',
        includeCil: true,
        includeLie: true,
        fuelType1ID: mockFuelTypes[0].id,
        fuelType2ID: mockFuelTypes[1].id,
        timeZone: 'America/Mexico_City',
        ippId: 'ipp1',
        ipp: {
          id: 'ipp1',
          name: 'Test IPP',
          createdBy: 'test@test.com',
          modifiedBy: 'test@test.com',
          modifiedOn: '2024-01-01T00:00:00.000',
        },
      },
    ],
  };

  beforeEach(() => {
    vi.spyOn(authHook, 'useAuth').mockReturnValue(mockAuthToken);
    vi.spyOn(fuelTypesHook, 'useFuelTypes').mockReturnValue({
      data: mockFuelTypes,
      isLoading: false,
      isError: false,
    } as any);
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

    expect(result.current.data?.[0]).toMatchObject({
      ...mockApiResponse.data[0],
      fuelType1: mockFuelTypes[0],
      fuelType2: mockFuelTypes[1],
    });

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
