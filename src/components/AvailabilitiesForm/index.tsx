import { FC, MutableRefObject, ReactNode, useRef, useState } from 'react';

import { CalendarDate, parseDate } from '@internationalized/date';
import { type Key } from 'react-aria-components';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { UnitWithFuelType } from '@/hooks/useUnits';
import { useUpsertInsumos } from '@/hooks/useUpsertInsumos';

import { InsumoSchema } from '@/lib/schemas';
import type { InsumoInsert, Market } from '@/lib/types';

interface AvailabilitiesFormProps {
  unitId: Key | undefined;
  market: Market | null;
  date: CalendarDate | null;
  unit: UnitWithFuelType | undefined;
  dateDiff: number;
  setErrors: any;
  formRef: MutableRefObject<HTMLFormElement | null>;
  children: ReactNode;
}

const AvailabilitiesForm: FC<AvailabilitiesFormProps> = ({
  unitId,
  market,
  date,
  unit,
  dateDiff,
  formRef,
  setErrors,
  children,
}) => {
  const { t } = useTranslation();

  const { mutate, data, isSuccess, isPending } = useUpsertInsumos({
    unitId: unitId?.toString(),
    date: date?.toString(),
    market,
  });

  return (
    <form
      className="w-full"
      ref={formRef}
      onSubmit={(event) => {
        event.preventDefault();

        if (dateDiff < 0) {
          toast.error(t('Cannot edit dates in the past'));
          return;
        }

        const formData = Array.from(
          new FormData(event.target as HTMLFormElement),
        );

        const insumos: { [key: string]: { [key: string]: string } } = {};

        formData.forEach(([key, value]) => {
          const [hour, property] = key.split('-');

          if (insumos[hour]) {
            insumos[hour][property] = value.toString();
          } else {
            insumos[hour] = {
              [property]: value.toString(),
            };
          }
        });

        const insumosToSubmit: InsumoInsert[] = [];
        const _errors: { [key: string]: (keyof InsumoInsert)[] } = {};

        Object.entries(insumos).forEach(([hour, insumo]) => {
          if (Object.values(insumo).filter((x) => x !== '').length > 0) {
            let Schema = InsumoSchema;
            type S = typeof Schema;

            if (!unit?.fuelType2) {
              Schema = Schema.omit({
                price_ft2: true,
                share_ft2: true,
              }) as S;
            }
            const p = Schema.safeParse({
              ...insumo,
              hour,
              min: insumo.min === '' ? null : Number(insumo.min),
              max: insumo.max === '' ? null : Number(insumo.max),
              share_ft1:
                insumo.share_ft1 === '' ? null : Number(insumo.share_ft1),
              share_ft2:
                insumo.share_ft2 === '' ? null : Number(insumo.share_ft2),
              price_ft1:
                insumo.price_ft1 === '' ? null : Number(insumo.price_ft1),
              price_ft2:
                insumo.price_ft2 === '' ? null : Number(insumo.price_ft2),
            });
            if (p.success) {
              insumosToSubmit.push(p.data);
            } else {
              _errors[hour] = p.error.issues.map((x) =>
                x.path[0].toString(),
              ) as (keyof InsumoInsert)[];
            }
          }
        });

        if (Object.keys(_errors).length) {
          setErrors(_errors);
        } else {
          mutate(insumosToSubmit);
        }
      }}
    >
      {children}
    </form>
  );
};

export default AvailabilitiesForm;
