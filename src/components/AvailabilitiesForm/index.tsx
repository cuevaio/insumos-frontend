import React from 'react';

import { useDate, useMarket, useUnit } from '@/contexts/AppContext';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useInsumos } from '@/hooks/useInsumos';
import { useUpsertInsumos } from '@/hooks/useUpsertInsumos';

import { InsumoSchema } from '@/lib/schemas';
import { InsumoInsert } from '@/lib/types';

interface AvailabilitiesFormProps {
  formRef: React.MutableRefObject<HTMLFormElement | null>;
  children: React.ReactNode;
}

const AvailabilitiesForm: React.FC<AvailabilitiesFormProps> = ({
  formRef,
  children,
}) => {
  const { value: unit } = useUnit();
  const { value: date, dateDiff } = useDate();
  const { value: market } = useMarket();

  const { mutate, isSuccess, isPending } = useUpsertInsumos();

  const { data: existingInsumos } = useInsumos({
    date: date?.toString(),
    unit,
    market,
  });

  const { t } = useTranslation();

  const onAvailabilitiesFormSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (dateDiff < 0) {
      toast.error(t('Cannot edit dates in the past'));
      return;
    }

    const formData = Array.from(new FormData(event.target as HTMLFormElement));

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

        if (!unit?.fuelTypeList[1]) {
          Schema = Schema.omit({
            price_ft1: true,

            price_ft2: true,
            share_ft2: true,
          }) as S;
        }

        const rawInsumo = {
          ...insumo,
          hour,
          min: insumo.min === '' ? null : Number(insumo.min),
          max: insumo.max === '' ? null : Number(insumo.max),
          share_ft1: insumo.share_ft1 === '' ? null : Number(insumo.share_ft1),
          share_ft2: insumo.share_ft2 === '' ? null : Number(insumo.share_ft2),
          price_ft1: insumo.price_ft1 === '' ? null : Number(insumo.price_ft1),
          price_ft2: insumo.price_ft2 === '' ? null : Number(insumo.price_ft2),
          note: insumo.note === '' ? null : insumo.note,
        };
        const p = Schema.safeParse(rawInsumo);

        const existingInsumo = existingInsumos?.insumos.find(
          (x) => x.hour === Number(hour),
        );

        if (p.success) {
          let submit = false;

          console.log(p.data, existingInsumo);

          if (p.data.min !== existingInsumo?.min) {
            console.log('min');
            submit = true;
          }

          if (p.data.max !== existingInsumo?.max) {
            console.log('max');
            submit = true;
          }

          if (p.data.share_ft1 !== existingInsumo?.share_ft1) {
            console.log('share_ft1');
            submit = true;
          }

          if (p.data.note !== existingInsumo?.note) {
            console.log('note');
            submit = true;
          }

          if (p.data.agc !== existingInsumo?.agc) {
            console.log('agc');
            submit = true;
          }

          if (unit?.fuelTypeList[1]) {
            if (p.data.share_ft2 !== existingInsumo?.share_ft2) {
              console.log('share_ft2');
              submit = true;
            }
          }

          if (submit) {
            insumosToSubmit.push(p.data);
          }
        } else {
          _errors[hour] = p.error.issues.map((x) =>
            x.path[0].toString(),
          ) as (keyof InsumoInsert)[];
        }
      }
    });

    console.log(insumosToSubmit);

    if (Object.keys(_errors).length) {
      Object.entries(_errors).forEach(([hour, errors]) => {
        toast.error(t(`${hour}: ${errors.join(', ')}`));
      });
    } else {
      mutate(insumosToSubmit);
    }
  };

  React.useEffect(() => {
    if (!isPending) {
      if (isSuccess) {
        toast.success(t('Successfully updated offers'));
      }
    }
  }, [isSuccess, isPending, t]);

  return (
    <form
      className="w-full"
      ref={formRef}
      onSubmit={onAvailabilitiesFormSubmit}
    >
      {children}
    </form>
  );
};

export default AvailabilitiesForm;
