import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import AvailabilitiesTableBody from '.';

const queryClient = new QueryClient();

const MOCK_AVAILABILITIES = {
  availabilities: [
    {
      id: '0193217b-3ae9-d379-dfe5-afc556723dbd',
      date: '2025-02-01',
      hour: 1,
      marketType: 'MDA',
      fuelType1NetCapacity: 457,
      fuelType1AvailabilityNetCapacity: 75.5,
      fuelType1Cil: 317.5,
      fuelType1Lie: 276.9,
      fuelType2NetCapacity: 519,
      fuelType2AvailabilityNetCapacity: 376.5,
      fuelType2Cil: 235,
      fuelType2Lie: 234,
      operationType: 'Operación Obligada',
      status: 'PUBLISHED',
      statusCode: 2,
      comments: null,
      unitId: '01930e48-70fe-0e9a-1c18-bff758c72abe',
      unit: null,
      fixedAvailabilityId: '01932178-616a-f878-e804-1774eb55de18',
      fixedAvailability: {
        id: '01932178-616a-f878-e804-1774eb55de18',
        fuelType1FixedNetCapacity: 123,
        fuelType1Cil: 317.5,
        fuelType1Lie: 276.9,
        fuelType2FixedNetCapacity: 212,
        fuelType2Cil: 235,
        fuelType2Lie: 234,
        effectiveDate: '2023-03-11',
        unitId: '01930e48-70fe-0e9a-1c18-bff758c72abe',
        unit: null,
        hourlyAvailabilities: null,
        createdBy: 'CPP - PRO@test.com',
        modifiedBy: 'CPP - PRO@test.com',
        modifiedOn: '2024-11-12T17:42:37.674',
      },
      createdBy: 'CPP - PRO@test.com',
      modifiedBy: 'cpp - pro@test.com',
      modifiedOn: '2024-11-12T17:45:44.426',
    },
    {
      id: '0193217b-3ae9-d379-dfe5-afc556723dbe',
      date: '2025-02-01',
      hour: 2,
      marketType: 'MDA',
      fuelType1NetCapacity: 457,
      fuelType1AvailabilityNetCapacity: 75.5,
      fuelType1Cil: 317.5,
      fuelType1Lie: 276.9,
      fuelType2NetCapacity: 519,
      fuelType2AvailabilityNetCapacity: 376.5,
      fuelType2Cil: 235,
      fuelType2Lie: 234,
      operationType: 'Operación Obligada',
      status: 'PUBLISHED',
      statusCode: 2,
      comments: null,
      unitId: '01930e48-70fe-0e9a-1c18-bff758c72abe',
      unit: null,
      fixedAvailabilityId: '01932178-616a-f878-e804-1774eb55de18',
      fixedAvailability: {
        id: '01932178-616a-f878-e804-1774eb55de18',
        fuelType1FixedNetCapacity: 123,
        fuelType1Cil: 317.5,
        fuelType1Lie: 276.9,
        fuelType2FixedNetCapacity: 212,
        fuelType2Cil: 235,
        fuelType2Lie: 234,
        effectiveDate: '2023-03-11',
        unitId: '01930e48-70fe-0e9a-1c18-bff758c72abe',
        unit: null,
        hourlyAvailabilities: null,
        createdBy: 'CPP - PRO@test.com',
        modifiedBy: 'CPP - PRO@test.com',
        modifiedOn: '2024-11-12T17:42:37.674',
      },
      createdBy: 'CPP - PRO@test.com',
      modifiedBy: 'cpp - pro@test.com',
      modifiedOn: '2024-11-12T17:45:44.426',
    },
    {
      id: '0193217b-3ae9-d379-dfe5-afc556723dbf',
      date: '2025-02-01',
      hour: 3,
      marketType: 'MDA',
      fuelType1NetCapacity: 457,
      fuelType1AvailabilityNetCapacity: 567,
      fuelType1Cil: 317.5,
      fuelType1Lie: 276.9,
      fuelType2NetCapacity: 519,
      fuelType2AvailabilityNetCapacity: 376.5,
      fuelType2Cil: 235,
      fuelType2Lie: 234,
      operationType: 'Disponible a Despacho',
      status: 'PUBLISHED',
      statusCode: 2,
      comments: null,
      unitId: '01930e48-70fe-0e9a-1c18-bff758c72abe',
      unit: null,
      fixedAvailabilityId: '01932178-616a-f878-e804-1774eb55de18',
      fixedAvailability: {
        id: '01932178-616a-f878-e804-1774eb55de18',
        fuelType1FixedNetCapacity: 123,
        fuelType1Cil: 317.5,
        fuelType1Lie: 276.9,
        fuelType2FixedNetCapacity: 212,
        fuelType2Cil: 235,
        fuelType2Lie: 234,
        effectiveDate: '2023-03-11',
        unitId: '01930e48-70fe-0e9a-1c18-bff758c72abe',
        unit: null,
        hourlyAvailabilities: null,
        createdBy: 'CPP - PRO@test.com',
        modifiedBy: 'CPP - PRO@test.com',
        modifiedOn: '2024-11-12T17:42:37.674',
      },
      createdBy: 'CPP - PRO@test.com',
      modifiedBy: 'cpp - pro@test.com',
      modifiedOn: '2024-11-12T17:45:44.426',
    },
    {
      id: '0193217b-3ae9-d379-dfe5-afc556723dc0',
      date: '2025-02-01',
      hour: 4,
      marketType: 'MDA',
      fuelType1NetCapacity: 457,
      fuelType1AvailabilityNetCapacity: 567,
      fuelType1Cil: 317.5,
      fuelType1Lie: 276.9,
      fuelType2NetCapacity: 519,
      fuelType2AvailabilityNetCapacity: 376.5,
      fuelType2Cil: 235,
      fuelType2Lie: 234,
      operationType: 'Disponible a Despacho',
      status: 'PUBLISHED',
      statusCode: 2,
      comments: null,
      unitId: '01930e48-70fe-0e9a-1c18-bff758c72abe',
      unit: null,
      fixedAvailabilityId: '01932178-616a-f878-e804-1774eb55de18',
      fixedAvailability: {
        id: '01932178-616a-f878-e804-1774eb55de18',
        fuelType1FixedNetCapacity: 123,
        fuelType1Cil: 317.5,
        fuelType1Lie: 276.9,
        fuelType2FixedNetCapacity: 212,
        fuelType2Cil: 235,
        fuelType2Lie: 234,
        effectiveDate: '2023-03-11',
        unitId: '01930e48-70fe-0e9a-1c18-bff758c72abe',
        unit: null,
        hourlyAvailabilities: null,
        createdBy: 'CPP - PRO@test.com',
        modifiedBy: 'CPP - PRO@test.com',
        modifiedOn: '2024-11-12T17:42:37.674',
      },
      createdBy: 'CPP - PRO@test.com',
      modifiedBy: 'cpp - pro@test.com',
      modifiedOn: '2024-11-12T17:45:44.426',
    },
    {
      id: '0193217b-3ae9-d379-dfe5-afc556723dc1',
      date: '2025-02-01',
      hour: 5,
      marketType: 'MDA',
      fuelType1NetCapacity: 457,
      fuelType1AvailabilityNetCapacity: 567,
      fuelType1Cil: 317.5,
      fuelType1Lie: 276.9,
      fuelType2NetCapacity: 519,
      fuelType2AvailabilityNetCapacity: 376.5,
      fuelType2Cil: 235,
      fuelType2Lie: 234,
      operationType: 'Disponible a Despacho',
      status: 'PUBLISHED',
      statusCode: 2,
      comments: null,
      unitId: '01930e48-70fe-0e9a-1c18-bff758c72abe',
      unit: null,
      fixedAvailabilityId: '01932178-616a-f878-e804-1774eb55de18',
      fixedAvailability: {
        id: '01932178-616a-f878-e804-1774eb55de18',
        fuelType1FixedNetCapacity: 123,
        fuelType1Cil: 317.5,
        fuelType1Lie: 276.9,
        fuelType2FixedNetCapacity: 212,
        fuelType2Cil: 235,
        fuelType2Lie: 234,
        effectiveDate: '2023-03-11',
        unitId: '01930e48-70fe-0e9a-1c18-bff758c72abe',
        unit: null,
        hourlyAvailabilities: null,
        createdBy: 'CPP - PRO@test.com',
        modifiedBy: 'CPP - PRO@test.com',
        modifiedOn: '2024-11-12T17:42:37.674',
      },
      createdBy: 'CPP - PRO@test.com',
      modifiedBy: 'cpp - pro@test.com',
      modifiedOn: '2024-11-12T17:45:44.426',
    },
    {
      id: '0193217b-3ae9-d379-dfe5-afc556723dc2',
      date: '2025-02-01',
      hour: 6,
      marketType: 'MDA',
      fuelType1NetCapacity: 457,
      fuelType1AvailabilityNetCapacity: 567,
      fuelType1Cil: 317.5,
      fuelType1Lie: 276.9,
      fuelType2NetCapacity: 519,
      fuelType2AvailabilityNetCapacity: 376.5,
      fuelType2Cil: 235,
      fuelType2Lie: 234,
      operationType: 'Disponible a Despacho',
      status: 'PUBLISHED',
      statusCode: 2,
      comments: 'Restricción de despacho con límite mínimo',
      unitId: '01930e48-70fe-0e9a-1c18-bff758c72abe',
      unit: null,
      fixedAvailabilityId: '01932178-616a-f878-e804-1774eb55de18',
      fixedAvailability: {
        id: '01932178-616a-f878-e804-1774eb55de18',
        fuelType1FixedNetCapacity: 123,
        fuelType1Cil: 317.5,
        fuelType1Lie: 276.9,
        fuelType2FixedNetCapacity: 212,
        fuelType2Cil: 235,
        fuelType2Lie: 234,
        effectiveDate: '2023-03-11',
        unitId: '01930e48-70fe-0e9a-1c18-bff758c72abe',
        unit: null,
        hourlyAvailabilities: null,
        createdBy: 'CPP - PRO@test.com',
        modifiedBy: 'CPP - PRO@test.com',
        modifiedOn: '2024-11-12T17:42:37.674',
      },
      createdBy: 'CPP - PRO@test.com',
      modifiedBy: 'cpp - pro@test.com',
      modifiedOn: '2024-11-12T17:45:44.426',
    },
    {
      id: '0193217b-3ae9-d379-dfe5-afc556723dc3',
      date: '2025-02-01',
      hour: 7,
      marketType: 'MDA',
      fuelType1NetCapacity: 457,
      fuelType1AvailabilityNetCapacity: 567,
      fuelType1Cil: 317.5,
      fuelType1Lie: 276.9,
      fuelType2NetCapacity: 519,
      fuelType2AvailabilityNetCapacity: 376.5,
      fuelType2Cil: 235,
      fuelType2Lie: 234,
      operationType: 'Disponible a Despacho',
      status: 'PUBLISHED',
      statusCode: 2,
      comments: 'Restricción de despacho con límite mínimo',
      unitId: '01930e48-70fe-0e9a-1c18-bff758c72abe',
      unit: null,
      fixedAvailabilityId: '01932178-616a-f878-e804-1774eb55de18',
      fixedAvailability: {
        id: '01932178-616a-f878-e804-1774eb55de18',
        fuelType1FixedNetCapacity: 123,
        fuelType1Cil: 317.5,
        fuelType1Lie: 276.9,
        fuelType2FixedNetCapacity: 212,
        fuelType2Cil: 235,
        fuelType2Lie: 234,
        effectiveDate: '2023-03-11',
        unitId: '01930e48-70fe-0e9a-1c18-bff758c72abe',
        unit: null,
        hourlyAvailabilities: null,
        createdBy: 'CPP - PRO@test.com',
        modifiedBy: 'CPP - PRO@test.com',
        modifiedOn: '2024-11-12T17:42:37.674',
      },
      createdBy: 'CPP - PRO@test.com',
      modifiedBy: 'cpp - pro@test.com',
      modifiedOn: '2024-11-12T17:45:44.426',
    },
    {
      id: '0193217b-3ae9-d379-dfe5-afc556723dc4',
      date: '2025-02-01',
      hour: 8,
      marketType: 'MDA',
      fuelType1NetCapacity: 457,
      fuelType1AvailabilityNetCapacity: 567,
      fuelType1Cil: 317.5,
      fuelType1Lie: 276.9,
      fuelType2NetCapacity: 519,
      fuelType2AvailabilityNetCapacity: 376.5,
      fuelType2Cil: 235,
      fuelType2Lie: 234,
      operationType: 'Disponible a Despacho',
      status: 'PUBLISHED',
      statusCode: 2,
      comments: 'Restricción de despacho con límite mínimo',
      unitId: '01930e48-70fe-0e9a-1c18-bff758c72abe',
      unit: null,
      fixedAvailabilityId: '01932178-616a-f878-e804-1774eb55de18',
      fixedAvailability: {
        id: '01932178-616a-f878-e804-1774eb55de18',
        fuelType1FixedNetCapacity: 123,
        fuelType1Cil: 317.5,
        fuelType1Lie: 276.9,
        fuelType2FixedNetCapacity: 212,
        fuelType2Cil: 235,
        fuelType2Lie: 234,
        effectiveDate: '2023-03-11',
        unitId: '01930e48-70fe-0e9a-1c18-bff758c72abe',
        unit: null,
        hourlyAvailabilities: null,
        createdBy: 'CPP - PRO@test.com',
        modifiedBy: 'CPP - PRO@test.com',
        modifiedOn: '2024-11-12T17:42:37.674',
      },
      createdBy: 'CPP - PRO@test.com',
      modifiedBy: 'cpp - pro@test.com',
      modifiedOn: '2024-11-12T17:45:44.426',
    },
    {
      id: '0193217b-3ae9-d379-dfe5-afc556723dc5',
      date: '2025-02-01',
      hour: 9,
      marketType: 'MDA',
      fuelType1NetCapacity: 457,
      fuelType1AvailabilityNetCapacity: 567,
      fuelType1Cil: 317.5,
      fuelType1Lie: 276.9,
      fuelType2NetCapacity: 519,
      fuelType2AvailabilityNetCapacity: 376.5,
      fuelType2Cil: 235,
      fuelType2Lie: 234,
      operationType: 'Disponible a Despacho',
      status: 'PUBLISHED',
      statusCode: 2,
      comments: null,
      unitId: '01930e48-70fe-0e9a-1c18-bff758c72abe',
      unit: null,
      fixedAvailabilityId: '01932178-616a-f878-e804-1774eb55de18',
      fixedAvailability: {
        id: '01932178-616a-f878-e804-1774eb55de18',
        fuelType1FixedNetCapacity: 123,
        fuelType1Cil: 317.5,
        fuelType1Lie: 276.9,
        fuelType2FixedNetCapacity: 212,
        fuelType2Cil: 235,
        fuelType2Lie: 234,
        effectiveDate: '2023-03-11',
        unitId: '01930e48-70fe-0e9a-1c18-bff758c72abe',
        unit: null,
        hourlyAvailabilities: null,
        createdBy: 'CPP - PRO@test.com',
        modifiedBy: 'CPP - PRO@test.com',
        modifiedOn: '2024-11-12T17:42:37.674',
      },
      createdBy: 'CPP - PRO@test.com',
      modifiedBy: 'cpp - pro@test.com',
      modifiedOn: '2024-11-12T17:45:44.426',
    },
    {
      id: '0193217b-3ae9-d379-dfe5-afc556723dc6',
      date: '2025-02-01',
      hour: 10,
      marketType: 'MDA',
      fuelType1NetCapacity: 457,
      fuelType1AvailabilityNetCapacity: 567,
      fuelType1Cil: 317.5,
      fuelType1Lie: 276.9,
      fuelType2NetCapacity: 519,
      fuelType2AvailabilityNetCapacity: 376.5,
      fuelType2Cil: 235,
      fuelType2Lie: 234,
      operationType: 'Disponible a Despacho',
      status: 'PUBLISHED',
      statusCode: 2,
      comments: null,
      unitId: '01930e48-70fe-0e9a-1c18-bff758c72abe',
      unit: null,
      fixedAvailabilityId: '01932178-616a-f878-e804-1774eb55de18',
      fixedAvailability: {
        id: '01932178-616a-f878-e804-1774eb55de18',
        fuelType1FixedNetCapacity: 123,
        fuelType1Cil: 317.5,
        fuelType1Lie: 276.9,
        fuelType2FixedNetCapacity: 212,
        fuelType2Cil: 235,
        fuelType2Lie: 234,
        effectiveDate: '2023-03-11',
        unitId: '01930e48-70fe-0e9a-1c18-bff758c72abe',
        unit: null,
        hourlyAvailabilities: null,
        createdBy: 'CPP - PRO@test.com',
        modifiedBy: 'CPP - PRO@test.com',
        modifiedOn: '2024-11-12T17:42:37.674',
      },
      createdBy: 'CPP - PRO@test.com',
      modifiedBy: 'cpp - pro@test.com',
      modifiedOn: '2024-11-12T17:45:44.426',
    },
    {
      id: '0193217b-3ae9-d379-dfe5-afc556723dc7',
      date: '2025-02-01',
      hour: 11,
      marketType: 'MDA',
      fuelType1NetCapacity: 457,
      fuelType1AvailabilityNetCapacity: 0,
      fuelType1Cil: 317.5,
      fuelType1Lie: 276.9,
      fuelType2NetCapacity: 519,
      fuelType2AvailabilityNetCapacity: 376.5,
      fuelType2Cil: 235,
      fuelType2Lie: 234,
      operationType: 'Disponible a Despacho',
      status: 'PUBLISHED',
      statusCode: 2,
      comments: null,
      unitId: '01930e48-70fe-0e9a-1c18-bff758c72abe',
      unit: null,
      fixedAvailabilityId: '01932178-616a-f878-e804-1774eb55de18',
      fixedAvailability: {
        id: '01932178-616a-f878-e804-1774eb55de18',
        fuelType1FixedNetCapacity: 123,
        fuelType1Cil: 317.5,
        fuelType1Lie: 276.9,
        fuelType2FixedNetCapacity: 212,
        fuelType2Cil: 235,
        fuelType2Lie: 234,
        effectiveDate: '2023-03-11',
        unitId: '01930e48-70fe-0e9a-1c18-bff758c72abe',
        unit: null,
        hourlyAvailabilities: null,
        createdBy: 'CPP - PRO@test.com',
        modifiedBy: 'CPP - PRO@test.com',
        modifiedOn: '2024-11-12T17:42:37.674',
      },
      createdBy: 'CPP - PRO@test.com',
      modifiedBy: 'cpp - pro@test.com',
      modifiedOn: '2024-11-12T17:45:44.426',
    },
    {
      id: '0193217b-3ae9-d379-dfe5-afc556723dc8',
      date: '2025-02-01',
      hour: 12,
      marketType: 'MDA',
      fuelType1NetCapacity: 457,
      fuelType1AvailabilityNetCapacity: 0,
      fuelType1Cil: 317.5,
      fuelType1Lie: 276.9,
      fuelType2NetCapacity: 519,
      fuelType2AvailabilityNetCapacity: 376.5,
      fuelType2Cil: 235,
      fuelType2Lie: 234,
      operationType: 'Disponible a Despacho',
      status: 'PUBLISHED',
      statusCode: 2,
      comments: null,
      unitId: '01930e48-70fe-0e9a-1c18-bff758c72abe',
      unit: null,
      fixedAvailabilityId: '01932178-616a-f878-e804-1774eb55de18',
      fixedAvailability: {
        id: '01932178-616a-f878-e804-1774eb55de18',
        fuelType1FixedNetCapacity: 123,
        fuelType1Cil: 317.5,
        fuelType1Lie: 276.9,
        fuelType2FixedNetCapacity: 212,
        fuelType2Cil: 235,
        fuelType2Lie: 234,
        effectiveDate: '2023-03-11',
        unitId: '01930e48-70fe-0e9a-1c18-bff758c72abe',
        unit: null,
        hourlyAvailabilities: null,
        createdBy: 'CPP - PRO@test.com',
        modifiedBy: 'CPP - PRO@test.com',
        modifiedOn: '2024-11-12T17:42:37.674',
      },
      createdBy: 'CPP - PRO@test.com',
      modifiedBy: 'cpp - pro@test.com',
      modifiedOn: '2024-11-12T17:45:44.426',
    },
    {
      id: '0193217b-3ae9-d379-dfe5-afc556723dc9',
      date: '2025-02-01',
      hour: 13,
      marketType: 'MDA',
      fuelType1NetCapacity: 457,
      fuelType1AvailabilityNetCapacity: 567,
      fuelType1Cil: 317.5,
      fuelType1Lie: 276.9,
      fuelType2NetCapacity: 519,
      fuelType2AvailabilityNetCapacity: 376.5,
      fuelType2Cil: 235,
      fuelType2Lie: 234,
      operationType: 'Disponible a Despacho',
      status: 'PUBLISHED',
      statusCode: 2,
      comments: null,
      unitId: '01930e48-70fe-0e9a-1c18-bff758c72abe',
      unit: null,
      fixedAvailabilityId: '01932178-616a-f878-e804-1774eb55de18',
      fixedAvailability: {
        id: '01932178-616a-f878-e804-1774eb55de18',
        fuelType1FixedNetCapacity: 123,
        fuelType1Cil: 317.5,
        fuelType1Lie: 276.9,
        fuelType2FixedNetCapacity: 212,
        fuelType2Cil: 235,
        fuelType2Lie: 234,
        effectiveDate: '2023-03-11',
        unitId: '01930e48-70fe-0e9a-1c18-bff758c72abe',
        unit: null,
        hourlyAvailabilities: null,
        createdBy: 'CPP - PRO@test.com',
        modifiedBy: 'CPP - PRO@test.com',
        modifiedOn: '2024-11-12T17:42:37.674',
      },
      createdBy: 'CPP - PRO@test.com',
      modifiedBy: 'cpp - pro@test.com',
      modifiedOn: '2024-11-12T17:45:44.426',
    },
    {
      id: '0193217b-3ae9-d379-dfe5-afc556723dca',
      date: '2025-02-01',
      hour: 14,
      marketType: 'MDA',
      fuelType1NetCapacity: 457,
      fuelType1AvailabilityNetCapacity: 567,
      fuelType1Cil: 317.5,
      fuelType1Lie: 276.9,
      fuelType2NetCapacity: 519,
      fuelType2AvailabilityNetCapacity: 376.5,
      fuelType2Cil: 235,
      fuelType2Lie: 234,
      operationType: 'No disponible',
      status: 'PUBLISHED',
      statusCode: 2,
      comments: 'Paro de emergencia',
      unitId: '01930e48-70fe-0e9a-1c18-bff758c72abe',
      unit: null,
      fixedAvailabilityId: '01932178-616a-f878-e804-1774eb55de18',
      fixedAvailability: {
        id: '01932178-616a-f878-e804-1774eb55de18',
        fuelType1FixedNetCapacity: 123,
        fuelType1Cil: 317.5,
        fuelType1Lie: 276.9,
        fuelType2FixedNetCapacity: 212,
        fuelType2Cil: 235,
        fuelType2Lie: 234,
        effectiveDate: '2023-03-11',
        unitId: '01930e48-70fe-0e9a-1c18-bff758c72abe',
        unit: null,
        hourlyAvailabilities: null,
        createdBy: 'CPP - PRO@test.com',
        modifiedBy: 'CPP - PRO@test.com',
        modifiedOn: '2024-11-12T17:42:37.674',
      },
      createdBy: 'CPP - PRO@test.com',
      modifiedBy: 'cpp - pro@test.com',
      modifiedOn: '2024-11-12T17:45:44.426',
    },
    {
      id: '0193217b-3ae9-d379-dfe5-afc556723dcb',
      date: '2025-02-01',
      hour: 15,
      marketType: 'MDA',
      fuelType1NetCapacity: 457,
      fuelType1AvailabilityNetCapacity: 567,
      fuelType1Cil: 317.5,
      fuelType1Lie: 276.9,
      fuelType2NetCapacity: 519,
      fuelType2AvailabilityNetCapacity: 376.5,
      fuelType2Cil: 235,
      fuelType2Lie: 234,
      operationType: 'No disponible',
      status: 'PUBLISHED',
      statusCode: 2,
      comments: 'Paro de emergencia',
      unitId: '01930e48-70fe-0e9a-1c18-bff758c72abe',
      unit: null,
      fixedAvailabilityId: '01932178-616a-f878-e804-1774eb55de18',
      fixedAvailability: {
        id: '01932178-616a-f878-e804-1774eb55de18',
        fuelType1FixedNetCapacity: 123,
        fuelType1Cil: 317.5,
        fuelType1Lie: 276.9,
        fuelType2FixedNetCapacity: 212,
        fuelType2Cil: 235,
        fuelType2Lie: 234,
        effectiveDate: '2023-03-11',
        unitId: '01930e48-70fe-0e9a-1c18-bff758c72abe',
        unit: null,
        hourlyAvailabilities: null,
        createdBy: 'CPP - PRO@test.com',
        modifiedBy: 'CPP - PRO@test.com',
        modifiedOn: '2024-11-12T17:42:37.674',
      },
      createdBy: 'CPP - PRO@test.com',
      modifiedBy: 'cpp - pro@test.com',
      modifiedOn: '2024-11-12T17:45:44.426',
    },
    {
      id: '0193217b-3ae9-d379-dfe5-afc556723dcc',
      date: '2025-02-01',
      hour: 16,
      marketType: 'MDA',
      fuelType1NetCapacity: 457,
      fuelType1AvailabilityNetCapacity: 567,
      fuelType1Cil: 317.5,
      fuelType1Lie: 276.9,
      fuelType2NetCapacity: 519,
      fuelType2AvailabilityNetCapacity: 376.5,
      fuelType2Cil: 235,
      fuelType2Lie: 234,
      operationType: 'No disponible',
      status: 'PUBLISHED',
      statusCode: 2,
      comments: 'Paro de emergencia',
      unitId: '01930e48-70fe-0e9a-1c18-bff758c72abe',
      unit: null,
      fixedAvailabilityId: '01932178-616a-f878-e804-1774eb55de18',
      fixedAvailability: {
        id: '01932178-616a-f878-e804-1774eb55de18',
        fuelType1FixedNetCapacity: 123,
        fuelType1Cil: 317.5,
        fuelType1Lie: 276.9,
        fuelType2FixedNetCapacity: 212,
        fuelType2Cil: 235,
        fuelType2Lie: 234,
        effectiveDate: '2023-03-11',
        unitId: '01930e48-70fe-0e9a-1c18-bff758c72abe',
        unit: null,
        hourlyAvailabilities: null,
        createdBy: 'CPP - PRO@test.com',
        modifiedBy: 'CPP - PRO@test.com',
        modifiedOn: '2024-11-12T17:42:37.674',
      },
      createdBy: 'CPP - PRO@test.com',
      modifiedBy: 'cpp - pro@test.com',
      modifiedOn: '2024-11-12T17:45:44.426',
    },
    {
      id: '0193217b-3ae9-d379-dfe5-afc556723dcd',
      date: '2025-02-01',
      hour: 17,
      marketType: 'MDA',
      fuelType1NetCapacity: 457,
      fuelType1AvailabilityNetCapacity: 567,
      fuelType1Cil: 317.5,
      fuelType1Lie: 276.9,
      fuelType2NetCapacity: 519,
      fuelType2AvailabilityNetCapacity: 376.5,
      fuelType2Cil: 235,
      fuelType2Lie: 234,
      operationType: 'Disponible a Despacho',
      status: 'PUBLISHED',
      statusCode: 2,
      comments: 'Restricción de gas por parte del suministrador',
      unitId: '01930e48-70fe-0e9a-1c18-bff758c72abe',
      unit: null,
      fixedAvailabilityId: '01932178-616a-f878-e804-1774eb55de18',
      fixedAvailability: {
        id: '01932178-616a-f878-e804-1774eb55de18',
        fuelType1FixedNetCapacity: 123,
        fuelType1Cil: 317.5,
        fuelType1Lie: 276.9,
        fuelType2FixedNetCapacity: 212,
        fuelType2Cil: 235,
        fuelType2Lie: 234,
        effectiveDate: '2023-03-11',
        unitId: '01930e48-70fe-0e9a-1c18-bff758c72abe',
        unit: null,
        hourlyAvailabilities: null,
        createdBy: 'CPP - PRO@test.com',
        modifiedBy: 'CPP - PRO@test.com',
        modifiedOn: '2024-11-12T17:42:37.674',
      },
      createdBy: 'CPP - PRO@test.com',
      modifiedBy: 'cpp - pro@test.com',
      modifiedOn: '2024-11-12T17:45:44.426',
    },
    {
      id: '0193217b-3ae9-d379-dfe5-afc556723dce',
      date: '2025-02-01',
      hour: 18,
      marketType: 'MDA',
      fuelType1NetCapacity: 457,
      fuelType1AvailabilityNetCapacity: 567,
      fuelType1Cil: 317.5,
      fuelType1Lie: 276.9,
      fuelType2NetCapacity: 519,
      fuelType2AvailabilityNetCapacity: 376.5,
      fuelType2Cil: 235,
      fuelType2Lie: 234,
      operationType: 'Disponible a Despacho',
      status: 'PUBLISHED',
      statusCode: 2,
      comments: 'Restricción de gas por parte del suministrador',
      unitId: '01930e48-70fe-0e9a-1c18-bff758c72abe',
      unit: null,
      fixedAvailabilityId: '01932178-616a-f878-e804-1774eb55de18',
      fixedAvailability: {
        id: '01932178-616a-f878-e804-1774eb55de18',
        fuelType1FixedNetCapacity: 123,
        fuelType1Cil: 317.5,
        fuelType1Lie: 276.9,
        fuelType2FixedNetCapacity: 212,
        fuelType2Cil: 235,
        fuelType2Lie: 234,
        effectiveDate: '2023-03-11',
        unitId: '01930e48-70fe-0e9a-1c18-bff758c72abe',
        unit: null,
        hourlyAvailabilities: null,
        createdBy: 'CPP - PRO@test.com',
        modifiedBy: 'CPP - PRO@test.com',
        modifiedOn: '2024-11-12T17:42:37.674',
      },
      createdBy: 'CPP - PRO@test.com',
      modifiedBy: 'cpp - pro@test.com',
      modifiedOn: '2024-11-12T17:45:44.426',
    },
    {
      id: '0193217b-3ae9-d379-dfe5-afc556723dcf',
      date: '2025-02-01',
      hour: 19,
      marketType: 'MDA',
      fuelType1NetCapacity: 457,
      fuelType1AvailabilityNetCapacity: 567,
      fuelType1Cil: 317.5,
      fuelType1Lie: 276.9,
      fuelType2NetCapacity: 519,
      fuelType2AvailabilityNetCapacity: 376.5,
      fuelType2Cil: 235,
      fuelType2Lie: 234,
      operationType: 'Disponible a Despacho',
      status: 'PUBLISHED',
      statusCode: 2,
      comments: 'Restricción de gas por parte del suministrador',
      unitId: '01930e48-70fe-0e9a-1c18-bff758c72abe',
      unit: null,
      fixedAvailabilityId: '01932178-616a-f878-e804-1774eb55de18',
      fixedAvailability: {
        id: '01932178-616a-f878-e804-1774eb55de18',
        fuelType1FixedNetCapacity: 123,
        fuelType1Cil: 317.5,
        fuelType1Lie: 276.9,
        fuelType2FixedNetCapacity: 212,
        fuelType2Cil: 235,
        fuelType2Lie: 234,
        effectiveDate: '2023-03-11',
        unitId: '01930e48-70fe-0e9a-1c18-bff758c72abe',
        unit: null,
        hourlyAvailabilities: null,
        createdBy: 'CPP - PRO@test.com',
        modifiedBy: 'CPP - PRO@test.com',
        modifiedOn: '2024-11-12T17:42:37.674',
      },
      createdBy: 'CPP - PRO@test.com',
      modifiedBy: 'cpp - pro@test.com',
      modifiedOn: '2024-11-12T17:45:44.426',
    },
    {
      id: '0193217b-3ae9-d379-dfe5-afc556723dd0',
      date: '2025-02-01',
      hour: 20,
      marketType: 'MDA',
      fuelType1NetCapacity: 457,
      fuelType1AvailabilityNetCapacity: 567,
      fuelType1Cil: 317.5,
      fuelType1Lie: 276.9,
      fuelType2NetCapacity: 519,
      fuelType2AvailabilityNetCapacity: 376.5,
      fuelType2Cil: 235,
      fuelType2Lie: 234,
      operationType: 'Disponible a Despacho',
      status: 'PUBLISHED',
      statusCode: 2,
      comments: 'Licencia de mantenimiento',
      unitId: '01930e48-70fe-0e9a-1c18-bff758c72abe',
      unit: null,
      fixedAvailabilityId: '01932178-616a-f878-e804-1774eb55de18',
      fixedAvailability: {
        id: '01932178-616a-f878-e804-1774eb55de18',
        fuelType1FixedNetCapacity: 123,
        fuelType1Cil: 317.5,
        fuelType1Lie: 276.9,
        fuelType2FixedNetCapacity: 212,
        fuelType2Cil: 235,
        fuelType2Lie: 234,
        effectiveDate: '2023-03-11',
        unitId: '01930e48-70fe-0e9a-1c18-bff758c72abe',
        unit: null,
        hourlyAvailabilities: null,
        createdBy: 'CPP - PRO@test.com',
        modifiedBy: 'CPP - PRO@test.com',
        modifiedOn: '2024-11-12T17:42:37.674',
      },
      createdBy: 'CPP - PRO@test.com',
      modifiedBy: 'cpp - pro@test.com',
      modifiedOn: '2024-11-12T17:45:44.426',
    },
    {
      id: '0193217b-3ae9-d379-dfe5-afc556723dd1',
      date: '2025-02-01',
      hour: 21,
      marketType: 'MDA',
      fuelType1NetCapacity: 457,
      fuelType1AvailabilityNetCapacity: 567,
      fuelType1Cil: 317.5,
      fuelType1Lie: 276.9,
      fuelType2NetCapacity: 519,
      fuelType2AvailabilityNetCapacity: 376.5,
      fuelType2Cil: 235,
      fuelType2Lie: 234,
      operationType: 'Disponible a Despacho',
      status: 'PUBLISHED',
      statusCode: 2,
      comments: 'Licencia de mantenimiento',
      unitId: '01930e48-70fe-0e9a-1c18-bff758c72abe',
      unit: null,
      fixedAvailabilityId: '01932178-616a-f878-e804-1774eb55de18',
      fixedAvailability: {
        id: '01932178-616a-f878-e804-1774eb55de18',
        fuelType1FixedNetCapacity: 123,
        fuelType1Cil: 317.5,
        fuelType1Lie: 276.9,
        fuelType2FixedNetCapacity: 212,
        fuelType2Cil: 235,
        fuelType2Lie: 234,
        effectiveDate: '2023-03-11',
        unitId: '01930e48-70fe-0e9a-1c18-bff758c72abe',
        unit: null,
        hourlyAvailabilities: null,
        createdBy: 'CPP - PRO@test.com',
        modifiedBy: 'CPP - PRO@test.com',
        modifiedOn: '2024-11-12T17:42:37.674',
      },
      createdBy: 'CPP - PRO@test.com',
      modifiedBy: 'cpp - pro@test.com',
      modifiedOn: '2024-11-12T17:45:44.426',
    },
    {
      id: '0193217b-3ae9-d379-dfe5-afc556723dd2',
      date: '2025-02-01',
      hour: 22,
      marketType: 'MDA',
      fuelType1NetCapacity: 457,
      fuelType1AvailabilityNetCapacity: 567,
      fuelType1Cil: 317.5,
      fuelType1Lie: 276.9,
      fuelType2NetCapacity: 519,
      fuelType2AvailabilityNetCapacity: 376.5,
      fuelType2Cil: 235,
      fuelType2Lie: 234,
      operationType: 'Disponible a Despacho',
      status: 'PUBLISHED',
      statusCode: 2,
      comments: 'Licencia de mantenimiento',
      unitId: '01930e48-70fe-0e9a-1c18-bff758c72abe',
      unit: null,
      fixedAvailabilityId: '01932178-616a-f878-e804-1774eb55de18',
      fixedAvailability: {
        id: '01932178-616a-f878-e804-1774eb55de18',
        fuelType1FixedNetCapacity: 123,
        fuelType1Cil: 317.5,
        fuelType1Lie: 276.9,
        fuelType2FixedNetCapacity: 212,
        fuelType2Cil: 235,
        fuelType2Lie: 234,
        effectiveDate: '2023-03-11',
        unitId: '01930e48-70fe-0e9a-1c18-bff758c72abe',
        unit: null,
        hourlyAvailabilities: null,
        createdBy: 'CPP - PRO@test.com',
        modifiedBy: 'CPP - PRO@test.com',
        modifiedOn: '2024-11-12T17:42:37.674',
      },
      createdBy: 'CPP - PRO@test.com',
      modifiedBy: 'cpp - pro@test.com',
      modifiedOn: '2024-11-12T17:45:44.426',
    },
    {
      id: '0193217b-3ae9-d379-dfe5-afc556723dd3',
      date: '2025-02-01',
      hour: 23,
      marketType: 'MDA',
      fuelType1NetCapacity: 45,
      fuelType1AvailabilityNetCapacity: 56,
      fuelType1Cil: 317.5,
      fuelType1Lie: 276.9,
      fuelType2NetCapacity: 519,
      fuelType2AvailabilityNetCapacity: 376.5,
      fuelType2Cil: 235,
      fuelType2Lie: 234,
      operationType: 'Disponible a Despacho',
      status: 'PUBLISHED',
      statusCode: 2,
      comments: 'Licencia de mantenimiento',
      unitId: '01930e48-70fe-0e9a-1c18-bff758c72abe',
      unit: null,
      fixedAvailabilityId: '01932178-616a-f878-e804-1774eb55de18',
      fixedAvailability: {
        id: '01932178-616a-f878-e804-1774eb55de18',
        fuelType1FixedNetCapacity: 123,
        fuelType1Cil: 317.5,
        fuelType1Lie: 276.9,
        fuelType2FixedNetCapacity: 212,
        fuelType2Cil: 235,
        fuelType2Lie: 234,
        effectiveDate: '2023-03-11',
        unitId: '01930e48-70fe-0e9a-1c18-bff758c72abe',
        unit: null,
        hourlyAvailabilities: null,
        createdBy: 'CPP - PRO@test.com',
        modifiedBy: 'CPP - PRO@test.com',
        modifiedOn: '2024-11-12T17:42:37.674',
      },
      createdBy: 'CPP - PRO@test.com',
      modifiedBy: 'cpp - pro@test.com',
      modifiedOn: '2024-11-12T17:45:44.426',
    },
    {
      id: '0193217b-3ae9-d379-dfe5-afc556723dd4',
      date: '2025-02-01',
      hour: 24,
      marketType: 'MDA',
      fuelType1NetCapacity: 45,
      fuelType1AvailabilityNetCapacity: 57,
      fuelType1Cil: 317.5,
      fuelType1Lie: 276.9,
      fuelType2NetCapacity: 519,
      fuelType2AvailabilityNetCapacity: 376.5,
      fuelType2Cil: 235,
      fuelType2Lie: 234,
      operationType: 'Disponible a Despacho',
      status: 'PUBLISHED',
      statusCode: 2,
      comments: 'Licencia de mantenimiento',
      unitId: '01930e48-70fe-0e9a-1c18-bff758c72abe',
      unit: null,
      fixedAvailabilityId: '01932178-616a-f878-e804-1774eb55de18',
      fixedAvailability: {
        id: '01932178-616a-f878-e804-1774eb55de18',
        fuelType1FixedNetCapacity: 123,
        fuelType1Cil: 317.5,
        fuelType1Lie: 276.9,
        fuelType2FixedNetCapacity: 212,
        fuelType2Cil: 235,
        fuelType2Lie: 234,
        effectiveDate: '2023-03-11',
        unitId: '01930e48-70fe-0e9a-1c18-bff758c72abe',
        unit: null,
        hourlyAvailabilities: null,
        createdBy: 'CPP - PRO@test.com',
        modifiedBy: 'CPP - PRO@test.com',
        modifiedOn: '2024-11-12T17:42:37.674',
      },
      createdBy: 'CPP - PRO@test.com',
      modifiedBy: 'cpp - pro@test.com',
      modifiedOn: '2024-11-12T17:45:44.426',
    },
    {
      id: '0193217b-3ae9-d379-dfe5-afc556723dd5',
      date: '2025-02-01',
      hour: 25,
      marketType: 'MDA',
      fuelType1NetCapacity: 45,
      fuelType1AvailabilityNetCapacity: 57,
      fuelType1Cil: 317.5,
      fuelType1Lie: 276.9,
      fuelType2NetCapacity: 519,
      fuelType2AvailabilityNetCapacity: 376.5,
      fuelType2Cil: 235,
      fuelType2Lie: 234,
      operationType: 'Disponible a Despacho',
      status: 'PUBLISHED',
      statusCode: 2,
      comments: null,
      unitId: '01930e48-70fe-0e9a-1c18-bff758c72abe',
      unit: null,
      fixedAvailabilityId: '01932178-616a-f878-e804-1774eb55de18',
      fixedAvailability: {
        id: '01932178-616a-f878-e804-1774eb55de18',
        fuelType1FixedNetCapacity: 123,
        fuelType1Cil: 317.5,
        fuelType1Lie: 276.9,
        fuelType2FixedNetCapacity: 212,
        fuelType2Cil: 235,
        fuelType2Lie: 234,
        effectiveDate: '2023-03-11',
        unitId: '01930e48-70fe-0e9a-1c18-bff758c72abe',
        unit: null,
        hourlyAvailabilities: null,
        createdBy: 'CPP - PRO@test.com',
        modifiedBy: 'CPP - PRO@test.com',
        modifiedOn: '2024-11-12T17:42:37.674',
      },
      createdBy: 'CPP - PRO@test.com',
      modifiedBy: 'cpp - pro@test.com',
      modifiedOn: '2024-11-12T17:45:44.426',
    },
  ],
  dayDurations: {
    '2025-02-01': 24,
    '2024-11-03': 25,
  },
};

