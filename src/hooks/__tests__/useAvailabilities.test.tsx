import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import * as constants from '@/lib/constants';

import * as authHook from '../useAuth';
import { useAvailabilities } from '../useAvailabilities';

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
  const mockPortfolioName = 'MEM_SIN';
  const mockUnitName = '01930e48-70fe-0e9a-1c18-bff758c72abe';

  const mockApiResponse = {
    "data": {
        "data": [
            {
                "hour": 1,
                "marketType": "MDA",
                "fuelType1NetCapacity": 123,
                "fuelType1AvailabilityNetCapacity": 654,
                "fuelType1Cil": 456,
                "fuelType1Lie": 456,
                "fuelType2NetCapacity": 123,
                "fuelType2AvailabilityNetCapacity": 654,
                "fuelType2Cil": 456,
                "fuelType2Lie": 456,
                "operationType": "Operación No Disponible",
                "comments": "sd",
                "fixedAvailability": {
                    "fuelType1FixedNetCapacity": 456,
                    "fuelType1Cil": 456,
                    "fuelType1Lie": 456,
                    "fuelType2FixedNetCapacity": 456,
                    "fuelType2Cil": 465,
                    "fuelType2Lie": 456
                }
            },
            {
                "hour": 2,
                "marketType": "MDA",
                "fuelType1NetCapacity": 123,
                "fuelType1AvailabilityNetCapacity": 654,
                "fuelType1Cil": 456,
                "fuelType1Lie": 456,
                "fuelType2NetCapacity": 123,
                "fuelType2AvailabilityNetCapacity": 654,
                "fuelType2Cil": 456,
                "fuelType2Lie": 456,
                "operationType": "Operación No Disponible",
                "comments": "asdf",
                "fixedAvailability": {
                    "fuelType1FixedNetCapacity": 456,
                    "fuelType1Cil": 456,
                    "fuelType1Lie": 456,
                    "fuelType2FixedNetCapacity": 456,
                    "fuelType2Cil": 465,
                    "fuelType2Lie": 456
                }
            },
            {
                "hour": 3,
                "marketType": "MDA",
                "fuelType1NetCapacity": 123,
                "fuelType1AvailabilityNetCapacity": 654,
                "fuelType1Cil": 456,
                "fuelType1Lie": 456,
                "fuelType2NetCapacity": 123,
                "fuelType2AvailabilityNetCapacity": 654,
                "fuelType2Cil": 456,
                "fuelType2Lie": 456,
                "operationType": "Operación No Disponible",
                "comments": "sd",
                "fixedAvailability": {
                    "fuelType1FixedNetCapacity": 456,
                    "fuelType1Cil": 456,
                    "fuelType1Lie": 456,
                    "fuelType2FixedNetCapacity": 456,
                    "fuelType2Cil": 465,
                    "fuelType2Lie": 456
                }
            },
            {
                "hour": 4,
                "marketType": "MDA",
                "fuelType1NetCapacity": 123,
                "fuelType1AvailabilityNetCapacity": 654,
                "fuelType1Cil": 456,
                "fuelType1Lie": 456,
                "fuelType2NetCapacity": 123,
                "fuelType2AvailabilityNetCapacity": 654,
                "fuelType2Cil": 456,
                "fuelType2Lie": 456,
                "operationType": "Operación No Disponible",
                "comments": "asdf",
                "fixedAvailability": {
                    "fuelType1FixedNetCapacity": 456,
                    "fuelType1Cil": 456,
                    "fuelType1Lie": 456,
                    "fuelType2FixedNetCapacity": 456,
                    "fuelType2Cil": 465,
                    "fuelType2Lie": 456
                }
            },
            {
                "hour": 5,
                "marketType": "MDA",
                "fuelType1NetCapacity": 123,
                "fuelType1AvailabilityNetCapacity": 654,
                "fuelType1Cil": 456,
                "fuelType1Lie": 456,
                "fuelType2NetCapacity": 123,
                "fuelType2AvailabilityNetCapacity": 654,
                "fuelType2Cil": 456,
                "fuelType2Lie": 456,
                "operationType": "Operación No Disponible",
                "comments": "sd",
                "fixedAvailability": {
                    "fuelType1FixedNetCapacity": 456,
                    "fuelType1Cil": 456,
                    "fuelType1Lie": 456,
                    "fuelType2FixedNetCapacity": 456,
                    "fuelType2Cil": 465,
                    "fuelType2Lie": 456
                }
            },
            {
                "hour": 6,
                "marketType": "MDA",
                "fuelType1NetCapacity": 123,
                "fuelType1AvailabilityNetCapacity": 654,
                "fuelType1Cil": 456,
                "fuelType1Lie": 456,
                "fuelType2NetCapacity": 123,
                "fuelType2AvailabilityNetCapacity": 654,
                "fuelType2Cil": 456,
                "fuelType2Lie": 456,
                "operationType": "Operación No Disponible",
                "comments": "asdf",
                "fixedAvailability": {
                    "fuelType1FixedNetCapacity": 456,
                    "fuelType1Cil": 456,
                    "fuelType1Lie": 456,
                    "fuelType2FixedNetCapacity": 456,
                    "fuelType2Cil": 465,
                    "fuelType2Lie": 456
                }
            },
            {
                "hour": 7,
                "marketType": "MDA",
                "fuelType1NetCapacity": 123,
                "fuelType1AvailabilityNetCapacity": 654,
                "fuelType1Cil": 456,
                "fuelType1Lie": 456,
                "fuelType2NetCapacity": 123,
                "fuelType2AvailabilityNetCapacity": 654,
                "fuelType2Cil": 456,
                "fuelType2Lie": 456,
                "operationType": "Operación No Disponible",
                "comments": "sd",
                "fixedAvailability": {
                    "fuelType1FixedNetCapacity": 456,
                    "fuelType1Cil": 456,
                    "fuelType1Lie": 456,
                    "fuelType2FixedNetCapacity": 456,
                    "fuelType2Cil": 465,
                    "fuelType2Lie": 456
                }
            },
            {
                "hour": 8,
                "marketType": "MDA",
                "fuelType1NetCapacity": 123,
                "fuelType1AvailabilityNetCapacity": 654,
                "fuelType1Cil": 456,
                "fuelType1Lie": 456,
                "fuelType2NetCapacity": 123,
                "fuelType2AvailabilityNetCapacity": 654,
                "fuelType2Cil": 456,
                "fuelType2Lie": 456,
                "operationType": "Operación No Disponible",
                "comments": "asdf",
                "fixedAvailability": {
                    "fuelType1FixedNetCapacity": 456,
                    "fuelType1Cil": 456,
                    "fuelType1Lie": 456,
                    "fuelType2FixedNetCapacity": 456,
                    "fuelType2Cil": 465,
                    "fuelType2Lie": 456
                }
            },
            {
                "hour": 9,
                "marketType": "MDA",
                "fuelType1NetCapacity": 123,
                "fuelType1AvailabilityNetCapacity": 654,
                "fuelType1Cil": 456,
                "fuelType1Lie": 456,
                "fuelType2NetCapacity": 123,
                "fuelType2AvailabilityNetCapacity": 654,
                "fuelType2Cil": 456,
                "fuelType2Lie": 456,
                "operationType": "Operación No Disponible",
                "comments": "sd",
                "fixedAvailability": {
                    "fuelType1FixedNetCapacity": 456,
                    "fuelType1Cil": 456,
                    "fuelType1Lie": 456,
                    "fuelType2FixedNetCapacity": 456,
                    "fuelType2Cil": 465,
                    "fuelType2Lie": 456
                }
            },
            {
                "hour": 10,
                "marketType": "MDA",
                "fuelType1NetCapacity": 123,
                "fuelType1AvailabilityNetCapacity": 654,
                "fuelType1Cil": 456,
                "fuelType1Lie": 456,
                "fuelType2NetCapacity": 123,
                "fuelType2AvailabilityNetCapacity": 654,
                "fuelType2Cil": 456,
                "fuelType2Lie": 456,
                "operationType": "Operación No Disponible",
                "comments": "asdf",
                "fixedAvailability": {
                    "fuelType1FixedNetCapacity": 456,
                    "fuelType1Cil": 456,
                    "fuelType1Lie": 456,
                    "fuelType2FixedNetCapacity": 456,
                    "fuelType2Cil": 465,
                    "fuelType2Lie": 456
                }
            },
            {
                "hour": 11,
                "marketType": "MDA",
                "fuelType1NetCapacity": 123,
                "fuelType1AvailabilityNetCapacity": 654,
                "fuelType1Cil": 456,
                "fuelType1Lie": 456,
                "fuelType2NetCapacity": 123,
                "fuelType2AvailabilityNetCapacity": 654,
                "fuelType2Cil": 456,
                "fuelType2Lie": 456,
                "operationType": "Operación No Disponible",
                "comments": "sd",
                "fixedAvailability": {
                    "fuelType1FixedNetCapacity": 456,
                    "fuelType1Cil": 456,
                    "fuelType1Lie": 456,
                    "fuelType2FixedNetCapacity": 456,
                    "fuelType2Cil": 465,
                    "fuelType2Lie": 456
                }
            },
            {
                "hour": 12,
                "marketType": "MDA",
                "fuelType1NetCapacity": 123,
                "fuelType1AvailabilityNetCapacity": 654,
                "fuelType1Cil": 456,
                "fuelType1Lie": 456,
                "fuelType2NetCapacity": 123,
                "fuelType2AvailabilityNetCapacity": 654,
                "fuelType2Cil": 456,
                "fuelType2Lie": 456,
                "operationType": "Operación No Disponible",
                "comments": "asdf",
                "fixedAvailability": {
                    "fuelType1FixedNetCapacity": 456,
                    "fuelType1Cil": 456,
                    "fuelType1Lie": 456,
                    "fuelType2FixedNetCapacity": 456,
                    "fuelType2Cil": 465,
                    "fuelType2Lie": 456
                }
            },
            {
                "hour": 13,
                "marketType": "MDA",
                "fuelType1NetCapacity": 123,
                "fuelType1AvailabilityNetCapacity": 654,
                "fuelType1Cil": 456,
                "fuelType1Lie": 456,
                "fuelType2NetCapacity": 123,
                "fuelType2AvailabilityNetCapacity": 654,
                "fuelType2Cil": 456,
                "fuelType2Lie": 456,
                "operationType": "Operación No Disponible",
                "comments": "sd",
                "fixedAvailability": {
                    "fuelType1FixedNetCapacity": 456,
                    "fuelType1Cil": 456,
                    "fuelType1Lie": 456,
                    "fuelType2FixedNetCapacity": 456,
                    "fuelType2Cil": 465,
                    "fuelType2Lie": 456
                }
            },
            {
                "hour": 14,
                "marketType": "MDA",
                "fuelType1NetCapacity": 123,
                "fuelType1AvailabilityNetCapacity": 654,
                "fuelType1Cil": 456,
                "fuelType1Lie": 456,
                "fuelType2NetCapacity": 123,
                "fuelType2AvailabilityNetCapacity": 654,
                "fuelType2Cil": 456,
                "fuelType2Lie": 456,
                "operationType": "Operación No Disponible",
                "comments": "asdf",
                "fixedAvailability": {
                    "fuelType1FixedNetCapacity": 456,
                    "fuelType1Cil": 456,
                    "fuelType1Lie": 456,
                    "fuelType2FixedNetCapacity": 456,
                    "fuelType2Cil": 465,
                    "fuelType2Lie": 456
                }
            },
            {
                "hour": 15,
                "marketType": "MDA",
                "fuelType1NetCapacity": 123,
                "fuelType1AvailabilityNetCapacity": 654,
                "fuelType1Cil": 456,
                "fuelType1Lie": 456,
                "fuelType2NetCapacity": 123,
                "fuelType2AvailabilityNetCapacity": 654,
                "fuelType2Cil": 456,
                "fuelType2Lie": 456,
                "operationType": "Operación No Disponible",
                "comments": "sd",
                "fixedAvailability": {
                    "fuelType1FixedNetCapacity": 456,
                    "fuelType1Cil": 456,
                    "fuelType1Lie": 456,
                    "fuelType2FixedNetCapacity": 456,
                    "fuelType2Cil": 465,
                    "fuelType2Lie": 456
                }
            },
            {
                "hour": 16,
                "marketType": "MDA",
                "fuelType1NetCapacity": 123,
                "fuelType1AvailabilityNetCapacity": 654,
                "fuelType1Cil": 456,
                "fuelType1Lie": 456,
                "fuelType2NetCapacity": 123,
                "fuelType2AvailabilityNetCapacity": 654,
                "fuelType2Cil": 456,
                "fuelType2Lie": 456,
                "operationType": "Operación No Disponible",
                "comments": "asdf",
                "fixedAvailability": {
                    "fuelType1FixedNetCapacity": 456,
                    "fuelType1Cil": 456,
                    "fuelType1Lie": 456,
                    "fuelType2FixedNetCapacity": 456,
                    "fuelType2Cil": 465,
                    "fuelType2Lie": 456
                }
            },
            {
                "hour": 17,
                "marketType": "MDA",
                "fuelType1NetCapacity": 123,
                "fuelType1AvailabilityNetCapacity": 654,
                "fuelType1Cil": 456,
                "fuelType1Lie": 456,
                "fuelType2NetCapacity": 123,
                "fuelType2AvailabilityNetCapacity": 654,
                "fuelType2Cil": 456,
                "fuelType2Lie": 456,
                "operationType": "Operación No Disponible",
                "comments": "sd",
                "fixedAvailability": {
                    "fuelType1FixedNetCapacity": 456,
                    "fuelType1Cil": 456,
                    "fuelType1Lie": 456,
                    "fuelType2FixedNetCapacity": 456,
                    "fuelType2Cil": 465,
                    "fuelType2Lie": 456
                }
            },
            {
                "hour": 18,
                "marketType": "MDA",
                "fuelType1NetCapacity": 123,
                "fuelType1AvailabilityNetCapacity": 654,
                "fuelType1Cil": 456,
                "fuelType1Lie": 456,
                "fuelType2NetCapacity": 123,
                "fuelType2AvailabilityNetCapacity": 654,
                "fuelType2Cil": 456,
                "fuelType2Lie": 456,
                "operationType": "Operación No Disponible",
                "comments": "asdf",
                "fixedAvailability": {
                    "fuelType1FixedNetCapacity": 456,
                    "fuelType1Cil": 456,
                    "fuelType1Lie": 456,
                    "fuelType2FixedNetCapacity": 456,
                    "fuelType2Cil": 465,
                    "fuelType2Lie": 456
                }
            },
            {
                "hour": 19,
                "marketType": "MDA",
                "fuelType1NetCapacity": 123,
                "fuelType1AvailabilityNetCapacity": 654,
                "fuelType1Cil": 456,
                "fuelType1Lie": 456,
                "fuelType2NetCapacity": 123,
                "fuelType2AvailabilityNetCapacity": 654,
                "fuelType2Cil": 456,
                "fuelType2Lie": 456,
                "operationType": "Operación No Disponible",
                "comments": "sd",
                "fixedAvailability": {
                    "fuelType1FixedNetCapacity": 456,
                    "fuelType1Cil": 456,
                    "fuelType1Lie": 456,
                    "fuelType2FixedNetCapacity": 456,
                    "fuelType2Cil": 465,
                    "fuelType2Lie": 456
                }
            },
            {
                "hour": 20,
                "marketType": "MDA",
                "fuelType1NetCapacity": 123,
                "fuelType1AvailabilityNetCapacity": 654,
                "fuelType1Cil": 456,
                "fuelType1Lie": 456,
                "fuelType2NetCapacity": 123,
                "fuelType2AvailabilityNetCapacity": 654,
                "fuelType2Cil": 456,
                "fuelType2Lie": 456,
                "operationType": "Operación No Disponible",
                "comments": "asdf",
                "fixedAvailability": {
                    "fuelType1FixedNetCapacity": 456,
                    "fuelType1Cil": 456,
                    "fuelType1Lie": 456,
                    "fuelType2FixedNetCapacity": 456,
                    "fuelType2Cil": 465,
                    "fuelType2Lie": 456
                }
            },
            {
                "hour": 21,
                "marketType": "MDA",
                "fuelType1NetCapacity": 123,
                "fuelType1AvailabilityNetCapacity": 654,
                "fuelType1Cil": 456,
                "fuelType1Lie": 456,
                "fuelType2NetCapacity": 123,
                "fuelType2AvailabilityNetCapacity": 654,
                "fuelType2Cil": 456,
                "fuelType2Lie": 456,
                "operationType": "Operación No Disponible",
                "comments": "sd",
                "fixedAvailability": {
                    "fuelType1FixedNetCapacity": 456,
                    "fuelType1Cil": 456,
                    "fuelType1Lie": 456,
                    "fuelType2FixedNetCapacity": 456,
                    "fuelType2Cil": 465,
                    "fuelType2Lie": 456
                }
            },
            {
                "hour": 22,
                "marketType": "MDA",
                "fuelType1NetCapacity": 123,
                "fuelType1AvailabilityNetCapacity": 654,
                "fuelType1Cil": 456,
                "fuelType1Lie": 456,
                "fuelType2NetCapacity": 123,
                "fuelType2AvailabilityNetCapacity": 654,
                "fuelType2Cil": 456,
                "fuelType2Lie": 456,
                "operationType": "Operación No Disponible",
                "comments": "asdf",
                "fixedAvailability": {
                    "fuelType1FixedNetCapacity": 456,
                    "fuelType1Cil": 456,
                    "fuelType1Lie": 456,
                    "fuelType2FixedNetCapacity": 456,
                    "fuelType2Cil": 465,
                    "fuelType2Lie": 456
                }
            },
            {
                "hour": 23,
                "marketType": "MDA",
                "fuelType1NetCapacity": 123,
                "fuelType1AvailabilityNetCapacity": 654,
                "fuelType1Cil": 456,
                "fuelType1Lie": 456,
                "fuelType2NetCapacity": 123,
                "fuelType2AvailabilityNetCapacity": 654,
                "fuelType2Cil": 456,
                "fuelType2Lie": 456,
                "operationType": "Operación No Disponible",
                "comments": "sd",
                "fixedAvailability": {
                    "fuelType1FixedNetCapacity": 456,
                    "fuelType1Cil": 456,
                    "fuelType1Lie": 456,
                    "fuelType2FixedNetCapacity": 456,
                    "fuelType2Cil": 465,
                    "fuelType2Lie": 456
                }
            },
            {
                "hour": 24,
                "marketType": "MDA",
                "fuelType1NetCapacity": 123,
                "fuelType1AvailabilityNetCapacity": 654,
                "fuelType1Cil": 456,
                "fuelType1Lie": 456,
                "fuelType2NetCapacity": 123,
                "fuelType2AvailabilityNetCapacity": 654,
                "fuelType2Cil": 456,
                "fuelType2Lie": 456,
                "operationType": "Operación No Disponible",
                "comments": "asdf",
                "fixedAvailability": {
                    "fuelType1FixedNetCapacity": 456,
                    "fuelType1Cil": 456,
                    "fuelType1Lie": 456,
                    "fuelType2FixedNetCapacity": 456,
                    "fuelType2Cil": 465,
                    "fuelType2Lie": 456
                }
            }
        ],
        "days": {
            "2025-02-01": 24
        }
    },
    "message": "OK",
    "timestamp": "2025-03-05T14:50:24.495"
  };

  beforeEach(() => {
    vi.spyOn(authHook, 'useAuth').mockReturnValue(mockAuthToken);
    global.fetch = vi.fn();
  });

  it('should fetch availabilities in production mode', async () => {
    vi.spyOn(constants, 'DEV', 'get').mockReturnValue(false);

    (global.fetch as Mock).mockResolvedValueOnce({
      json: () => Promise.resolve(mockApiResponse),
    });

    const { result } = renderHook(
      () =>
        useAvailabilities({
          unitId: mockUnitId,
          unitName: mockUnitName,
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
      '/api/mem-offers-input-service/availability/loadCpp',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          unitName: mockUnitName,
          portfolioName: mockPortfolioName,
          fromDate: mockDate,
          toDate: mockDate,
          statusCode: 1,
        }),
      },
    );
  });

  // TODO: The current API is not handling success state yet
  // it('should handle API error', async () => {
  //   vi.spyOn(constants, 'DEV', 'get').mockReturnValue(false);

  //   (global.fetch as Mock).mockResolvedValueOnce({
  //     json: () => Promise.resolve({ success: false, message: 'API Error' }),
  //   });

  //   const { result } = renderHook(
  //     () =>
  //       useAvailabilities({
  //         unitId: mockUnitId,
  //         date: mockDate,
  //         market: mockMarket,
  //       }),
  //     {
  //       wrapper: createWrapper(),
  //     },
  //   );

  //   await waitFor(() => expect(result.current.isError).toBe(true));
  //   expect(result.current.error?.message).toBe('API Error');
  // });

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

    (global.fetch as Mock).mockResolvedValueOnce({
      json: () => Promise.resolve(mixedResponse),
    });

    const { result } = renderHook(
      () =>
        useAvailabilities({
          unitId: mockUnitId,
          unitName: mockUnitName,
          date: mockDate,
          market: mockMarket,
        }),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.availabilities).toHaveLength(24);
    expect(result.current.data?.availabilities?.at(0)?.marketType).toBe(mockMarket);
  });
});
