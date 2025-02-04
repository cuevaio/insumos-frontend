import { TableBody, TableCell, TableRow } from '@/components/ui/table';

import { cn } from '@/lib/utils';

const AvailabilitiesTableBody = ({
  key,
  rows,
  unit,
  // availabilities,
  // insumos,
  showFT1Columns,
  showFT2Columns,
  isSkeleton,
}) => {
  return (
    <TableBody
      className={cn('text-xxs', isSkeleton && 'emptyTableBody')}
      key={key}
    >
      {new Array(rows).fill(0).map((_, idx) => {
        return (
          <TableRow
            key={idx}
            className={cn(
              idx % 2 !== 0 ? 'bg-muted/50' : '',
              'hover:bg-blue-300/50',
            )}
          >
            <TableCell className="border-l bg-muted/50 tabular-nums">
              {/* {hour} */}
            </TableCell>
            <TableCell className="bg-muted/50 tabular-nums">
              {/* {idx.toString().padStart(2, '0') + ':00'} -{' '}
                  {hour.toString().padStart(2, '0') + ':00'} */}
            </TableCell>
            {showFT1Columns && (
              <>
                <TableCell className="bg-muted/50">
                  {/* {renderCapacityCell(
                        idx,
                        'fix-ft1fnc',
                        availability?.fixedAvailability
                          .fuelType1FixedNetCapacity,
                      )} */}
                </TableCell>
                <TableCell className="bg-muted/50">
                  {/* {renderCapacityCell(
                        idx,
                        'ft1nc',
                        availability?.fuelType1NetCapacity,
                      )} */}
                </TableCell>
                <TableCell className="bg-muted/50">
                  {/* {renderCapacityCell(
                        idx,
                        'ft1anc',
                        availability?.fuelType1AvailabilityNetCapacity,
                      )} */}
                </TableCell>
                <TableCell className="bg-muted/50">
                  {/* {renderCapacityCell(
                        idx,
                        'ft1cil',
                        availability?.fuelType1Cil,
                      )} */}
                </TableCell>
                <TableCell className="bg-muted/50">
                  {/* {renderCapacityCell(
                        idx,
                        'ft1lie',
                        availability?.fuelType1Lie,
                      )} */}
                </TableCell>
              </>
            )}
            {showFT2Columns && unit?.fuelType2 && (
              <>
                <TableCell className="bg-muted/50">
                  {/* {renderCapacityCell(
                        idx,
                        'ft2-fixed',
                        availability?.fixedAvailability
                          .fuelType2FixedNetCapacity,
                      )} */}
                </TableCell>
                <TableCell className="bg-muted/50">
                  {/* {renderCapacityCell(
                        idx,
                        'ft2-net',
                        availability?.fuelType2NetCapacity,
                      )} */}
                </TableCell>
                <TableCell className="bg-muted/50">
                  {/* {renderCapacityCell(
                        idx,
                        'ft2-availability',
                        availability?.fuelType2AvailabilityNetCapacity,
                      )} */}
                </TableCell>
                <TableCell className="bg-muted/50">
                  {/* {renderCapacityCell(
                        idx,
                        'ft2-cil',
                        availability?.fuelType2Cil,
                      )} */}
                </TableCell>
                <TableCell className="bg-muted/50">
                  {/* {renderCapacityCell(
                        idx,
                        'ft2-lie',
                        availability?.fuelType2Lie,
                      )} */}
                </TableCell>
              </>
            )}
            <TableCell className="bg-muted/50">
              {/* {calcPreselection(availability) || ''} */}
            </TableCell>
            <TableCell>
              {/* <Input
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
                  /> */}
            </TableCell>
            <TableCell>
              {/* <Input
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
                  /> */}
            </TableCell>
            <TableCell>
              {/* <Input
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
                  /> */}
            </TableCell>
            {unit?.fuelType2 && (
              <TableCell>
                {/* <Input
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
                    /> */}
              </TableCell>
            )}
            <TableCell>
              {/* <label className="hidden">Select note</label>
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
                  </Select> */}
            </TableCell>
            <TableCell className="flex justify-center">
              {/* <Checkbox
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
                  /> */}
            </TableCell>
            <TableCell>
              {/* <Input
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
                  /> */}
            </TableCell>
            {unit?.fuelType2 && (
              <TableCell>
                {/* <Input
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
                    /> */}
              </TableCell>
            )}
            <TableCell className="bg-muted/50">
              {/* {availability?.operationType} */}
            </TableCell>
            <TableCell className="bg-muted/50">
              {/* {availability?.comments} */}
            </TableCell>
            <TableCell className="bg-muted/50">
              {/* {insumo &&
                    new Date(insumo.updated_at).toLocaleDateString(
                      'es-MX',
                    )} */}
            </TableCell>
            <TableCell className="border-r bg-muted/50">
              {/* {insumo && 'hi@cueva.io'} */}
            </TableCell>
          </TableRow>
        );
      })}
      <TableRow />
    </TableBody>
  );
};

export default AvailabilitiesTableBody;
