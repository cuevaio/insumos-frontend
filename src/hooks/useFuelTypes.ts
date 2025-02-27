import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/hooks/useAuth';

import { DEV } from '@/lib/constants';
import { CPPAPIResponse } from '@/lib/types';

export interface FuelType {
  id: string;
  name: string;
  createdBy?: string;
  modifiedBy?: string;
  modifiedOn?: string;
}

export function useFuelTypes() {
  const authToken = useAuth();

  return useQuery({
    queryFn: async () => {
      let data: FuelType[];
      if (!DEV) {
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
        data = json.data;
      } else {
        data = [
          {
            id: '01930e47-becb-525e-6921-42428aad2825',
            name: 'gas',
            createdBy: 'CPP - PRO@test.com',
            modifiedBy: 'CPP - PRO@test.com',
            modifiedOn: '2024-11-09T00:16:43.212',
          },
          {
            id: '01930e47-cbd1-ec34-77e3-ba7672a95cc5',
            name: 'diesel',
            createdBy: 'CPP - PRO@test.com',
            modifiedBy: 'CPP - PRO@test.com',
            modifiedOn: '2024-11-09T00:16:46.546',
          },
        ];
      }

      return data;
    },
    queryKey: ['fuels'],
    enabled: !!authToken,
  });
}