describe('AvailabilitiesTableBody', () => {
  vi.mock('@/contexts/AppContext', () => ({
    AppProvider: ({ children }: { children: React.ReactNode }) => children,
    useUnit: vi.fn().mockReturnValue({
      value: undefined,
      setId: vi.fn(),
    }),
    useDate: vi.fn().mockReturnValue({
      value: null,
      setValue: vi.fn(),
      dateDiff: 0,
    }),
    useMarket: vi.fn().mockReturnValue({
      value: null,
      setValue: vi.fn(),
    }),
    useShowFT1Columns: vi.fn().mockReturnValue({
      value: false,
      setValue: vi.fn(),
    }),
    useShowFT2Columns: vi.fn().mockReturnValue({
      value: false,
      setValue: vi.fn(),
    }),
    useUpsertInsumosState: vi.fn().mockReturnValue({
      errors: {},
      setErrors: vi.fn(),
      isFlashingSuccess: false,
      setIsFlashingSuccess: vi.fn(),
      isFlashingErrors: false,
      setIsFlashingErrors: vi.fn(),
      data: undefined,
      setData: vi.fn(),
    }),
  }));

  vi.mock('react-i18next', () => ({
    useTranslation: () => ({
      t: (key: string) => key,
    }),
  }));

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  const renderComponent = ({ mockProps }: { mockProps: any }) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <AvailabilitiesTableBody {...mockProps} />
      </QueryClientProvider>,
    );
  };

  it('renders without crashing', () => {
    const mockProps = {
      rowsLength: 24,
      isAvailabilitiesLoading: false,
      hasRequiredFields: true,
      availabilities: undefined,
    };

    renderComponent({ mockProps });

    expect(document.querySelector('tbody')).not.toBeNull();
  });

  it('displays the correct number of rows', () => {
    const mockProps = {
      rowsLength: 24,
      isAvailabilitiesLoading: false,
      hasRequiredFields: true,
      availabilities: undefined,
    };

    renderComponent({ mockProps });

    const rows = screen.getAllByRole('row');
    expect(rows.length).toBe(mockProps.rowsLength + 1);
  });

  it('handles checkbox interaction', async () => {
    const mockProps = {
      rowsLength: 24,
      isAvailabilitiesLoading: false,
      hasRequiredFields: true,
      availabilities: MOCK_AVAILABILITIES,
    };

    renderComponent({ mockProps });

    const checkbox = screen.getAllByRole('checkbox')[0];

    expect(checkbox).toHaveAttribute('data-state', 'unchecked');

    if (!checkbox.hasAttribute('data-disabled')) {
      fireEvent.click(checkbox);

      await waitFor(() => {
        expect(checkbox).toHaveAttribute('data-state', 'checked');
      });
    } else {
      console.warn('Checkbox is disabled, skipping interaction test.');
    }
  });

  it('renders loading state when isAvailabilitiesLoading is true', () => {
    const mockProps = {
      rowsLength: 24,
      isAvailabilitiesLoading: true,
      hasRequiredFields: true,
      availabilities: undefined,
    };

    renderComponent({ mockProps });

    const tbody = screen.getByRole('rowgroup');
    expect(tbody).toHaveClass('isContentLoading');
  });
});
