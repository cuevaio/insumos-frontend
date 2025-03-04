import { useQuery } from '@tanstack/react-query';

import type { Market, Note } from '@/lib/types';

export interface Insumo {
  hour: number;
  min: number;
  max: number;
  share_ft1?: number;
  share_ft2?: number;
  note: Note;
  agc: boolean;
  price_ft1: number;
  price_ft2?: number;
  created_at: string;
  updated_at: string;
  modified_by: string;
}

export interface ExtendedInsumo {
  date: string;
  market: string;
  unit_id: string;
  insumos: Insumo[];
}

interface FuelGSMS {
    name: string;
    percentage: number;
    price: number;
}

interface InsumoGSMS {
    minAvailability: number;
    maxAvailability: number;
    fuels: FuelGSMS[];
    agc: boolean;
    note: string;
    modifiedBy: string;
    modifiedOn: string;
}

interface ExtendedInsumoGSMS {
    data: InsumoGSMS[];
    averageLast30Days: number;
    transmissionFee: number;
    operationFee: number;
}

export const useInsumos = ({
  date,
  unitId,
  unitName,
  portfolioName,
  market,
}: {
  date?: string | null;
  unitId?: string | null;
  unitName?: string | null;
  portfolioName?: string | null;
  market?: Market | null;
}) => {
  return useQuery({
    queryFn: async () => {
      const response = await fetch(`${__API_DOMAIN__}/api/mem-offers-input-service/availability/loadGsms`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          unitName,
          portfolioName,
          fromDate: date,
          toDate: date,
          statusCode: 1,
        })
      });

      const json = (await response.json()) as {
        data: ExtendedInsumoGSMS;
      };

      const data = {
        date,
        market,
        unit_id: unitId,
        insumos: json.data.data.map((insumoGSMS, idx) => {
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
      } as ExtendedInsumo;

      return data;
    },
    enabled: Boolean(date) && Boolean(unitId) && Boolean(market),
    queryKey: ['insumos', date, unitId, market],
  });
};
