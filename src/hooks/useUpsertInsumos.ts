import { useDate, useUnit } from '@/contexts/AppContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CPPAPIResponse, type InsumoInsert } from '@/lib/types';

export const useUpsertInsumos = () => {
  const queryClient = useQueryClient();

  const { value: unit } = useUnit();
  const { value: date } = useDate();

  return useMutation({
    mutationFn: async (insumos: InsumoInsert[]) => {
      const response = await fetch(
        `${__API_DOMAIN__}/api/mem-offers-input-service/availability/upsert`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            unitName: unit?.name,
            portfolioName: unit?.portfolioName,
            date: date?.toString(),
            data: insumos.map((insumo) => ({
              hour: insumo.hour,
              minAvailability: insumo.min,
              maxAvailability: insumo.max,
              fuels: [{ name: 'G_FEN', percentage: 100, price: 5.17 }],
              agc: insumo.agc,
              note: insumo.note,
            })),
          }),
        },
      );

      const json = (await response.json()) as CPPAPIResponse<{}>;

      if (!json.success) throw new Error(json.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['insumos', date, unit?.name],
      });
    },
  });
};
