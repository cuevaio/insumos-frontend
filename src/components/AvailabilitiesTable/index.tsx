import {
  FC,
  KeyboardEvent,
  useCallback,
  // useRef,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { CalendarDate, parseDate } from '@internationalized/date';
// import { useLocalStorage } from 'usehooks-ts';
import { type Key } from 'react-aria-components';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

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

import {
  AvailabilitiesQueryResponse,
  AvailabilityRecord,
  useAvailabilities,
} from '@/hooks/useAvailabilities';
import { Insumo, useInsumos } from '@/hooks/useInsumos';
import { useUnits } from '@/hooks/useUnits';
import { useUpsertInsumos } from '@/hooks/useUpsertInsumos';

import { noteEnumValues } from '@/lib/constants';
import type { Market } from '@/lib/types';
import { cn } from '@/lib/utils';

interface AvailabilitiesTableProps {
  unitId: Key | undefined;
  market: Market | null;
  date: CalendarDate | null;
  availabilities: AvailabilitiesQueryResponse | undefined;
  insumos: any;
  showFT1Columns: boolean;
  showFT2Columns: boolean;
  dateDiff: number;
  errors: any;
}

const AvailabilitiesTable: FC<AvailabilitiesTableProps> = ({
  unitId,
  market,
  date,
  availabilities,
  insumos,
  showFT1Columns,
  showFT2Columns,
  dateDiff,
  errors,
}) => {
  const {
    t,
    i18n: { language },
  } = useTranslation();

  const { data: units } = useUnits();

  // const [open, setOpen] = useState(false);
  // const [errors, setErrors] = useState<{
  //   [key: string]: (keyof InsumoInsert)[];
  // }>({});

  const [isFlashingErrors, setIsFlashingErrors] = useState(false);
  const [isFlashingSuccess, setIsFlashingSuccess] = useState(false);

  // const [showFT1Columns, setShowFT1Columns] = useLocalStorage(
  //   'show_ft_1',
  //   false,
  // );
  // const [showFT2Columns, setShowFT2Columns] = useLocalStorage(
  //   'show_ft_2',
  //   false,
  // );

  // const formRef = useRef<HTMLFormElement | null>(null);

  const unit = useMemo(
    () => units?.find((u) => u.id === unitId),
    [unitId, units],
  );

  // useEffect(() => {
  //   if (!unitId) {
  //     const lsUnitId = localStorage.getItem('unit_id');
  //     if (lsUnitId) {
  //       setUnitId(lsUnitId);
  //     }
  //   } else {
  //     localStorage.setItem('unit_id', unitId.toString());
  //   }
  // }, [unitId, setUnitId]);

  // useEffect(() => {
  //   if (!date) {
  //     const lsDate = localStorage.getItem('date');
  //     if (lsDate) {
  //       setDate(parseDate(lsDate));
  //     }
  //   } else {
  //     localStorage.setItem('date', date.toString());
  //   }
  // }, [date, setDate]);

  // useEffect(() => {
  //   if (!market) {
  //     const lsMarket = localStorage.getItem('market');
  //     if (lsMarket) {
  //       setMarket(lsMarket as Market);
  //     }
  //   } else {
  //     localStorage.setItem('market', market);
  //   }
  // }, [market, setMarket]);

  useEffect(() => {
    if (Object.keys(errors).length) {
      toast.error(t('Correctly fill in the red fields'));
      setIsFlashingErrors(true);
      setTimeout(() => {
        setIsFlashingErrors(false);
      }, 3000);
    }
  }, [errors, t]);

  // const { data: availabilities } = useAvailabilities({
  //   unitId: unitId?.toString(),
  //   date: date?.toString(),
  //   market,
  // });

  // const { data: insumos } = useInsumos({
  //   date: date?.toString(),
  //   unitId: unitId?.toString(),
  //   market,
  // });

  const { mutate, data, isSuccess, isPending } = useUpsertInsumos({
    unitId: unitId?.toString(),
    date: date?.toString(),
    market,
  });

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

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
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
  const [checkedStates, setCheckedStates] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
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

  // const dateDiff = useMemo(() => {
  //     if (!date) return 0;
  //     const _today = new Date();
  //     const today = new CalendarDate(
  //       _today.getFullYear(),
  //       _today.getMonth() + 1,
  //       _today.getDate(),
  //     );
  //     console.log(date.compare(today));
  //     return date.compare(today);
  //   }, [date]);

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
    if (unit?.fuelType2) {
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

  const minEditableHour = useMemo(() => {
    const now = new Date();
    const nowHour = now.getHours();

    return Math.max(nowHour - 1, 0);
  }, []);

  const isHourEditable = useCallback(
    (hour: number) => {
      if (dateDiff < 0) return false;
      if (dateDiff === 0 && hour < minEditableHour) return false;
      return true;
    },
    [dateDiff, minEditableHour],
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
      {date && availabilities && insumos ? (
        <TableBody
          className="text-xxs"
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
                            e as KeyboardEvent<HTMLInputElement>,
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
                        new Date(insumo.updated_at).toLocaleDateString('es-MX')}
                    </TableCell>
                    <TableCell className="border-r bg-muted/50">
                      {insumo && 'hi@cueva.io'}
                    </TableCell>
                  </TableRow>
                );
              })}
          <TableRow />
        </TableBody>
      ) : (
        // <AvailabilitiesTableBody
        //   key={`${market}-${unit?.id?.toString()}-${date?.toString()}`}
        //   rows={24}
        //   unit={unit}
        //   showFT1Columns={showFT1Columns}
        //   showFT2Columns={showFT2Columns}
        //   isSkeleton={true}
        // /><
        <></>
      )}
    </Table>
  );
};

export default AvailabilitiesTable;
