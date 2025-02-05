import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/hooks/useAuth';

import { DEV } from '@/lib/constants';
import { CPPAPIResponse } from '@/lib/types';

import { FuelType, useFuelTypes } from './useFuelTypes';

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
    createdBy: string;
    modifiedBy: string;
    modifiedOn: string;
  } | null;
  fuelType1?: FuelType;
  fuelType2?: FuelType;
}


export function useUnits() {
  const authToken = useAuth();
  const { data: fts } = useFuelTypes();

  return useQuery({
    queryFn: async () => {
      let data: Unit[];
      if (!DEV) {
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
        data = json.data;
      } else {
        data = [
          {
            id: '01930e48-70fe-0e9a-1c18-bff758c72abe',
            ippId: '01930e48-142f-22b4-a55f-775c843d0e5c',
            ipp: {
              id: '01930e48-142f-22b4-a55f-775c843d0e5c',
              name: 'default',
              createdBy: 'CPP - PRO@test.com',
              modifiedBy: 'CPP - PRO@test.com',
              modifiedOn: '2024-11-09T00:17:05.071',
            },
            name: 'unit1',
            includeCil: true,
            includeLie: true,
            fuelType1ID: '01930e47-becb-525e-6921-42428aad2825',
            fuelType2ID: '01930e47-cbd1-ec34-77e3-ba7672a95cc5',
            createdBy: 'CPP - PRO@test.com',
            modifiedBy: 'CPP - PRO@test.com',
            modifiedOn: '2024-11-09T00:17:28.831',
            timeZone: 'America/Tijuana',
          },
          {
            id: '01932144-054b-e7c5-3fa2-2722eb981ebb',
            ippId: '01930e48-142f-22b4-a55f-775c843d0e5c',
            ipp: {
              id: '01930e48-142f-22b4-a55f-775c843d0e5c',
              name: 'default',
              createdBy: 'CPP - PRO@test.com',
              modifiedBy: 'CPP - PRO@test.com',
              modifiedOn: '2024-11-09T00:17:05.071',
            },
            name: 'unit2',
            includeCil: false,
            includeLie: true,
            fuelType1ID: '01930e47-becb-525e-6921-42428aad2825',
            createdBy: 'CPP - PRO@test.com',
            modifiedBy: 'CPP - PRO@test.com',
            modifiedOn: '2024-11-12T16:45:26.219',
            timeZone: 'America/Tijuana',
          },
          {
            id: '019330b2-1c5c-26ab-a9b7-fa209ed976b3',
            ippId: '01930e48-142f-22b4-a55f-775c843d0e5c',
            ipp: {
              id: '01930e48-142f-22b4-a55f-775c843d0e5c',
              name: 'default',
              createdBy: 'CPP - PRO@test.com',
              modifiedBy: 'CPP - PRO@test.com',
              modifiedOn: '2024-11-09T00:17:05.071',
            },
            name: 'sdf',
            includeCil: false,
            includeLie: true,
            fuelType1ID: '01930e47-cbd1-ec34-77e3-ba7672a95cc5',
            createdBy: 'CPP - PRO@test.com',
            modifiedBy: 'CPP - PRO@test.com',
            modifiedOn: '2024-11-15T16:39:59.325',
            timeZone: 'America/Chihuahua',
          },
          {
            id: '019387e0-f6e2-132d-d4ad-5b9253b7d480',
            ippId: '019331cf-ddfb-5b77-2bb0-0fd841cd319c',
            ipp: {
              id: '019331cf-ddfb-5b77-2bb0-0fd841cd319c',
              name: 'asfgd',
              createdBy: 'CPP - PRO@test.com',
              modifiedBy: 'CPP - PRO@test.com',
              modifiedOn: '2024-11-15T21:52:06.652',
            },
            name: 'Cancun',
            includeCil: true,
            includeLie: true,
            fuelType1ID: '01930e47-becb-525e-6921-42428aad2825',
            fuelType2ID: '01930e47-cbd1-ec34-77e3-ba7672a95cc5',
            createdBy: 'CPP - PRO@test.com',
            modifiedBy: 'CPP - PRO@test.com',
            modifiedOn: '2024-12-02T14:58:07.715',
            timeZone: 'America/Cancun',
          },
        ];
      }

      if (DEV) {
        return [
          {
            id: '01930e48-70fe-0e9a-1c18-bff758c72abe',
            ippId: '01930e48-142f-22b4-a55f-775c843d0e5c',
            ipp: {
              id: '01930e48-142f-22b4-a55f-775c843d0e5c',
              name: 'default',
              createdBy: 'CPP - PRO@test.com',
              modifiedBy: 'CPP - PRO@test.com',
              modifiedOn: '2024-11-09T00:17:05.071',
            },
            name: 'unit1',
            includeCil: true,
            includeLie: true,
            fuelType1ID: '01930e47-becb-525e-6921-42428aad2825',
            fuelType2ID: '01930e47-cbd1-ec34-77e3-ba7672a95cc5',
            createdBy: 'CPP - PRO@test.com',
            modifiedBy: 'CPP - PRO@test.com',
            modifiedOn: '2024-11-09T00:17:28.831',
            timeZone: 'America/Tijuana',
            fuelType1: {
              id: '01930e47-becb-525e-6921-42428aad2825',
              name: 'gas',
              createdBy: 'CPP - PRO@test.com',
              modifiedBy: 'CPP - PRO@test.com',
              modifiedOn: '2024-11-09T00:16:43.212',
            },
            fuelType2: {
              id: '01930e47-cbd1-ec34-77e3-ba7672a95cc5',
              name: 'diesel',
              createdBy: 'CPP - PRO@test.com',
              modifiedBy: 'CPP - PRO@test.com',
              modifiedOn: '2024-11-09T00:16:46.546',
            },
          },
          {
            id: '01932144-054b-e7c5-3fa2-2722eb981ebb',
            ippId: '01930e48-142f-22b4-a55f-775c843d0e5c',
            ipp: {
              id: '01930e48-142f-22b4-a55f-775c843d0e5c',
              name: 'default',
              createdBy: 'CPP - PRO@test.com',
              modifiedBy: 'CPP - PRO@test.com',
              modifiedOn: '2024-11-09T00:17:05.071',
            },
            name: 'unit2',
            includeCil: false,
            includeLie: true,
            fuelType1ID: '01930e47-becb-525e-6921-42428aad2825',
            createdBy: 'CPP - PRO@test.com',
            modifiedBy: 'CPP - PRO@test.com',
            modifiedOn: '2024-11-12T16:45:26.219',
            timeZone: 'America/Tijuana',
            fuelType1: {
              id: '01930e47-becb-525e-6921-42428aad2825',
              name: 'gas',
              createdBy: 'CPP - PRO@test.com',
              modifiedBy: 'CPP - PRO@test.com',
              modifiedOn: '2024-11-09T00:16:43.212',
            },
          },
          {
            id: '019330b2-1c5c-26ab-a9b7-fa209ed976b3',
            ippId: '01930e48-142f-22b4-a55f-775c843d0e5c',
            ipp: {
              id: '01930e48-142f-22b4-a55f-775c843d0e5c',
              name: 'default',
              createdBy: 'CPP - PRO@test.com',
              modifiedBy: 'CPP - PRO@test.com',
              modifiedOn: '2024-11-09T00:17:05.071',
            },
            name: 'sdf',
            includeCil: false,
            includeLie: true,
            fuelType1ID: '01930e47-cbd1-ec34-77e3-ba7672a95cc5',
            createdBy: 'CPP - PRO@test.com',
            modifiedBy: 'CPP - PRO@test.com',
            modifiedOn: '2024-11-15T16:39:59.325',
            timeZone: 'America/Chihuahua',
            fuelType1: {
              id: '01930e47-cbd1-ec34-77e3-ba7672a95cc5',
              name: 'diesel',
              createdBy: 'CPP - PRO@test.com',
              modifiedBy: 'CPP - PRO@test.com',
              modifiedOn: '2024-11-09T00:16:46.546',
            },
          },
          {
            id: '019387e0-f6e2-132d-d4ad-5b9253b7d480',
            ippId: '019331cf-ddfb-5b77-2bb0-0fd841cd319c',
            ipp: {
              id: '019331cf-ddfb-5b77-2bb0-0fd841cd319c',
              name: 'asfgd',
              createdBy: 'CPP - PRO@test.com',
              modifiedBy: 'CPP - PRO@test.com',
              modifiedOn: '2024-11-15T21:52:06.652',
            },
            name: 'Cancun',
            includeCil: true,
            includeLie: true,
            fuelType1ID: '01930e47-becb-525e-6921-42428aad2825',
            fuelType2ID: '01930e47-cbd1-ec34-77e3-ba7672a95cc5',
            createdBy: 'CPP - PRO@test.com',
            modifiedBy: 'CPP - PRO@test.com',
            modifiedOn: '2024-12-02T14:58:07.715',
            timeZone: 'America/Cancun',
            fuelType1: {
              id: '01930e47-becb-525e-6921-42428aad2825',
              name: 'gas',
              createdBy: 'CPP - PRO@test.com',
              modifiedBy: 'CPP - PRO@test.com',
              modifiedOn: '2024-11-09T00:16:43.212',
            },
            fuelType2: {
              id: '01930e47-cbd1-ec34-77e3-ba7672a95cc5',
              name: 'diesel',
              createdBy: 'CPP - PRO@test.com',
              modifiedBy: 'CPP - PRO@test.com',
              modifiedOn: '2024-11-09T00:16:46.546',
            },
          },
        ];
      }
      return data.map((u) => ({
        ...u,
        fuelType1: fts?.find((x) => x.id === u.fuelType1ID),
        fuelType2: fts?.find((x) => x.id === u.fuelType2ID),
      }));
    },
    queryKey: ['allUnits'],
    enabled: !!authToken,
  });
}
