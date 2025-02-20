import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import * as constants from '@/lib/constants';

import * as authHook from '../useAuth';
import {
  useAvailabilities,
  type AvailabilityRecord,
} from '../useAvailabilities';

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

describe('useAvailabilities', () => {
  const mockAuthToken = 'mock-token';
  const mockDate = '2024-03-20';
  const mockUnitId = '01930e48-70fe-0e9a-1c18-bff758c72abe';
  const mockMarket = 'MDA';

  const mockApiResponse = {
    success: true,
    data: {
      data: [
        {
          id: '0193217b-3ae9-d379-dfe5-afc556723dbd',
          date: mockDate,
          hour: 1,
          marketType: mockMarket,
          fuelType1NetCapacity: 457.0,
          fuelType1AvailabilityNetCapacity: 75.5,
          fuelType1Cil: 317.5,
          fuelType1Lie: 276.9,
          fuelType2NetCapacity: 519,
          fuelType2AvailabilityNetCapacity: 376.5,
          fuelType2Cil: 235.0,
          fuelType2Lie: 234.0,
          operationType: 'Operación Obligada',
          status: 'PUBLISHED',
          statusCode: 2,
          comments: null,
          unitId: mockUnitId,
          unit: null,
          fixedAvailabilityId: '01932178-616a-f878-e804-1774eb55de18',
          fixedAvailability: {
            id: '01932178-616a-f878-e804-1774eb55de18',
            fuelType1FixedNetCapacity: 123.0,
            fuelType1Cil: 317.5,
            fuelType1Lie: 276.9,
            fuelType2FixedNetCapacity: 212.0,
            fuelType2Cil: 235.0,
            fuelType2Lie: 234.0,
            effectiveDate: '2023-03-11',
            unitId: mockUnitId,
            unit: null,
            hourlyAvailabilities: null,
            createdBy: 'CPP - PRO@test.com',
            modifiedBy: 'CPP - PRO@test.com',
            modifiedOn: '2024-11-12T17:42:37.674',
          },
          createdBy: 'CPP - PRO@test.com',
          modifiedBy: 'cpp - pro@test.com',
          modifiedOn: '2024-11-12T17:45:44.426',
        },
      ],
      days: {
        [mockDate]: 24,
      },
    },
  };

  beforeEach(() => {
    vi.spyOn(authHook, 'useAuth').mockReturnValue(mockAuthToken);
    global.fetch = vi.fn();
  });

  it('should fetch availabilities in production mode', async () => {
    vi.spyOn(constants, 'DEV', 'get').mockReturnValue(false);

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve(mockApiResponse),
    });

    const { result } = renderHook(
      () =>
        useAvailabilities({
          unitId: mockUnitId,
          date: mockDate,
          market: mockMarket,
        }),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual({
      availabilities: mockApiResponse.data.data,
      dayDurations: mockApiResponse.data.days,
    });

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/cpp-backend/v1/availability/load',
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${mockAuthToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          unitId: mockUnitId,
          fromDate: mockDate,
          toDate: mockDate,
          statusCode: 2,
        }),
      },
    );
  });

  it('should handle API error', async () => {
    vi.spyOn(constants, 'DEV', 'get').mockReturnValue(false);

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve({ success: false, message: 'API Error' }),
    });

    const { result } = renderHook(
      () =>
        useAvailabilities({
          unitId: mockUnitId,
          date: mockDate,
          market: mockMarket,
        }),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe('API Error');
  });

  it('should not fetch when required parameters are missing', async () => {
    vi.spyOn(constants, 'DEV', 'get').mockReturnValue(false);

    const { result } = renderHook(
      () =>
        useAvailabilities({
          unitId: null,
          date: mockDate,
          market: mockMarket,
        }),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toBeUndefined();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should filter availabilities by market type', async () => {
    vi.spyOn(constants, 'DEV', 'get').mockReturnValue(false);

    const mixedResponse = {
      ...mockApiResponse,
      data: {
        ...mockApiResponse.data,
        data: [
          ...mockApiResponse.data.data,
          {
            ...mockApiResponse.data.data[0],
            id: 'different-id',
            marketType: 'MTR',
          },
        ],
      },
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve(mixedResponse),
    });

    const { result } = renderHook(
      () =>
        useAvailabilities({
          unitId: mockUnitId,
          date: mockDate,
          market: mockMarket,
        }),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.availabilities).toHaveLength(1);
    expect(result.current.data?.availabilities[0].marketType).toBe(mockMarket);
  });
});
