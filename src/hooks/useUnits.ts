import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/hooks/useAuth';

import { CPPAPIResponse } from '@/lib/types';

export interface Unit {
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
interface FuelType {
  id: string;
  name: string;
  createdBy: string;
  modifiedBy: string;
  modifiedOn: string;
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

      const ft_response = await fetch(
        'http://localhost:8080/cpp-backend/v1/fuelType/load',
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );
      const ft_json = (await ft_response.json()) as CPPAPIResponse<FuelType[]>;

      return json.data.map((u) => ({
        ...u,
        fuelType1: ft_json.data.find((x) => x.id === u.fuelType1ID),
        fuelType2: ft_json.data.find((x) => x.id === u.fuelType2ID),
      }));
    },
    queryKey: ['allUnits'],
    enabled: !!authToken,
  });
}
