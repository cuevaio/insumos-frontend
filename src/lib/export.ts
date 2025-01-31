import ExcelJS from 'exceljs';

import { FuelType } from '@/hooks/useFuelTypes';
import { Insumo } from '@/hooks/useInsumos';
import { Unit } from '@/hooks/useUnits';

const getOperationTypeDisplayValue = (operationType: string): string => {
  const operationTypeMap: Record<string, string> = {
    'Operación No Disponible': 'No Disponible',
    'Operación Obligada': 'Op. Obligada',
    default: 'Disp. a despacho',
  };

  return operationTypeMap[operationType] || operationTypeMap.default;
};

const populateFuelTypeFields = (
  worksheet: ExcelJS.Worksheet,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  availability: any,
  index: number,
  fuelTypeNumber: 1 | 2,
  startColumn: string,
) => {
  const columnMap = {
    fixedNetCapacity: startColumn,
    netCapacity: String.fromCharCode(startColumn.charCodeAt(0) + 1),
    availabilityNetCapacity: String.fromCharCode(startColumn.charCodeAt(0) + 2),
    cil: String.fromCharCode(startColumn.charCodeAt(0) + 3),
    lie: String.fromCharCode(startColumn.charCodeAt(0) + 4),
  };

  const fuelTypePrefix = `fuelType${fuelTypeNumber}`;
  const row = index + 6;

  if (
    availability.fixedAvailability[`${fuelTypePrefix}FixedNetCapacity`] !==
    Infinity
  ) {
    worksheet.getCell(`${columnMap.fixedNetCapacity}${row}`).value =
      availability.fixedAvailability[`${fuelTypePrefix}FixedNetCapacity`];
  }

  if (availability[`${fuelTypePrefix}NetCapacity`] !== Infinity) {
    worksheet.getCell(`${columnMap.netCapacity}${row}`).value =
      availability[`${fuelTypePrefix}NetCapacity`];
  }

  if (availability[`${fuelTypePrefix}AvailabilityNetCapacity`] !== Infinity) {
    worksheet.getCell(`${columnMap.availabilityNetCapacity}${row}`).value =
      availability[`${fuelTypePrefix}AvailabilityNetCapacity`];
  }

  if (availability.fixedAvailability[`${fuelTypePrefix}Cil`] !== Infinity) {
    worksheet.getCell(`${columnMap.cil}${row}`).value =
      availability.fixedAvailability[`${fuelTypePrefix}Cil`];
  }

  if (availability.fixedAvailability[`${fuelTypePrefix}Lie`] !== Infinity) {
    worksheet.getCell(`${columnMap.lie}${row}`).value =
      availability.fixedAvailability[`${fuelTypePrefix}Lie`];
  }
};

export const populateAvailabilityData = (
  worksheet: ExcelJS.Worksheet,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  availability: any,
  index: number,
  insumo: Insumo | undefined,
  fuelType2: FuelType | undefined,
) => {
  populateFuelTypeFields(worksheet, availability, index, 1, 'D');

  if (fuelType2) {
    populateFuelTypeFields(worksheet, availability, index, 2, 'I');
  }

  const row = index + 6;
  worksheet.getCell(`N${row}`).value = getOperationTypeDisplayValue(
    availability.operationType,
  );

  if (insumo) {
    worksheet.getCell(`O${row}`).value = insumo.max;
    worksheet.getCell(`P${row}`).value = insumo.min;
    worksheet.getCell(`Q${row}`).value = insumo.share_ft1;
    worksheet.getCell(`R${row}`).value = insumo.share_ft2;
    worksheet.getCell(`S${row}`).value = insumo.note;
    worksheet.getCell(`T${row}`).value = insumo.agc ? 'Si' : 'No';
    worksheet.getCell(`U${row}`).value = insumo.price_ft1;
    worksheet.getCell(`V${row}`).value = insumo.price_ft2;
  }

  worksheet.getCell(`W${row}`).value = availability.comments;
};

export const setupWorksheet = (
  worksheet: ExcelJS.Worksheet,
  date: string,
  unit: Unit,
  fuelType1: FuelType,
  fuelType2: FuelType | undefined,
): ExcelJS.Worksheet => {
  const [year, month, day] = date.split('-');

  worksheet.name = date;

  worksheet.getCell('B2').value =
    `Clave de la Central o Paquete: "${unit.name}"`;
  worksheet.getCell('I3').value = `${day}/${month}/${year}`;
  worksheet.getCell('D4').value =
    `Capacidad Declarada de la Central o Paquete con ${fuelType1.name}`;
  worksheet.getCell('F5').value =
    'Capacidad Neta Expresada a Condiciones Ambientales Reales Considerando Cantidad de ' +
    `${fuelType1.name} Disponible MW`;

  if (fuelType2) {
    worksheet.getCell('I4').value =
      `Capacidad Declarada de la Central o Paquete con ${fuelType2.name}`;
    worksheet.getCell('K5').value =
      'Capacidad Neta Expresada a Condiciones Ambientales Reales Considerando Cantidad de ' +
      `${fuelType2.name} Disponible MW`;
  }

  return worksheet;
};
