import React from 'react';

import {
  useShowFT1Columns,
  useShowFT2Columns,
  useUnit,
} from '@/contexts/AppContext';
import { useTranslation } from 'react-i18next';

import { Table, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AvailabilitiesTableBody from '@/components/AvailabilitiesTableBody';

interface AvailabilitiesTableProps {}

const AvailabilitiesTable: React.FC<AvailabilitiesTableProps> = ({}) => {
  const { t } = useTranslation();

  const { value: unit } = useUnit();
  const { value: showFT1Columns } = useShowFT1Columns();
  const { value: showFT2Columns } = useShowFT2Columns();

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
      <AvailabilitiesTableBody rowsLength={24} />
    </Table>
  );
};

export default AvailabilitiesTable;
