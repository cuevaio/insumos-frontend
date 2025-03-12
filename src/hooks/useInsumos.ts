import { useQuery } from '@tanstack/react-query';

import type { Market, Note } from '@/lib/types';

import { Unit } from './useUnits';

export interface Insumo {
  hour: number;
  min: number;
  max: number;
  share_ft1: number | null;
  share_ft2: number | null;
  note: Note | null;
  agc: boolean;
  price_ft1: number | null;
  price_ft2: number | null;
  created_at: string;
  updated_at: string;
  modified_by: string;
}

export interface ExtendedInsumo {
  date: string;
  market: string;
  unit_id: string;
  insumos: Insumo[];
  averageLast30Days: number;
  transmissionFee: number;
  operationFee: number;
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
  unit,
  market,
}: {
  date?: string | null;
  unit?: Unit | null;
  market?: Market | null;
}) => {
  return useQuery({
    queryFn: async () => {
      const response = await fetch(
        `${__API_DOMAIN__}/api/mem-offers-input-service/availability/loadGsms`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            unitName: unit?.name,
            portfolioName: unit?.portfolioName,
            fromDate: date,
            toDate: date,
            statusCode: 1,
          }),
        },
      );

      const json = (await response.json()) as {
        data: ExtendedInsumoGSMS;
      };

      const data = {
        date,
        market,
        unit_id: unit?.id,
        insumos: json.data.data.map((insumoGSMS, idx) => {
          const ft1 = insumoGSMS.fuels.find((fuel) =>
            fuel.name.startsWith('G_'),
          );
          const ft2 = insumoGSMS.fuels.find((fuel) =>
            fuel.name.startsWith('D_'),
          );

          return {
            hour: idx + 1,
            min: insumoGSMS.minAvailability,
            max: insumoGSMS.maxAvailability,
            share_ft1:
              typeof ft1?.percentage === 'number' ? ft1.percentage / 100 : null,
            share_ft2:
              typeof ft2?.percentage === 'number' ? ft2.percentage / 100 : null,
            note: insumoGSMS.note.length > 0 ? insumoGSMS.note : null,
            agc: insumoGSMS.agc,
            price_ft1: typeof ft1?.price === 'number' ? ft1.price : null,
            price_ft2: typeof ft2?.price === 'number' ? ft2.price : null,
            updated_at: insumoGSMS.modifiedOn,
            modified_by: insumoGSMS.modifiedBy,
          };
        }) as Insumo[],
        averageLast30Days: json.data.averageLast30Days,
        transmissionFee: json.data.transmissionFee,
        operationFee: json.data.operationFee,
      } as ExtendedInsumo;

      return data;
    },
    enabled: Boolean(date) && Boolean(unit?.id) && Boolean(market),
    queryKey: ['insumos', date, unit?.id, market],
  });
};
