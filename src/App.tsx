import React from 'react';

import {
  useDate,
  useMarket,
  useShowFT1Columns,
  useShowFT2Columns,
  useUnit,
} from '@/contexts/AppContext';
import { CalendarDate } from '@internationalized/date';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectItem,
  SelectListBox,
  SelectPopover,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import ExportAvailabilitiesButton from '@/components/ExportAvailabilitiesButton';

import {
  AvailabilityRecord,
  useAvailabilities,
} from '@/hooks/useAvailabilities';
import { useInsumos } from '@/hooks/useInsumos';
import { useUpsertInsumos } from '@/hooks/useUpsertInsumos';

import { noteEnumValues, prices } from '@/lib/constants';
import { InsumoSchema } from '@/lib/schemas';
import type { InsumoInsert } from '@/lib/types';
import { cn } from '@/lib/utils';

import { Filters } from './components/Filters';

function App() {
  const {
    t,
    i18n: { language, changeLanguage },
  } = useTranslation();

  const { value: unit } = useUnit();
  const { value: date } = useDate();
  const { value: market } = useMarket();

  const [errors, setErrors] = React.useState<{
    [key: string]: (keyof InsumoInsert)[];
  }>({});
  const [isFlashingErrors, setIsFlashingErrors] = React.useState(false);
  const [isFlashingSuccess, setIsFlashingSuccess] = React.useState(false);

  const { value: showFT1Columns } = useShowFT1Columns();
  const { value: showFT2Columns } = useShowFT2Columns();

  const formRef = React.useRef<HTMLFormElement | null>(null);

  const { data: availabilities } = useAvailabilities({
    unitId: unit?.id?.toString(),
    date: date?.toString(),
    market,
  });

  const { data: insumos } = useInsumos({
    date: date?.toString(),
    unitId: unit?.id?.toString(),
    market,
  });

  const { mutate, data, isSuccess, isPending } = useUpsertInsumos({
    unitId: unit?.id?.toString(),
    date: date?.toString(),
    market,
  });

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

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    rowIndex: number,
    cellIndex: number,
  ) => {
    const columns = 8; // Number of editable columns
    const totalRows =
      date && availabilities ? availabilities.dayDurations[date.toString()] : 0;

    let element: HTMLInputElement | null = null;

    if (cellIndex !== 4) {
      switch (event.key) {
        case 'ArrowUp':
          if (rowIndex > 0) {
            element = document.querySelector(
              `#input-${rowIndex - 1}-${cellIndex}`,
            ) as HTMLInputElement;
          }
          break;
        case 'ArrowDown':
          if (rowIndex < totalRows) {
            element = document.querySelector(
              `#input-${rowIndex + 1}-${cellIndex}`,
            ) as HTMLInputElement;
          }
          break;
        case 'ArrowLeft':
          if (cellIndex > 0) {
            if (cellIndex === 5) {
              element = document.querySelector(
                `#input-${rowIndex}-${3}`,
              ) as HTMLInputElement;
            } else {
              element = document.querySelector(
                `#input-${rowIndex}-${cellIndex - 1}`,
              ) as HTMLInputElement;
            }
          }
          break;
        case 'ArrowRight':
          if (cellIndex < columns) {
            if (cellIndex === 3) {
              element = document.querySelector(
                `#input-${rowIndex}-${5}`,
              ) as HTMLInputElement;
            } else {
              element = document.querySelector(
                `#input-${rowIndex}-${cellIndex + 1}`,
              ) as HTMLInputElement;
            }
          }
          break;
      }
    }

    if (element) {
      event.preventDefault();
      element.focus();
    }
  };
  const [checkedStates, setCheckedStates] = React.useState<{
    [key: string]: boolean;
  }>({});

  React.useEffect(() => {
    if (!availabilities?.availabilities || !insumos?.insumos) return;
    const checked: { [key: string]: boolean } = {};

    availabilities.availabilities.forEach((a) => {
      const insumo = insumos.insumos.find((i) => i.hour === a.hour);
      if (!insumo) {
        checked[`${a.hour - 1}-fix-ft1fnc`] = false;
        checked[`${a.hour - 1}-ft1nc`] = false;
        checked[`${a.hour - 1}-ft1anc`] = false;
        checked[`${a.hour - 1}-ft1cil`] = false;
        checked[`${a.hour - 1}-ft1lie`] = false;

        if (unit?.fuelType2ID) {
          checked[`${a.hour - 1}-fix-ft2fnc`] = false;
          checked[`${a.hour - 1}-ft2nc`] = false;
          checked[`${a.hour - 1}-ft2anc`] = false;
          checked[`${a.hour - 1}-ft2cil`] = false;
          checked[`${a.hour - 1}-ft2lie`] = false;
        }
      } else {
        if (a.fixedAvailability.fuelType1FixedNetCapacity === insumo.max) {
          checked[`${a.hour - 1}-fix-ft1fnc`] = true;
        }
        if (a.fuelType1NetCapacity === insumo.max) {
          checked[`${a.hour - 1}-ft1nc`] = true;
        }
        if (a.fuelType1AvailabilityNetCapacity === insumo.max) {
          checked[`${a.hour - 1}-ft1anc`] = true;
        }
        if (a.fuelType1Cil === insumo.max) {
          checked[`${a.hour - 1}-ft1cil`] = true;
        }
        if (a.fuelType1Lie === insumo.max) {
          checked[`${a.hour - 1}-ft1lie`] = true;
        }

        if (unit?.fuelType2ID) {
          if (a.fixedAvailability.fuelType2FixedNetCapacity === insumo.max) {
            checked[`${a.hour - 1}-fix-ft2fnc`] = true;
          }
          if (a.fuelType2NetCapacity === insumo.max) {
            checked[`${a.hour - 1}-ft2nc`] = true;
          }
          if (a.fuelType2AvailabilityNetCapacity === insumo.max) {
            checked[`${a.hour - 1}-ft2anc`] = true;
          }
          if (a.fuelType2Cil === insumo.max) {
            checked[`${a.hour - 1}-ft2cil`] = true;
          }
          if (a.fuelType2Lie === insumo.max) {
            checked[`${a.hour - 1}-ft2lie`] = true;
          }
        }
      }
    });

    setCheckedStates({ ...checked });
  }, [availabilities, insumos, unit]);

  const updateMaxValue = (
    rowIndex: number,
    columnName: string,
    value?: number,
  ) => {
    const input = document.querySelector(
      `#input-${rowIndex}-0`,
    ) as HTMLInputElement;

    if (input) {
      input.value = value?.toString() || '';
    }

    setCheckedStates((prev) => ({
      ...prev,

      [`${rowIndex}-fix-ft1fnc`]: false,
      [`${rowIndex}-ft1nc`]: false,
      [`${rowIndex}-ft1anc`]: false,
      [`${rowIndex}-ft1nc`]: false,
      [`${rowIndex}-ft1cil`]: false,
      [`${rowIndex}-ft1lie`]: false,

      [`${rowIndex}-${columnName}`]: true,
    }));
  };

  const calcPreselection = (availability?: AvailabilityRecord) => {
    if (!unit || !availability) return;

    const comments = (availability.comments || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

    const operationType = (availability.operationType || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

    const getMinPrimary = () => {
      return Math.min(
        typeof availability.fuelType1AvailabilityNetCapacity === 'number' &&
          availability.fuelType1AvailabilityNetCapacity > 0
          ? availability.fuelType1AvailabilityNetCapacity
          : 999999,
        typeof availability.fixedAvailability.fuelType1FixedNetCapacity ===
          'number' &&
          availability.fixedAvailability.fuelType1FixedNetCapacity > 0
          ? availability.fixedAvailability.fuelType1FixedNetCapacity
          : 999999,
        typeof availability.fuelType1NetCapacity === 'number' &&
          availability.fuelType1NetCapacity > 0
          ? availability.fuelType1NetCapacity
          : 999999,
      );
    };

    // CASE 6
    if (
      operationType.includes('disponible a despacho') &&
      comments.includes('restriccion') &&
      comments.includes('suministrador')
    ) {
      const min = getMinPrimary();
      if (min !== 999999) return min;
    }

    // CASE 5
    if (
      operationType.includes('no disponible') &&
      comments.includes('emergencia')
    ) {
      const min = getMinPrimary();
      if (min !== 999999) return min;
    }

    // CASE 4
    if (operationType.includes('obligada')) {
      const min = getMinPrimary();
      if (min !== 999999) return min;
    }

    // CASE 3
    if (comments.includes('licencia') && comments.includes('mantenimiento')) {
      const min = getMinPrimary();
      if (min !== 999999) return min;
    }

    // CASE 2
    if (
      operationType === 'disponible a despacho' &&
      comments.includes('limite minimo')
    ) {
      if (
        typeof availability.fuelType1AvailabilityNetCapacity === 'number' &&
        availability.fuelType1AvailabilityNetCapacity > 0
      ) {
        return availability.fuelType1AvailabilityNetCapacity;
      }
    }

    // CASE 1
    if (unit?.fuelType2ID) {
      if (
        typeof availability.fuelType2AvailabilityNetCapacity === 'number' &&
        availability.fuelType2AvailabilityNetCapacity > 0 &&
        !availability.fuelType1AvailabilityNetCapacity
      ) {
        return availability.fuelType2AvailabilityNetCapacity;
      }
    }

    return availability.fuelType1AvailabilityNetCapacity;
  };

  // TODO: defaultLanguage will be get from backend
  const defaultLanguage = 'es';

  React.useEffect(() => {
    const userHasDifferentLanguage =
      defaultLanguage && defaultLanguage !== language;
    if (userHasDifferentLanguage) changeLanguage(defaultLanguage);
  }, [defaultLanguage, language, changeLanguage]);

  const dateDiff = React.useMemo(() => {
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

  const minEditableHour = React.useMemo(() => {
    const now = new Date();
    const nowHour = now.getHours();

    return Math.max(nowHour - 1, 0);
  }, []);

  const isHourEditable = React.useCallback(
    (hour: number) => {
      if (dateDiff < 0) return false;
      if (dateDiff === 0 && hour < minEditableHour) return false;
      return true;
    },
    [dateDiff, minEditableHour],
  );

  const renderCapacityCell = (
    rowIndex: number,
    columnName: string,
    value?: number,
  ) => {
    if (value === undefined || value === null) return null;
    const cellId = `${rowIndex}-${columnName}`;

    return (
      <div className="flex items-center gap-2 px-2">
        <span className="min-w-[24px]">{value}</span>
        <Checkbox
          key={JSON.stringify(checkedStates)}
          className="h-4 w-4"
          checked={checkedStates[cellId] || false}
          onCheckedChange={(checked) => {
            if (checked) {
              updateMaxValue(rowIndex, columnName, value);
            }
          }}
        />
      </div>
    );
  };

  return (
    <div className="container mx-auto flex w-full flex-col flex-wrap gap-4">
      <Filters />
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
        <Table>
          <TableHeader className="bg-muted">
            {(showFT1Columns || (showFT2Columns && unit?.fuelType2)) && (
              <TableRow className="text-xxs">
                <TableHead
                  colSpan={2}
                  className="border-l border-t"
                ></TableHead>
                {showFT1Columns && (
                  <TableHead
                    colSpan={5}
                    className="border-x border-t text-center"
                  >
                    {t('Declared Net Capacity of the plant or package')} -{' '}
                    {unit?.fuelType1?.name.toUpperCase()}
                  </TableHead>
                )}
                {showFT2Columns && unit?.fuelType2 && (
                  <TableHead
                    colSpan={5}
                    className="border-x border-t text-center"
                  >
                    {t('Declared Net Capacity of the plant or package')} -{' '}
                    {unit?.fuelType2?.name.toUpperCase()}
                  </TableHead>
                )}
                <TableHead
                  colSpan={13}
                  className="border-r border-t"
                ></TableHead>
              </TableRow>
            )}
            <TableRow className="text-xxs border-t leading-[0.75rem]">
              <TableHead className="border-l">{t('Hour')}</TableHead>
              <TableHead className="min-w-[100px]">{t('Schedule')}</TableHead>
              {showFT1Columns && (
                <>
                  <TableHead className="text-xxs min-w-[120px] border-l">
                    <span
                      className="line-clamp-3 overflow-hidden break-words"
                      title={t(
                        'Corrected to Summer Design Conditions (Contractual) MW',
                      )}
                    >
                      {t(
                        'Corrected to Summer Design Conditions (Contractual) MW',
                      )}
                    </span>
                  </TableHead>
                  <TableHead className="text-xxs min-w-[120px] border-l">
                    <span
                      className="line-clamp-3 overflow-hidden break-words"
                      title={t('Real Environment Conditions MW')}
                    >
                      {t('Real Environment Conditions MW')}
                    </span>
                  </TableHead>
                  <TableHead className="text-xxs min-w-[120px] border-l">
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
                  <TableHead className="text-xxs min-w-[120px] border-l">
                    <span
                      className="line-clamp-3 overflow-hidden break-words"
                      title={t('From Legacy Interconnection Contract (CIL) MW')}
                    >
                      {t('From Legacy Interconnection Contract (CIL) MW')}
                    </span>
                  </TableHead>
                  <TableHead className="text-xxs min-w-[120px] border-l">
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
                  <TableHead className="text-xxs min-w-[120px] border-l">
                    <span
                      className="line-clamp-3 overflow-hidden break-words"
                      title={t(
                        'Corrected to Summer Design Conditions (Contractual) MW',
                      )}
                    >
                      {t(
                        'Corrected to Summer Design Conditions (Contractual) MW',
                      )}
                    </span>
                  </TableHead>
                  <TableHead className="text-xxs min-w-[120px] border-l">
                    <span
                      className="line-clamp-3 overflow-hidden break-words"
                      title={t('Real Environment Conditions MW')}
                    >
                      {t('Real Environment Conditions MW')}
                    </span>
                  </TableHead>
                  <TableHead className="text-xxs min-w-[120px] border-l">
                    <span
                      className="line-clamp-3 overflow-hidden break-words"
                      title={t('Considering Available Diesel MW')}
                    >
                      {t('Considering Available Diesel MW')}
                    </span>
                  </TableHead>
                  <TableHead className="text-xxs min-w-[120px] border-l">
                    <span
                      className="line-clamp-3 overflow-hidden break-words"
                      title={t('From Legacy Interconnection Contract (CIL) MW')}
                    >
                      {t('From Legacy Interconnection Contract (CIL) MW')}
                    </span>
                  </TableHead>
                  <TableHead className="text-xxs min-w-[120px] border-l">
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
              <TableHead className="text-xxs min-w-[120px]">
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
                  {t('Operation Type')} (Disponible a Despacho / Operación
                  Obligada)
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
          <TableBody
            className="text-xs"
            key={`${market}-${unit?.id?.toString()}-${date?.toString()}`}
          >
            {date &&
              availabilities &&
              insumos &&
              new Array(availabilities.dayDurations[date.toString()])
                .fill(0)
                .map((_, idx) => {
                  const hour = idx + 1;
                  const availability = availabilities.availabilities.find(
                    (x) => x.hour === hour,
                  );

                  const insumo = insumos?.insumos.find((x) => x.hour === hour);
                  return (
                    <TableRow
                      key={idx}
                      className={cn(
                        idx % 2 !== 0 ? 'bg-muted/50' : '',
                        'hover:bg-blue-300/50',
                      )}
                    >
                      <TableCell className="border-l bg-muted/50 tabular-nums">
                        {hour}
                      </TableCell>
                      <TableCell className="bg-muted/50 tabular-nums">
                        {idx.toString().padStart(2, '0') + ':00'} -{' '}
                        {hour.toString().padStart(2, '0') + ':00'}
                      </TableCell>
                      {showFT1Columns && (
                        <>
                          <TableCell className="bg-muted/50">
                            {renderCapacityCell(
                              idx,
                              'fix-ft1fnc',
                              availability?.fixedAvailability
                                .fuelType1FixedNetCapacity,
                            )}
                          </TableCell>
                          <TableCell className="bg-muted/50">
                            {renderCapacityCell(
                              idx,
                              'ft1nc',
                              availability?.fuelType1NetCapacity,
                            )}
                          </TableCell>
                          <TableCell className="bg-muted/50">
                            {renderCapacityCell(
                              idx,
                              'ft1anc',
                              availability?.fuelType1AvailabilityNetCapacity,
                            )}
                          </TableCell>
                          <TableCell className="bg-muted/50">
                            {renderCapacityCell(
                              idx,
                              'ft1cil',
                              availability?.fuelType1Cil,
                            )}
                          </TableCell>
                          <TableCell className="bg-muted/50">
                            {renderCapacityCell(
                              idx,
                              'ft1lie',
                              availability?.fuelType1Lie,
                            )}
                          </TableCell>
                        </>
                      )}
                      {showFT2Columns && unit?.fuelType2 && (
                        <>
                          <TableCell className="bg-muted/50">
                            {renderCapacityCell(
                              idx,
                              'ft2-fixed',
                              availability?.fixedAvailability
                                .fuelType2FixedNetCapacity,
                            )}
                          </TableCell>
                          <TableCell className="bg-muted/50">
                            {renderCapacityCell(
                              idx,
                              'ft2-net',
                              availability?.fuelType2NetCapacity,
                            )}
                          </TableCell>
                          <TableCell className="bg-muted/50">
                            {renderCapacityCell(
                              idx,
                              'ft2-availability',
                              availability?.fuelType2AvailabilityNetCapacity,
                            )}
                          </TableCell>
                          <TableCell className="bg-muted/50">
                            {renderCapacityCell(
                              idx,
                              'ft2-cil',
                              availability?.fuelType2Cil,
                            )}
                          </TableCell>
                          <TableCell className="bg-muted/50">
                            {renderCapacityCell(
                              idx,
                              'ft2-lie',
                              availability?.fuelType2Lie,
                            )}
                          </TableCell>
                        </>
                      )}
                      <TableCell className="bg-muted/50">
                        {calcPreselection(availability) || ''}
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          id={`input-${idx}-${0}`}
                          step=".01"
                          defaultValue={insumo?.max}
                          disabled={!isHourEditable(hour)}
                          onKeyDown={(e) => handleKeyDown(e, idx, 0)}
                          className={cn(
                            isFlashingErrors &&
                              errors[hour] &&
                              errors[hour].includes('max') &&
                              'border-red-500',
                            isFlashingSuccess &&
                              data?.inserted.includes(hour) &&
                              'border-green-500',
                            isFlashingSuccess &&
                              data?.updated[hour]?.includes('max') &&
                              'border-blue-500',
                            !isHourEditable(hour)
                              ? 'cursor-not-allowed !bg-muted'
                              : 'cursor-text',
                            'transition-colors duration-300',
                          )}
                          name={`${hour}-max`}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          id={`input-${idx}-${1}`}
                          step=".01"
                          defaultValue={insumo?.min}
                          disabled={!isHourEditable(hour)}
                          onKeyDown={(e) => handleKeyDown(e, idx, 1)}
                          className={cn(
                            isFlashingErrors &&
                              errors[hour] &&
                              errors[hour].includes('min') &&
                              'border-red-500',
                            isFlashingSuccess &&
                              data?.inserted.includes(hour) &&
                              'border-green-500',
                            isFlashingSuccess &&
                              data?.updated[hour]?.includes('min') &&
                              'border-blue-500',
                            !isHourEditable(hour) &&
                              'cursor-not-allowed !bg-muted',
                            'transition-colors duration-300',
                          )}
                          name={`${hour}-min`}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          id={`input-${idx}-${2}`}
                          step=".01"
                          disabled={!isHourEditable(hour)}
                          className={cn(
                            isFlashingErrors &&
                              errors[hour] &&
                              errors[hour].includes('share_ft1') &&
                              'border-red-500',
                            isFlashingSuccess &&
                              data?.inserted.includes(hour) &&
                              'border-green-500',
                            isFlashingSuccess &&
                              data?.updated[hour]?.includes('share_ft1') &&
                              'border-blue-500',
                            !isHourEditable(hour) &&
                              'cursor-not-allowed !bg-muted',
                            'transition-colors duration-300',
                          )}
                          defaultValue={
                            typeof insumo?.share_ft1 === 'number'
                              ? insumo.share_ft1 * 100
                              : undefined
                          }
                          onKeyDown={(e) => handleKeyDown(e, idx, 2)}
                          name={`${hour}-share_ft1`}
                        />
                      </TableCell>
                      {unit?.fuelType2 && (
                        <TableCell>
                          <Input
                            type="number"
                            id={`input-${idx}-${3}`}
                            step=".01"
                            disabled={!isHourEditable(hour)}
                            className={cn(
                              isFlashingErrors &&
                                errors[hour] &&
                                errors[hour].includes('share_ft2') &&
                                'border-red-500',
                              isFlashingSuccess &&
                                data?.inserted.includes(hour) &&
                                'border-green-500',
                              isFlashingSuccess &&
                                data?.updated[hour]?.includes('share_ft2') &&
                                'border-blue-500',
                              !isHourEditable(hour) &&
                                'cursor-not-allowed !bg-muted',
                              'transition-colors duration-300',
                            )}
                            defaultValue={
                              typeof insumo?.share_ft2 === 'number'
                                ? insumo.share_ft2 * 100
                                : undefined
                            }
                            onKeyDown={(e) => handleKeyDown(e, idx, 3)}
                            name={`${hour}-share_ft2`}
                          />
                        </TableCell>
                      )}
                      <TableCell>
                        <label className="hidden">Select note</label>
                        <Select
                          aria-labelledby="label"
                          placeholder=""
                          name={`${hour}-note`}
                          defaultSelectedKey={insumo?.note}
                          isDisabled={!isHourEditable(hour)}
                        >
                          <SelectTrigger
                            id={`input-${idx}-${4}`}
                            onKeyDown={(e) => handleKeyDown(e, idx, 4)}
                            className={cn(
                              'h-full px-2 py-0 transition-colors duration-300',
                              isFlashingErrors &&
                                errors[hour] &&
                                errors[hour].includes('note') &&
                                'border-red-500',
                              isFlashingSuccess &&
                                data?.inserted.includes(hour) &&
                                'border-green-500',
                              isFlashingSuccess &&
                                data?.updated[hour]?.includes('note') &&
                                'border-blue-500',
                              !isHourEditable(hour) &&
                                'cursor-not-allowed !bg-muted',
                              'transition-colors duration-300',
                            )}
                          >
                            <SelectValue className="text-xs" />
                          </SelectTrigger>
                          <SelectPopover>
                            <SelectListBox>
                              {noteEnumValues.map((n) => (
                                <SelectItem key={n} id={n}>
                                  {n}
                                </SelectItem>
                              ))}
                            </SelectListBox>
                          </SelectPopover>
                        </Select>
                      </TableCell>
                      <TableCell className="flex justify-center">
                        <Checkbox
                          id={`input-${idx}-${5}`}
                          defaultChecked={insumo?.agc}
                          name={`${hour}-agc`}
                          disabled={!isHourEditable(hour)}
                          onKeyDown={(e) =>
                            handleKeyDown(
                              e as React.KeyboardEvent<HTMLInputElement>,
                              idx,
                              5,
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          id={`input-${idx}-${6}`}
                          step=".01"
                          defaultValue={insumo?.price_ft1}
                          disabled={!isHourEditable(hour)}
                          onKeyDown={(e) => handleKeyDown(e, idx, 6)}
                          className={cn(
                            isFlashingErrors &&
                              errors[hour] &&
                              errors[hour].includes('price_ft1') &&
                              'border-red-500',
                            isFlashingSuccess &&
                              data?.inserted.includes(hour) &&
                              'border-green-500',
                            isFlashingSuccess &&
                              data?.updated[hour]?.includes('price_ft1') &&
                              'border-blue-500',
                            !isHourEditable(hour) &&
                              'cursor-not-allowed !bg-muted',
                            'transition-colors duration-300',
                          )}
                          name={`${hour}-price_ft1`}
                        />
                      </TableCell>
                      {unit?.fuelType2 && (
                        <TableCell>
                          <Input
                            type="number"
                            id={`input-${idx}-${7}`}
                            step=".01"
                            defaultValue={insumo?.price_ft2}
                            disabled={!isHourEditable(hour)}
                            onKeyDown={(e) => handleKeyDown(e, idx, 7)}
                            className={cn(
                              isFlashingErrors &&
                                errors[hour] &&
                                errors[hour].includes('price_ft2') &&
                                'border-red-500',
                              isFlashingSuccess &&
                                data?.inserted.includes(hour) &&
                                'border-green-500',
                              isFlashingSuccess &&
                                data?.updated[hour]?.includes('price_ft2') &&
                                'border-blue-500',
                              !isHourEditable(hour) &&
                                'cursor-not-allowed !bg-muted',
                              'transition-colors duration-300',
                              'control',
                            )}
                            name={`${hour}-price_ft2`}
                          />
                        </TableCell>
                      )}
                      <TableCell className="bg-muted/50">
                        {availability?.operationType}
                      </TableCell>
                      <TableCell className="bg-muted/50">
                        {availability?.comments}
                      </TableCell>
                      <TableCell className="bg-muted/50">
                        {insumo &&
                          new Date(insumo.updated_at).toLocaleDateString(
                            'es-MX',
                          )}
                      </TableCell>
                      <TableCell className="border-r bg-muted/50">
                        {insumo && 'hi@cueva.io'}
                      </TableCell>
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
        <p className="my-1 text-center text-xs text-muted-foreground">
          {t('All dates are displayed in timezone')} {unit?.timeZone}
        </p>
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
                Nodo {unit?.name}: {unit && `$${prices[unit.id].op}`}
              </p>
              <p className="text-xs">{t('Days without PML')}: 10/02/2024</p>
            </div>
            <div className="rounded-lg border bg-rose-200 p-2">
              <p className="text-xs font-bold">{t('Transmission Rate')}</p>
              <p className="text-xs">{unit && `$${prices[unit.id].tm}`}</p>
            </div>
            <div className="rounded-lg border bg-green-200 p-2">
              <p className="text-xs font-bold">{t('Operation Rate')}</p>
              <p className="text-xs">{unit && `$${prices[unit.id].op}`}</p>
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
      </form>
    </div>
  );
}

export default App;
