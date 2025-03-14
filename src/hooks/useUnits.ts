import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/hooks/useAuth';

import { FuelType } from '@/hooks/useFuelTypes';

export interface Unit {
  id: string;
  name: string;
  createdBy?: string;
  modifiedBy?: string;
  modifiedOn?: string;
  includeCil: boolean;
  includeLie: boolean;
  fuelType1ID: string;
  fuelType2ID?: string;
  timeZone: string;
  ippId?: string;
  ipp?: {
    id: string;
    name: string;
    createdBy: string;
    modifiedBy: string;
    modifiedOn: string;
  } | null;
  fuelType1?: FuelType;
  fuelType2?: FuelType;
  portfolioName?: string;
}

export interface UnitWithFuelType extends Unit {
  fuelType1: FuelType;
  fuelType2: FuelType;
}

export interface UnitGSMS {
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
      const json = (await response.json()) as UnitGSMS[];

      const data = json.map((unitGSMS) => {
        return {
          id: unitGSMS.id,
          name: unitGSMS.name,
          includeCil: unitGSMS.includeCil,
          includeLie: unitGSMS.includeLie,
          fuelType1: unitGSMS.fuelTypeList.find(
            (fuelTypeGSMS) => fuelTypeGSMS.name === 'Gas',
          ),
          fuelType2: unitGSMS.fuelTypeList.find(
            (fuelTypeGSMS) => fuelTypeGSMS.name === 'Diesel',
          ),
          portfolioName: unitGSMS?.portfolioName,
        } as UnitWithFuelType;
      });

      return data;
    },
    queryKey: ['allUnits'],
    enabled: !!authToken,
  });
}
