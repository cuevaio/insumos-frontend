import React from 'react';

import {
  useDate,
  useShowFT1Columns,
  useShowFT2Columns,
  useUnit,
} from '@/contexts/AppContext';

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
import { TableBody, TableCell, TableRow } from '@/components/ui/table';

import {
  AvailabilitiesQueryResponse,
  AvailabilityRecord,
} from '@/hooks/useAvailabilities';
import { ExtendedInsumo, Insumo } from '@/hooks/useInsumos';

import { noteConstraintMap } from '@/lib/constants';
import { cn } from '@/lib/utils';

export interface AvailabilitiesTableBodyProps {
  rowsLength: number;
  isContentLoading: boolean;
  hasRequiredFields: boolean;
  availabilities: AvailabilitiesQueryResponse | undefined;
  insumos: ExtendedInsumo | undefined;
}

const AvailabilitiesTableBody: React.FC<AvailabilitiesTableBodyProps> = ({
  rowsLength,
  isContentLoading,
  hasRequiredFields,
  availabilities,
  insumos,
}) => {
  const { value: unit } = useUnit();
  const { value: date, dateDiff } = useDate();
  const { value: showFT1Columns } = useShowFT1Columns();
  const { value: showFT2Columns } = useShowFT2Columns();

  const [checkedStates, setCheckedStates] = React.useState<{
    [key: string]: boolean;
  }>({});

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
    if (unit?.fuelTypeList[1]) {
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

  React.useEffect(() => {
    if (!availabilities?.availabilities || !insumos?.insumos) return;
    const checked: { [key: string]: boolean } = {};

    availabilities.availabilities.forEach((a) => {
      const insumo = insumos.insumos.find((i: Insumo) => i.hour === a.hour);
      if (!insumo) {
        checked[`${a.hour - 1}-fix-ft1fnc`] = false;
        checked[`${a.hour - 1}-ft1nc`] = false;
        checked[`${a.hour - 1}-ft1anc`] = false;
        checked[`${a.hour - 1}-ft1cil`] = false;
        checked[`${a.hour - 1}-ft1lie`] = false;

        if (unit?.fuelTypeList[1]) {
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

        if (unit?.fuelTypeList[1]) {
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

  const [dailyPriceFt1, setDailyPriceFt1] = React.useState(
    insumos?.insumos[0].price_ft1 ?? '',
  );
  React.useEffect(() => {
    setDailyPriceFt1(insumos?.insumos[0].price_ft1 ?? '');
  }, [insumos]);

  const [dailyPriceFt2, setDailyPriceFt2] = React.useState(
    insumos?.insumos[0].price_ft2 ?? '',
  );

  const handleChangePriceFt1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDailyPriceFt1(event.target.value);
  };

  const handleChangePriceFt2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDailyPriceFt2(event.target.value);
  };

  return (
    <TableBody
      className={cn([
        'text-xxs',
        hasRequiredFields && 'emptyTableBody',
        isContentLoading && 'isContentLoading',
      ])}
    >
      {new Array(rowsLength).fill(0).map((_, idx) => {
        const hour = idx + 1;
        const availability = availabilities?.availabilities?.find(
          (x) => x.hour === hour,
        );

        const insumo = insumos?.insumos.find((x: Insumo) => x.hour === hour);

        return (
          <TableRow
            key={idx}
            className={cn(
              idx % 2 !== 0 ? 'bg-muted/50' : '',
              'hover:bg-blue-300/50',
            )}
          >
            <TableCell className="border-l bg-muted/50 tabular-nums">
              {!hasRequiredFields || isContentLoading ? '' : hour}
            </TableCell>
            <TableCell className="bg-muted/50 tabular-nums">
              {!hasRequiredFields || isContentLoading
                ? ''
                : `${idx.toString().padStart(2, '0') + ':00'} -${' '}
                  ${hour.toString().padStart(2, '0') + ':00'}`}
            </TableCell>
            {showFT1Columns && (
              <>
                <TableCell className="bg-muted/50">
                  {!hasRequiredFields || isContentLoading
                    ? ''
                    : renderCapacityCell(
                        idx,
                        'fix-ft1fnc',
                        availability?.fixedAvailability
                          .fuelType1FixedNetCapacity,
                      )}
                </TableCell>
                <TableCell className="bg-muted/50">
                  {!hasRequiredFields || isContentLoading
                    ? ''
                    : renderCapacityCell(
                        idx,
                        'ft1nc',
                        availability?.fuelType1NetCapacity,
                      )}
                </TableCell>
                <TableCell className="bg-muted/50">
                  {!hasRequiredFields || isContentLoading
                    ? ''
                    : renderCapacityCell(
                        idx,
                        'ft1anc',
                        availability?.fuelType1AvailabilityNetCapacity,
                      )}
                </TableCell>
                <TableCell className="bg-muted/50">
                  {!hasRequiredFields || isContentLoading
                    ? ''
                    : renderCapacityCell(
                        idx,
                        'ft1cil',
                        availability?.fuelType1Cil,
                      )}
                </TableCell>
                <TableCell className="bg-muted/50">
                  {!hasRequiredFields || isContentLoading
                    ? ''
                    : renderCapacityCell(
                        idx,
                        'ft1lie',
                        availability?.fuelType1Lie,
                      )}
                </TableCell>
              </>
            )}
            {showFT2Columns && unit?.fuelTypeList[1] && (
              <>
                <TableCell className="bg-muted/50">
                  {!hasRequiredFields || isContentLoading
                    ? ''
                    : renderCapacityCell(
                        idx,
                        'ft2-fixed',
                        availability?.fixedAvailability
                          .fuelType2FixedNetCapacity,
                      )}
                </TableCell>
                <TableCell className="bg-muted/50">
                  {!hasRequiredFields || isContentLoading
                    ? ''
                    : renderCapacityCell(
                        idx,
                        'ft2-net',
                        availability?.fuelType2NetCapacity,
                      )}
                </TableCell>
                <TableCell className="bg-muted/50">
                  {!hasRequiredFields || isContentLoading
                    ? ''
                    : renderCapacityCell(
                        idx,
                        'ft2-availability',
                        availability?.fuelType2AvailabilityNetCapacity,
                      )}
                </TableCell>
                <TableCell className="bg-muted/50">
                  {!hasRequiredFields || isContentLoading
                    ? ''
                    : renderCapacityCell(
                        idx,
                        'ft2-cil',
                        availability?.fuelType2Cil,
                      )}
                </TableCell>
                <TableCell className="bg-muted/50">
                  {!hasRequiredFields || isContentLoading
                    ? ''
                    : renderCapacityCell(
                        idx,
                        'ft2-lie',
                        availability?.fuelType2Lie,
                      )}
                </TableCell>
              </>
            )}
            <TableCell className="bg-muted/50">
              {!hasRequiredFields || isContentLoading
                ? ''
                : calcPreselection(availability) || ''}
            </TableCell>
            <TableCell>
              <Input
                type="number"
                id={`input-${idx}-${0}`}
                step=".01"
                key={insumo?.max}
                defaultValue={insumo?.max}
                disabled={!isHourEditable(hour)}
                onKeyDown={(e) => handleKeyDown(e, idx, 0)}
                className={cn(
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
                key={insumo?.min}
                defaultValue={insumo?.min}
                disabled={!isHourEditable(hour)}
                onKeyDown={(e) => handleKeyDown(e, idx, 1)}
                className={cn(
                  !isHourEditable(hour) && 'cursor-not-allowed !bg-muted',
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
                key={insumo?.share_ft1}
                disabled={!isHourEditable(hour)}
                className={cn(
                  !isHourEditable(hour) && 'cursor-not-allowed !bg-muted',
                  'transition-colors duration-300',
                )}
                defaultValue={
                  typeof insumo?.share_ft1 === 'number'
                    ? insumo.share_ft1
                    : undefined
                }
                onKeyDown={(e) => handleKeyDown(e, idx, 2)}
                name={`${hour}-share_ft1`}
              />
            </TableCell>
            {unit?.fuelTypeList[1] && (
              <TableCell>
                <Input
                  type="number"
                  id={`input-${idx}-${3}`}
                  key={insumo?.share_ft2}
                  step=".01"
                  disabled={!isHourEditable(hour)}
                  className={cn(
                    !isHourEditable(hour) && 'cursor-not-allowed !bg-muted',
                    'transition-colors duration-300',
                  )}
                  defaultValue={
                    typeof insumo?.share_ft2 === 'number'
                      ? insumo.share_ft2
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
                key={insumo?.note}
                aria-labelledby="label"
                placeholder=""
                name={`${hour}-note`}
                defaultSelectedKey={insumo?.note ?? undefined}
                isDisabled={!isHourEditable(hour)}
              >
                <SelectTrigger
                  id={`input-${idx}-${4}`}
                  onKeyDown={(e) => handleKeyDown(e, idx, 4)}
                  className={cn(
                    'h-full rounded-none border-transparent px-2 py-0 transition-colors duration-300',
                    'transition-colors duration-300',
                  )}
                >
                  <SelectValue className="text-xs" />
                </SelectTrigger>
                <SelectPopover>
                  <SelectListBox>
                    {Object.entries(noteConstraintMap).map(([key, value]) => (
                      <SelectItem key={key} id={key}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectListBox>
                </SelectPopover>
              </Select>
            </TableCell>
            <TableCell
              className={cn(
                'flex justify-center',
                !isHourEditable(hour)
                  ? 'h-[18px] bg-muted py-0 opacity-50'
                  : 'translate-y-[4px]',
              )}
            >
              <div className="flex h-full items-center">
                <Checkbox
                  id={`input-${idx}-${0}`}
                  key={insumo ? String(insumo.agc) : ''}
                  defaultChecked={!!insumo?.agc}
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
              </div>
            </TableCell>
            <TableCell>
              <Input
                type="number"
                id={`input-${idx}-${6}`}
                step=".01"
                key={String(insumo?.price_ft1) + String(dailyPriceFt1)}
                value={dailyPriceFt1}
                disabled={!isHourEditable(hour)}
                onKeyDown={(e) => handleKeyDown(e, idx, 6)}
                onChange={handleChangePriceFt1}
                className={cn(
                  !isHourEditable(hour) && 'cursor-not-allowed !bg-muted',
                  'transition-colors duration-300',
                )}
                name={`${hour}-price_ft1`}
              />
            </TableCell>
            {unit?.fuelTypeList[1] && (
              <TableCell>
                <Input
                  type="number"
                  id={`input-${idx}-${7}`}
                  step=".01"
                  value={dailyPriceFt2}
                  disabled={!isHourEditable(hour)}
                  onKeyDown={(e) => handleKeyDown(e, idx, 7)}
                  onChange={handleChangePriceFt2}
                  className={cn(
                    !isHourEditable(hour) && 'cursor-not-allowed !bg-muted',
                    'transition-colors duration-300',
                    'control',
                  )}
                  name={`${hour}-price_ft2`}
                />
              </TableCell>
            )}
            <TableCell className="bg-muted/50">
              {!hasRequiredFields || isContentLoading
                ? ''
                : availability?.operationType}
            </TableCell>
            <TableCell className="bg-muted/50">
              {!hasRequiredFields || isContentLoading
                ? ''
                : availability?.comments}
              {insumo?.note}
            </TableCell>
            <TableCell className="bg-muted/50">
              {!hasRequiredFields || isContentLoading
                ? ''
                : insumo &&
                  new Date(insumo.updated_at).toLocaleDateString('es-MX')}
            </TableCell>
            <TableCell className="border-r bg-muted/50">
              {!hasRequiredFields || isContentLoading
                ? ''
                : insumo?.modified_by || ''}
            </TableCell>
          </TableRow>
        );
      })}
      <TableRow />
    </TableBody>
  );
};

export default AvailabilitiesTableBody;
