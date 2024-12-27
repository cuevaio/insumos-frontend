import { useQuery } from '@tanstack/react-query';

import { CPPAPIResponse, Market } from '@/lib/types';

import { useAuth } from './useAuth';

export function useAvailabilities({
  unitId,
  date,
  market,
}: {
  unitId?: string | null;
  date?: string | null;
  market?: Market | null;
}) {
  const authToken = useAuth();

  return useQuery({
    queryFn: async () => {
      const response = await fetch(
        'http://localhost:8080/cpp-backend/v1/availability/load',
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            unitId,
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

      if (!json.success) {
        throw new Error(json.message);
      }

      const data = json.data.data;
      return {
        availabilities: data.filter(x=>x.marketType === market),
        dayDurations: json.data.days,
      };
    },
    queryKey: ['availability', unitId, date, market],
    enabled: !!unitId && !!date && !!authToken,
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
