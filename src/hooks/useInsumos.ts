import { useQuery } from '@tanstack/react-query';

import type { Market, Note } from '@/lib/types';

export const useInsumos = ({
  date,
  unitId,
  market,
}: {
  date?: string | null;
  unitId?: string | null;
  market?: Market | null;
}) => {
  return useQuery({
    queryFn: async () => {
      const response = await fetch(
        `https://cpp.cueva.io/api/insumos?date=${date}&unit_id=${unitId}&market=${market}`,
      );

      const json = (await response.json()) as {
        data: {
          date: string;
          market: string;
          unit_id: string;
          insumos: {
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
          }[];
        };
      };

      return json.data;
    },
    enabled: Boolean(date) && Boolean(unitId) && Boolean(market),
    queryKey: ['insumos', date, unitId, market],
  });
};
