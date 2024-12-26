import { useQuery } from '@tanstack/react-query';

import { CPPAPIResponse } from '@/lib/types';

import { useAuth } from './useAuth';

interface Unit {
  id: string;
  name: string;
  createdBy: string;
  modifiedBy: string;
  modifiedOn: string;
  includeCil: boolean;
  includeLie: boolean;
  fuelType1ID: string;
  fuelType2ID?: string;
  timeZone: string;
  ippId: string;
  ipp: {
    id: string;
    name: string;
  } | null;
}

export function useUnits() {
  const authToken = useAuth();

  return useQuery({
    queryFn: async () => {
      const response = await fetch(
        'http://localhost:8080/cpp-backend/v1/unit/load/all',
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );
      const json = (await response.json()) as CPPAPIResponse<Unit[]>;

      if (!json.success) {
        throw new Error(json.message);
      }

      return json.data;
    },
    queryKey: ['allUnits'],
    enabled: !!authToken,
  });
}
