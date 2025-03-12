import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useInsumos } from '../useInsumos';
import type { Insumo, ExtendedInsumo, ExtendedInsumoGSMS } from '../useInsumos';

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
  const mockInsumoData: {
    data: ExtendedInsumoGSMS;
    message: string;
    timestamp: string;
  } = {
    data: { 
      data: [
        { 
          hour: 0, 
          minAvailability: 123, 
          maxAvailability: 502, 
          fuels: [
            { 
              name: "G_EAT", 
              percentage: 100, 
              price: 70.26 }
            , { 
              name: "D_EAT", 
              percentage: 0, 
              price: 692.15 
            }
          ], 
          agc: true, 
          note: "", 
          modifiedOn: "02/28/2025", 
          modifiedBy: "background" 
        }
      ], 
      averageLast30Days: 881.2499166666665, 
      transmissionFee: 61.3, 
      operationFee: 2.6231 
    }, 
    message: "OK", 
    timestamp: "2025-03-05T16:51:29.881"
  };

  const mockDate = '2025-01-30'
  const mockUnitId = '0194ae0f-7d95-a90c-ca92-23bbe7178067'
  const mockUnitName = '02EAT-PTA'
  const mockPortfolioName = 'MEM_SIN'
  const mockMarket = 'MDA'

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it('should fetch insumos when all parameters are provided', async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      json: () => Promise.resolve(mockInsumoData),
    });

    const { result } = renderHook(
      () =>
        useInsumos({
          date: mockDate,
          unitId: mockUnitId,
          unitName: mockUnitName,
          portfolioName: mockPortfolioName,
          market: mockMarket,
        }),
      {
        wrapper: createWrapper(),
      }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual({
      date: mockDate,
      market: mockMarket,
      unit_id: mockUnitId,
      insumos: mockInsumoData.data.data.map((insumoGSMS, idx) => {
        const ft1 = insumoGSMS.fuels.find((fuel) => fuel.name.startsWith('G_'));
        const ft2 = insumoGSMS.fuels.find((fuel) => fuel.name.startsWith('D_'));

        return {
          hour: idx + 1,
          min: insumoGSMS.minAvailability,
          max: insumoGSMS.maxAvailability,
          share_ft1: ft1?.percentage! / 100,
          share_ft2: ft2?.percentage! / 100,
          note: insumoGSMS.note,
          agc: insumoGSMS.agc,
          price_ft1: ft1?.price,
          price_ft2: ft2?.price,
          updated_at: insumoGSMS.modifiedOn,
          modified_by: insumoGSMS.modifiedBy,
        };
      }) as Insumo[],
    } as ExtendedInsumo);
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/mem-offers-input-service/availability/loadGsms',
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
        })
      }
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