import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';

import { CalendarDate, parseDate } from '@internationalized/date';
import { type Key } from 'react-aria-components';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useLocalStorage } from 'usehooks-ts';

import AvailabilitiesFooter from '@/components/AvailabilitiesFooter';
import AvailabilitiesForm from '@/components/AvailabilitiesForm';
import AvailabilitiesHeader from '@/components/AvailabilitiesHeader';
import AvailabilitiesTable from '@/components/AvailabilitiesTable';

import { useAvailabilities } from '@/hooks/useAvailabilities';
import { useInsumos } from '@/hooks/useInsumos';
import { UnitWithFuelType, useUnits } from '@/hooks/useUnits';
import { useUpsertInsumos } from '@/hooks/useUpsertInsumos';

import { InsumoSchema } from '@/lib/schemas';
import type { InsumoInsert, Market } from '@/lib/types';

function App() {
  const {
    t,
    i18n: { language, changeLanguage },
  } = useTranslation();

  const { data: units } = useUnits();

  const [unitId, setUnitId] = useState<Key>();
  const [date, setDate] = useState<CalendarDate | null>(null);
  const [market, setMarket] = useState<Market | null>(null);
  const [errors, setErrors] = useState<{
    [key: string]: (keyof InsumoInsert)[];
  }>({});
  const [isFlashingErrors, setIsFlashingErrors] = useState(false);
  const [isFlashingSuccess, setIsFlashingSuccess] = useState(false);

  const [showFT1Columns, setShowFT1Columns] = useLocalStorage(
    'show_ft_1',
    false,
  );
  const [showFT2Columns, setShowFT2Columns] = useLocalStorage(
    'show_ft_2',
    false,
  );

  const formRef = useRef<HTMLFormElement | null>(null);

  const { mutate, data, isSuccess, isPending } = useUpsertInsumos({
    unitId: unitId?.toString(),
    date: date?.toString(),
    market,
  });

  const onAvailabilitiesFormSubmit = (event: FormEvent<HTMLFormElement>) => {
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

  const unit = useMemo(
    () => units?.find((u) => u.id === unitId),
    [unitId, units],
  );

  useEffect(() => {
    if (Object.keys(errors).length) {
      toast.error(t('Correctly fill in the red fields'));
      setIsFlashingErrors(true);
      setTimeout(() => {
        setIsFlashingErrors(false);
      }, 3000);
    }
  }, [errors, t]);

  useEffect(() => {
    if (!isPending) {
      if (isSuccess) {
        setIsFlashingSuccess(true);
        setTimeout(() => {
          setIsFlashingSuccess(false);
        }, 3000);
      }
    }
  }, [isSuccess, isPending]);

  useEffect(() => {
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

  useEffect(() => {
    if (!unitId) {
      const lsUnitId = localStorage.getItem('unit_id');
      if (lsUnitId) {
        setUnitId(lsUnitId);
      }
    } else {
      localStorage.setItem('unit_id', unitId.toString());
    }
  }, [unitId, setUnitId]);

  useEffect(() => {
    if (!date) {
      const lsDate = localStorage.getItem('date');
      if (lsDate) {
        setDate(parseDate(lsDate));
      }
    } else {
      localStorage.setItem('date', date.toString());
    }
  }, [date, setDate]);

  useEffect(() => {
    if (!market) {
      const lsMarket = localStorage.getItem('market');
      if (lsMarket) {
        setMarket(lsMarket as Market);
      }
    } else {
      localStorage.setItem('market', market);
    }
  }, [market, setMarket]);

  const { data: availabilities } = useAvailabilities({
    unitId: unitId?.toString(),
    date: date?.toString(),
    market,
  });

  const { data: insumos } = useInsumos({
    date: date?.toString(),
    unitId: unitId?.toString(),
    market,
  });

  // TODO: defaultLanguage will be get from backend
  const defaultLanguage = 'es';

  useEffect(() => {
    const userHasDifferentLanguage =
      defaultLanguage && defaultLanguage !== language;
    if (userHasDifferentLanguage) changeLanguage(defaultLanguage);
  }, [defaultLanguage, language, changeLanguage]);

  const dateDiff = useMemo(() => {
    if (!date) return 0;
    const _today = new Date();
    const today = new CalendarDate(
      _today.getFullYear(),
      _today.getMonth() + 1,
      _today.getDate(),
    );
    console.log(date.compare(today));
    return date.compare(today);
  }, [date]);

  return (
    <div className="container mx-auto flex w-full flex-col flex-wrap gap-2">
      <AvailabilitiesHeader
        showColumns={!!(date && availabilities && insumos)}
        units={units}
        unit={unit as UnitWithFuelType}
        unitId={unitId}
        setUnitId={setUnitId}
        date={date}
        setDate={setDate}
        market={market}
        setMarket={setMarket}
        showFT1Columns={showFT1Columns}
        setShowFT1Columns={setShowFT1Columns}
        showFT2Columns={showFT2Columns}
        setShowFT2Columns={setShowFT2Columns}
      />
      <AvailabilitiesForm
        formRef={formRef}
        onSubmit={onAvailabilitiesFormSubmit}
      >
        <AvailabilitiesTable
          unitId={unitId}
          date={date}
          availabilities={availabilities}
          insumos={insumos}
          showFT1Columns={showFT1Columns}
          showFT2Columns={showFT2Columns}
          dateDiff={dateDiff}
          errors={errors}
          isFlashingSuccess={isFlashingSuccess}
          isFlashingErrors={isFlashingErrors}
          data={data}
        />
        <AvailabilitiesFooter
          unit={unit}
          dateDiff={dateDiff}
          formRef={formRef}
        />
      </AvailabilitiesForm>
    </div>
  );
}

export default App;
