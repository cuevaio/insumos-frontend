import { FC, useMemo } from 'react';

import { CalendarDate } from '@internationalized/date';
import { type Key } from 'react-aria-components';
import { useTranslation } from 'react-i18next';

import { Table, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AvailabilitiesTableBody from '@/components/AvailabilitiesTableBody';

import { AvailabilitiesQueryResponse } from '@/hooks/useAvailabilities';
import { ExtendedInsumo } from '@/hooks/useInsumos';
import { UnitWithFuelType, useUnits } from '@/hooks/useUnits';

import { ExtendedInsumoInsert, InsumoInsertErrors } from '@/lib/types';

interface AvailabilitiesTableProps {
  unitId: Key | undefined;
  date: CalendarDate | null;
  availabilities: AvailabilitiesQueryResponse | undefined;
  insumos: ExtendedInsumo | undefined;
  showFT1Columns: boolean;
  showFT2Columns: boolean;
  dateDiff: number;
  errors: InsumoInsertErrors;
  isFlashingSuccess: boolean;
  isFlashingErrors: boolean;
  data: ExtendedInsumoInsert | undefined;
}

const AvailabilitiesTable: FC<AvailabilitiesTableProps> = ({
  unitId,
  date,
  availabilities,
  insumos,
  showFT1Columns,
  showFT2Columns,
  dateDiff,
  errors,
  isFlashingSuccess,
  isFlashingErrors,
  data,
}) => {
  const { t } = useTranslation();

  const { data: units } = useUnits();

  const unit = useMemo(
    () => units?.find((u) => u.id === unitId),
    [unitId, units],
  );

  return (
    <Table>
      <TableHeader className="bg-muted">
        {(showFT1Columns || (showFT2Columns && unit?.fuelType2)) && (
          <TableRow className="text-xxs">
            <TableHead colSpan={2} className="border-l border-t"></TableHead>
            {showFT1Columns && (
              <TableHead colSpan={5} className="border-x border-t text-center">
                {t('Declared Net Capacity of the plant or package')} -{' '}
                {unit?.fuelType1?.name.toUpperCase()}
              </TableHead>
            )}
            {showFT2Columns && unit?.fuelType2 && (
              <TableHead colSpan={5} className="border-x border-t text-center">
                {t('Declared Net Capacity of the plant or package')} -{' '}
                {unit?.fuelType2?.name.toUpperCase()}
              </TableHead>
            )}
            <TableHead colSpan={13} className="border-r border-t"></TableHead>
          </TableRow>
        )}
        <TableRow className="border-t text-xxs leading-[0.75rem]">
          <TableHead className="border-l">{t('Hour')}</TableHead>
          <TableHead className="min-w-[100px]">{t('Schedule')}</TableHead>
          {showFT1Columns && (
            <>
              <TableHead className="min-w-[120px] border-l text-xxs">
                <span
                  className="line-clamp-3 overflow-hidden break-words"
                  title={t(
                    'Corrected to Summer Design Conditions (Contractual) MW',
                  )}
                >
                  {t('Corrected to Summer Design Conditions (Contractual) MW')}
                </span>
              </TableHead>
              <TableHead className="min-w-[120px] border-l text-xxs">
                <span
                  className="line-clamp-3 overflow-hidden break-words"
                  title={t('Real Environment Conditions MW')}
                >
                  {t('Real Environment Conditions MW')}
                </span>
              </TableHead>
              <TableHead className="min-w-[120px] border-l text-xxs">
                <span
                  className="line-clamp-3 overflow-hidden break-words"
                  title={t(
                    'Real Environment Conditions Considering Available Amount MW',
                  )}
                >
                  {t(
                    'Real Environment Conditions Considering Available Amount MW',
                  )}
                </span>
              </TableHead>
              <TableHead className="min-w-[120px] border-l text-xxs">
                <span
                  className="line-clamp-3 overflow-hidden break-words"
                  title={t('From Legacy Interconnection Contract (CIL) MW')}
                >
                  {t('From Legacy Interconnection Contract (CIL) MW')}
                </span>
              </TableHead>
              <TableHead className="min-w-[120px] border-l text-xxs">
                <span
                  className="line-clamp-3 overflow-hidden break-words"
                  title={t('Under LIE Type Contract MW')}
                >
                  {t('Under LIE Type Contract MW')}
                </span>
              </TableHead>
            </>
          )}
          {showFT2Columns && unit?.fuelType2 && (
            <>
              <TableHead className="min-w-[120px] border-l text-xxs">
                <span
                  className="line-clamp-3 overflow-hidden break-words"
                  title={t(
                    'Corrected to Summer Design Conditions (Contractual) MW',
                  )}
                >
                  {t('Corrected to Summer Design Conditions (Contractual) MW')}
                </span>
              </TableHead>
              <TableHead className="min-w-[120px] border-l text-xxs">
                <span
                  className="line-clamp-3 overflow-hidden break-words"
                  title={t('Real Environment Conditions MW')}
                >
                  {t('Real Environment Conditions MW')}
                </span>
              </TableHead>
              <TableHead className="min-w-[120px] border-l text-xxs">
                <span
                  className="line-clamp-3 overflow-hidden break-words"
                  title={t('Considering Available Diesel MW')}
                >
                  {t('Considering Available Diesel MW')}
                </span>
              </TableHead>
              <TableHead className="min-w-[120px] border-l text-xxs">
                <span
                  className="line-clamp-3 overflow-hidden break-words"
                  title={t('From Legacy Interconnection Contract (CIL) MW')}
                >
                  {t('From Legacy Interconnection Contract (CIL) MW')}
                </span>
              </TableHead>
              <TableHead className="min-w-[120px] border-l text-xxs">
                <span
                  className="line-clamp-3 overflow-hidden break-words"
                  title={t('Under LIE Type Contract MW')}
                >
                  {t('Under LIE Type Contract MW')}
                </span>
              </TableHead>
            </>
          )}
          <TableHead className="border-l">
            <span
              className="line-clamp-3 overflow-hidden break-words"
              title={t('Pre-Selection')}
            >
              {t('Pre-Selection')}
            </span>
          </TableHead>
          <TableHead>
            <span
              className="line-clamp-3 overflow-hidden break-words"
              title={t('Maximum Offer Availability')}
            >
              {t('Maximum Offer Availability')}
            </span>
          </TableHead>
          <TableHead>
            <span
              className="line-clamp-3 overflow-hidden break-words"
              title={t('Minimum Offer Availability')}
            >
              {t('Minimum Offer Availability')}
            </span>
          </TableHead>
          <TableHead className="min-w-[70px]">
            <span
              className="line-clamp-3 overflow-hidden break-words"
              title={`% ${unit?.fuelType1?.name}`}
            >
              % {unit?.fuelType1?.name}
            </span>
          </TableHead>
          {unit?.fuelType2 && (
            <TableHead className="min-w-[70px]">
              <span
                className="line-clamp-3 overflow-hidden break-words"
                title={`% ${unit.fuelType2.name}`}
              >
                % {unit.fuelType2.name}
              </span>
            </TableHead>
          )}
          <TableHead className="min-w-[120px] text-xxs">
            <span
              className="line-clamp-3 overflow-hidden break-words"
              title={t('Note')}
            >
              {t('Note')}
            </span>
          </TableHead>
          <TableHead>
            <span
              className="line-clamp-3 overflow-hidden break-words"
              title="AGC"
            >
              AGC
            </span>
          </TableHead>
          <TableHead className="min-w-[100px]">
            <span
              className="line-clamp-3 overflow-hidden break-words"
              title={`${t('Price of')} ${unit?.fuelType1?.name}`}
            >
              {t('Price of')} {unit?.fuelType1?.name}
            </span>
          </TableHead>
          {unit?.fuelType2 && (
            <TableHead className="min-w-[100px]">
              <span
                className="line-clamp-3 overflow-hidden break-words"
                title={`${t('Price of')} ${unit.fuelType2.name}`}
              >
                {t('Price of')} {unit.fuelType2.name}
              </span>
            </TableHead>
          )}
          <TableHead className="min-w-[150px]">
            <span
              className="line-clamp-3 overflow-hidden break-words"
              title={`${t('Operation Type')} (Disponible a Despacho / Operación Obligada)`}
            >
              {t('Operation Type')} (Disponible a Despacho / Operación Obligada)
            </span>
          </TableHead>
          <TableHead className="min-w-[350px]">
            <span
              className="line-clamp-3 overflow-hidden break-words"
              title={t(
                'Comments (Specifications, Number of Licenses, AGC Conditions, Etc.)',
              )}
            >
              {t(
                'Comments (Specifications, Number of Licenses, AGC Conditions, Etc.)',
              )}
            </span>
          </TableHead>
          <TableHead>
            <span
              className="line-clamp-3 overflow-hidden break-words"
              title={t('Last Update Date')}
            >
              {t('Last Update Date')}
            </span>
          </TableHead>
          <TableHead className="border-r">
            <span
              className="line-clamp-3 overflow-hidden break-words"
              title={t('User')}
            >
              {t('User')}
            </span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <AvailabilitiesTableBody
        availabilities={availabilities}
        insumos={insumos}
        date={date}
        rowsLength={24}
        unit={unit as UnitWithFuelType}
        showFT1Columns={showFT1Columns}
        showFT2Columns={showFT2Columns}
        dateDiff={dateDiff}
        errors={errors}
        isFlashingSuccess={isFlashingSuccess}
        isFlashingErrors={isFlashingErrors}
        data={data}
        isSkeleton={!(date && availabilities && insumos)}
      />
    </Table>
  );
};

export default AvailabilitiesTable;
