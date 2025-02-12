import React from 'react';

import {
  useDate,
  useMarket,
  useUnit,
  useUpsertInsumosState,
} from '@/contexts/AppContext';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

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

  const { mutate, data, isSuccess, isPending } = useUpsertInsumos({
    unitId: unit?.id?.toString(),
    date: date?.toString(),
    market,
  });

  const {
    errors,
    setErrors,
    setIsFlashingSuccess,
    setIsFlashingErrors,
    setData,
  } = useUpsertInsumosState();

  React.useEffect(() => {
    setData(data);
  }, [data, setData]);

  const {
    t,
    i18n: { language },
  } = useTranslation();

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
          share_ft1: insumo.share_ft1 === '' ? null : Number(insumo.share_ft1),
          share_ft2: insumo.share_ft2 === '' ? null : Number(insumo.share_ft2),
          price_ft1: insumo.price_ft1 === '' ? null : Number(insumo.price_ft1),
          price_ft2: insumo.price_ft2 === '' ? null : Number(insumo.price_ft2),
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
  };

  React.useEffect(() => {
    if (Object.keys(errors).length) {
      toast.error(t('Correctly fill in the red fields'));
      setIsFlashingErrors(true);
      setTimeout(() => {
        setIsFlashingErrors(false);
      }, 3000);
    }
  }, [errors, t]);

  React.useEffect(() => {
    if (!isPending) {
      if (isSuccess) {
        setIsFlashingSuccess(true);
        setTimeout(() => {
          setIsFlashingSuccess(false);
        }, 3000);
      }
    }
  }, [isSuccess, isPending]);

  React.useEffect(() => {
    if (!isPending) {
      if (isSuccess) {
        if (
          data.inserted.length === 0 &&
          Object.keys(data.updated).length === 0
        ) {
          toast(t('No changes to save'));
        } else {
          if (data.inserted.length > 0) {
            toast.success(
              (() => {
                if (language === 'es')
                  return `Se crearon ${data.inserted.length} ofertas`;
                return `${data.inserted.length} offers were created`;
              })(),
            );
          }

          if (Object.keys(data.updated).length) {
            toast.success(
              (() => {
                if (language === 'es')
                  return `Se actualizaron ${Object.keys(data.updated).length} ofertas`;
                return `${data.inserted.length} offers were updated`;
              })(),
            );
          }
        }
      }
    }
  }, [data, isSuccess, isPending, language, t]);
  
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
