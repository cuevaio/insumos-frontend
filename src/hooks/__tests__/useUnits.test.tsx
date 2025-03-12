import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import * as constants from '@/lib/constants';

import * as authHook from '../useAuth';
// import * as fuelTypesHook from '../useFuelTypes';
// import type { FuelType } from '../useFuelTypes';
import { useUnits, UnitWithFuelType, UnitGSMS } from '../useUnits';

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

  const mockApiResponse: UnitGSMS[] = [
    {
        id: '0194ae0b-a075-32d6-797f-73cf343d231b',
        name: '01AMD-U1',
        portfolioName: 'MEM_SIN',
        fuelTypeList: [
            {
                id: '0191c3c4-395b-c5e9-d17f-a77ed4f7e618',
                name: 'Gas'
            },
            {
                id: '0191c3c4-4b0e-8bfd-6186-4a0472e4918f',
                name: 'Diesel'
            }
        ],
        includeCil: true,
        includeLie: false
    },
];

  beforeEach(() => {
    vi.spyOn(authHook, 'useAuth').mockReturnValue(mockAuthToken);
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

    expect(result.current.data).toMatchObject(
      mockApiResponse.map((unitGSMS) => {
        return {
          id: unitGSMS.id,
          name: unitGSMS.name,
          includeCil: unitGSMS.includeCil,
          includeLie: unitGSMS.includeLie,
          fuelType1: unitGSMS.fuelTypeList.find((fuelTypeGSMS) => fuelTypeGSMS.name === 'Gas'),
          fuelType2: unitGSMS.fuelTypeList.find((fuelTypeGSMS) => fuelTypeGSMS.name === 'Diesel'),
          portfolioName: unitGSMS?.portfolioName,
        } as UnitWithFuelType
      })
    );

    expect(global.fetch).toHaveBeenCalledWith('/api/mem-offers-input-service/unit/load');
  });

  // // TODO: The current API is not handling success state yet
  // it('should handle API error', async () => {
  //   vi.spyOn(constants, 'DEV', 'get').mockReturnValue(false);

  //   (global.fetch as Mock).mockResolvedValueOnce({
  //     json: () => Promise.resolve({ success: false, message: 'API Error' }),
  //   });

  //   const { result } = renderHook(() => useUnits(), {
  //     wrapper: createWrapper(),
  //   });

  //   await waitFor(() => expect(result.current.isError).toBe(true));
  //   expect(result.current.error?.message).toBe('API Error');
  // });

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
});
