import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/hooks/useAuth';

export interface Unit {
  id: string;

  name: string;
  portfolioName?: string;

  fuelTypeList: {
    id: string;
    name: string;
  }[];

  includeCil: boolean;
  includeLie: boolean;
}

interface UnitGSMS {
  id: string;
  name: string;
  portfolioName: string;
  fuelTypeList: FuelType[];
  includeCil: boolean;
  includeLie: boolean;
}

export function useUnits() {
  const authToken = useAuth();

  return useQuery({
    queryFn: async () => {
      const response = await fetch(
        `${__API_DOMAIN__}/api/mem-offers-input-service/unit/load`,
      );

      if (!response.ok) throw new Error('Failed to fetch units');

      const json = (await response.json()) as Unit[];

      return json;
    },
    queryKey: ['allUnits'],
    enabled: !!authToken,
  });
}
