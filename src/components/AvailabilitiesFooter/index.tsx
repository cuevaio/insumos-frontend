import React from 'react';

import { useDate, useMarket, useUnit } from '@/contexts/AppContext';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import ExportAvailabilitiesButton from '@/components/ExportAvailabilitiesButton';

import { useInsumos } from '@/hooks/useInsumos';

import { cn } from '@/lib/utils';

interface AvailabilitiesFooterProps {
  formRef: React.MutableRefObject<HTMLFormElement | null>;
}

const AvailabilitiesFooter: React.FC<AvailabilitiesFooterProps> = ({
  formRef,
}) => {
  const { t } = useTranslation();

  const { value: unit } = useUnit();
  const { dateDiff } = useDate();
  const { value: date } = useDate();
  const { value: market } = useMarket();

  const { data } = useInsumos({
    date: date?.toString(),
    market: market,
    unit: unit,
  });

  return (
    <>
      <p className="my-1 text-center text-xs text-muted-foreground">
        {t(
          'Note: The information in the pre-selection column is only a suggestion of a possible scenario based on information sent by the external client.',
        )}
      </p>
      <div className="mt-4 flex justify-between">
        <div className="flex gap-4 text-center">
          <div className="rounded-lg border bg-blue-300 p-2">
            <p className="text-xs font-bold">
              {t('Average prices for the last 30 days')}
            </p>
            <p className="text-xs">
              Nodo {unit?.name}: {unit && `$${data?.averageLast30Days}`}
            </p>
            <p className="text-xs">{t('Days without PML')}: 10/02/2024</p>
          </div>
          <div className="rounded-lg border bg-rose-200 p-2">
            <p className="text-xs font-bold">{t('Transmission Rate')}</p>
            <p className="text-xs">{unit && `$${data?.transmissionFee}`}</p>
          </div>
          <div className="rounded-lg border bg-green-200 p-2">
            <p className="text-xs font-bold">{t('Operation Rate')}</p>
            <p className="text-xs">{unit && `$${data?.operationFee}`}</p>
          </div>
        </div>
        <div className="flex gap-4">
          <ExportAvailabilitiesButton />
          <Button
            type="button"
            disabled={dateDiff < 0}
            onClick={() => {
              formRef?.current?.requestSubmit();
            }}
            className={cn(
              dateDiff < 0 && 'cursor-not-allowed opacity-50',
              'text-xs',
              'h-6',
            )}
          >
            {t('Save changes')}
          </Button>
        </div>
      </div>
    </>
  );
};

export default AvailabilitiesFooter;
