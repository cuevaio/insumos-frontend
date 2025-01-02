import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';

import { CPPAPIResponse } from '@/lib/types';

export interface FuelType {
  id: string;
  name: string;
  createdBy: string;
  modifiedBy: string;
  modifiedOn: string;
}

export function useFuelTypes() {
  const authToken = useAuth();

  return useQuery({
    queryFn: async () => {
      const response = await fetch(
        'http://localhost:8080/cpp-backend/v1/fuelType/load',
        // `${window.ENV.domain + window.ENV.backendPath + window.ENV.apiVersion
        // }/fuelType/load`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );
      const json = (await response.json()) as CPPAPIResponse<FuelType[]>;

      if (!json.success) {
        throw new Error(json.message);
      }

      return json.data;
    },
    queryKey: ['fuels'],
    enabled: !!authToken,
  });
}
