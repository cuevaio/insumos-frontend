import { useQuery } from '@tanstack/react-query';

import { CPPAPIResponse, Market } from '@/lib/types';

import { useAuth } from './useAuth';

export interface AvailabilitiesQueryResponse {
  availabilities: AvailabilityRecord[];
  dayDurations: {
    [key: string]: number;
  };
}

export function useAvailabilities({
  unitId,
  unitName,
  date,
  market,
}: {
  unitId?: string | null;
  unitName?: string | null;
  date?: string | null;
  market?: Market | null;
}) {
  const authToken = useAuth();

  return useQuery({
    queryFn: async () => {
      const response = await fetch(
        `${__API_DOMAIN__}/api/mem-offers-input-service/availability/loadCpp`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            unitName,
            portfolioName: 'MEM_SIN',
            fromDate: date,
            toDate: date,
            statusCode: 2,
          }),
        },
      );

      const json = (await response.json()) as CPPAPIResponse<{
        data: AvailabilityRecord[];
        days: { [index: string]: number };
      }>;

      const data = json.data;

      return {
        availabilities: data.data.filter(
          (x) => x.marketType === market,
        ) as AvailabilityRecord[],
        dayDurations: data.days as { [key: string]: number },
      };
    },
    queryKey: ['availability', unitId, date, market],
    enabled: !!unitId && !!date && !!authToken && !!market,
  });
}

interface Unit {
  id: string;
  tenantId: number;
  tenantName: string;
  name: string;
  includeCil: boolean;
  includeLie: boolean;
  fixedAvailabilities: FixedAvailability[];
  hourlyAvailabilities: string[];
  fuelType1ID: string;
  fuelType2ID: string;
  createdBy: string;
  modifiedBy: string;
  modifiedOn: string;
}

export interface FixedAvailability {
  id: string;
  fuelType1FixedNetCapacity: number;
  fuelType1Cil: number;
  fuelType1Lie: number;
  fuelType2FixedNetCapacity: number;
  fuelType2Cil: number;
  fuelType2Lie: number;
  effectiveDate: string;
  unit: string;
  hourlyAvailabilities: string[];
  createdBy: string;
  modifiedBy: string;
  modifiedOn: string;
}

export interface AvailabilityRecord {
  id: string;
  date: string;
  hour: number;
  time: string;
  marketType: string;
  fuelType1NetCapacity: number;
  fuelType1AvailabilityNetCapacity: number;
  fuelType1Cil: number;
  fuelType1Lie: number;
  fuelType2NetCapacity: number;
  fuelType2AvailabilityNetCapacity: number;
  fuelType2Cil: number;
  fuelType2Lie: number;
  operationType: string;
  status: string;
  statusCode: number;
  comments: string;
  unit: Unit;
  fixedAvailability: FixedAvailability;
  createdBy: string;
  modifiedBy: string;
  modifiedOn: string;
}
