import { useMutation, useQueryClient } from '@tanstack/react-query';

import { InsumoInsert, Market } from '@/lib/types';

export const useUpsertInsumos = (data: {
  date?: string | null;
  unitId?: string | null;
  market?: Market | null;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (insumos: InsumoInsert[]) => {
      const response = await fetch('https://cpp.cueva.io/api/insumos', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          date: data.date,
          unit_id: data.unitId,
          market: data.market,
          insumos,
        }),
      });

      const json = (await response.json()) as {
        data: { inserted: number; updated: number };
      };
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['insumos', data.date, data.unitId, data.market],
      });
    },
  });
};
