import React from 'react';

import {
  useDate,
  useMarket,
  useShowFT1Columns,
  useShowFT2Columns,
  useUnit,
} from '@/contexts/AppContext';
import { useTranslation } from 'react-i18next';

import { Table, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AvailabilitiesTableBody from '@/components/AvailabilitiesTableBody';

import { useAvailabilities } from '@/hooks/useAvailabilities';
import { useInsumos } from '@/hooks/useInsumos';

import { cn } from '@/lib/utils';

interface AvailabilitiesTableProps {}

const AvailabilitiesTable: React.FC<AvailabilitiesTableProps> = ({}) => {
  const { t } = useTranslation();

  const { value: unit } = useUnit();
  const { value: showFT1Columns } = useShowFT1Columns();
  const { value: showFT2Columns } = useShowFT2Columns();
  const { value: date } = useDate();
  const { value: market } = useMarket();

  const { data: availabilities } = useAvailabilities({
    unitId: unit?.id?.toString(),
    unitName: unit?.name?.toString(),
    date: date?.toString(),
    market,
  });

  const { data } = useInsumos({
    date: date?.toString(),
    unit: unit,
    market,
  });

  const hasRequiredFields = React.useMemo(() => {
    return !!(date && unit && market);
  }, [date, unit, market]);

  const isAvailabilitiesLoading = React.useMemo(() => {
    return hasRequiredFields && !availabilities;
  }, [hasRequiredFields, availabilities]);

  const isInsumosLoading = React.useMemo(() => {
    return hasRequiredFields && !data;
  }, [hasRequiredFields, data]);

  return (
    <Table className={cn([isAvailabilitiesLoading && 'animate-pulse'])}>
      <TableHeader className="bg-muted">
        {(showFT1Columns || (showFT2Columns && unit?.fuelTypeList[1])) && (
          <TableRow className="text-xxs">
            <TableHead colSpan={2} className={cn(['border-l border-t'])} />
            {showFT1Columns && (
              <TableHead
                colSpan={5}
                className={cn(['border-x border-t text-center'])}
              >
                {t('Declared Net Capacity of the plant or package')} -{' '}
                {unit?.fuelTypeList[0].name.toUpperCase()}
              </TableHead>
            )}
            {showFT2Columns && unit?.fuelTypeList[1] && (
              <TableHead
                colSpan={5}
                className={cn(['border-x border-t text-center'])}
              >
                {t('Declared Net Capacity of the plant or package')} -{' '}
                {unit?.fuelTypeList[1].name.toUpperCase()}
              </TableHead>
            )}
            <TableHead colSpan={13} className={cn(['border-r border-t'])} />
          </TableRow>
        )}
        <TableRow className="border-t text-xxs leading-[0.75rem]">
          <TableHead className={cn(['border-l'])}>{t('Hour')}</TableHead>
          <TableHead className={cn(['min-w-[100px]'])}>
            {t('Schedule')}
          </TableHead>
          {showFT1Columns && (
            <>
              <TableHead className={cn(['min-w-[120px] border-l text-xxs'])}>
                <span
                  className="line-clamp-3 overflow-hidden break-words"
                  title={t(
                    'Corrected to Summer Design Conditions (Contractual) MW',
                  )}
                >
                  {t('Corrected to Summer Design Conditions (Contractual) MW')}
                </span>
              </TableHead>
              <TableHead className={cn(['min-w-[120px] border-l text-xxs'])}>
                <span
                  className="line-clamp-3 overflow-hidden break-words"
                  title={t('Real Environment Conditions MW')}
                >
                  {t('Real Environment Conditions MW')}
                </span>
              </TableHead>
              <TableHead className={cn(['min-w-[120px] border-l text-xxs'])}>
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
              <TableHead className={cn(['min-w-[120px] border-l text-xxs'])}>
                <span
                  className="line-clamp-3 overflow-hidden break-words"
                  title={t('From Legacy Interconnection Contract (CIL) MW')}
                >
                  {t('From Legacy Interconnection Contract (CIL) MW')}
                </span>
              </TableHead>
              <TableHead className={cn(['min-w-[120px] border-l text-xxs'])}>
                <span
                  className="line-clamp-3 overflow-hidden break-words"
                  title={t('Under LIE Type Contract MW')}
                >
                  {t('Under LIE Type Contract MW')}
                </span>
              </TableHead>
            </>
          )}
          {showFT2Columns && unit?.fuelTypeList[1] && (
            <>
              <TableHead className={cn(['min-w-[120px] border-l text-xxs'])}>
                <span
                  className="line-clamp-3 overflow-hidden break-words"
                  title={t(
                    'Corrected to Summer Design Conditions (Contractual) MW',
                  )}
                >
                  {t('Corrected to Summer Design Conditions (Contractual) MW')}
                </span>
              </TableHead>
              <TableHead className={cn(['min-w-[120px] border-l text-xxs'])}>
                <span
                  className="line-clamp-3 overflow-hidden break-words"
                  title={t('Real Environment Conditions MW')}
                >
                  {t('Real Environment Conditions MW')}
                </span>
              </TableHead>
              <TableHead className={cn(['min-w-[120px] border-l text-xxs'])}>
                <span
                  className="line-clamp-3 overflow-hidden break-words"
                  title={t('Considering Available Diesel MW')}
                >
                  {t('Considering Available Diesel MW')}
                </span>
              </TableHead>
              <TableHead className={cn(['min-w-[120px] border-l text-xxs'])}>
                <span
                  className="line-clamp-3 overflow-hidden break-words"
                  title={t('From Legacy Interconnection Contract (CIL) MW')}
                >
                  {t('From Legacy Interconnection Contract (CIL) MW')}
                </span>
              </TableHead>
              <TableHead className={cn(['min-w-[120px] border-l text-xxs'])}>
                <span
                  className="line-clamp-3 overflow-hidden break-words"
                  title={t('Under LIE Type Contract MW')}
                >
                  {t('Under LIE Type Contract MW')}
                </span>
              </TableHead>
            </>
          )}
          <TableHead className={cn(['border-l'])}>
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
          <TableHead className={cn(['min-w-[70px]'])}>
            <span
              className="line-clamp-3 overflow-hidden break-words"
              title={`% ${unit?.fuelTypeList[0].name}`}
            >
              % {unit?.fuelTypeList[0].name}
            </span>
          </TableHead>
          {unit?.fuelTypeList[1] && (
            <TableHead className={cn(['min-w-[70px]'])}>
              <span
                className="line-clamp-3 overflow-hidden break-words"
                title={`% ${unit?.fuelTypeList[1].name}`}
              >
                % {unit?.fuelTypeList[1].name}
              </span>
            </TableHead>
          )}
          <TableHead className={cn(['min-w-[120px]'])}>
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
          <TableHead className={cn(['min-w-[100px]'])}>
            <span
              className="line-clamp-3 overflow-hidden break-words"
              title={`${t('Price of')} ${unit?.fuelTypeList[0].name}`}
            >
              {t('Price of')} {unit?.fuelTypeList[0].name}
            </span>
          </TableHead>
          {unit?.fuelTypeList[1] && (
            <TableHead className={cn(['min-w-[100px]'])}>
              <span
                className="line-clamp-3 overflow-hidden break-words"
                title={`${t('Price of')} ${unit?.fuelTypeList[1].name}`}
              >
                {t('Price of')} {unit?.fuelTypeList[1].name}
              </span>
            </TableHead>
          )}
          <TableHead className={cn(['min-w-[150px]'])}>
            <span
              className="line-clamp-3 overflow-hidden break-words"
              title={`${t('Operation Type')} (Disponible a Despacho / Operación Obligada)`}
            >
              {t('Operation Type')} (Disponible a Despacho / Operación Obligada)
            </span>
          </TableHead>
          <TableHead className={cn(['min-w-[350px]'])}>
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
          <TableHead className={cn(['border-r'])}>
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
        rowsLength={
          (availabilities?.availabilities?.length || data?.insumos?.length) ??
          24
        }
        isContentLoading={isAvailabilitiesLoading || isInsumosLoading}
        hasRequiredFields={hasRequiredFields}
        availabilities={availabilities}
        insumos={data}
      />
    </Table>
  );
};

export default AvailabilitiesTable;
