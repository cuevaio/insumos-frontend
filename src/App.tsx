import React from 'react';

import { CalendarDate, parseDate } from '@internationalized/date';
import { type Key } from 'react-aria-components';
import { toast } from 'sonner';
import { useLocalStorage } from 'usehooks-ts';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/field';
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

import { useAvailabilities } from '@/hooks/useAvailabilities';
import { useInsumos } from '@/hooks/useInsumos';
import { useUnits } from '@/hooks/useUnits';
import { useUpsertInsumos } from '@/hooks/useUpsertInsumos';

import { noteEnumValues } from '@/lib/constants';
import { InsumoSchema } from '@/lib/schemas';
import type { InsumoInsert, Market } from '@/lib/types';
import { cn } from '@/lib/utils';

function App() {
  const { data: units } = useUnits();

  const [unitId, setUnitId] = React.useState<Key>();
  const [date, setDate] = React.useState<CalendarDate | null>(null);
  const [market, setMarket] = React.useState<Market | null>(null);

  const [errors, setErrors] = React.useState<{
    [key: string]: (keyof InsumoInsert)[];
  }>({});
  const [isFlashingErrors, setIsFlashingErrors] = React.useState(false);
  const [isFlashingSuccess, setIsFlashingSuccess] = React.useState(false);

  const [showFT1Columns, setShowFT1Columns] = useLocalStorage(
    'show_ft_1',
    false,
  );
  const [showFT2Columns, setShowFT2Columns] = useLocalStorage(
    'show_ft_2',
    false,
  );

  const formRef = React.useRef<HTMLFormElement | null>(null);

  const unit = React.useMemo(
    () => units?.find((u) => u.id === unitId),
    [unitId, units],
  );

  React.useEffect(() => {
    if (!unitId) {
      const lsUnitId = localStorage.getItem('unit_id');
      if (lsUnitId) {
        setUnitId(lsUnitId);
      }
    } else {
      localStorage.setItem('unit_id', unitId.toString());
    }
  }, [unitId, setUnitId]);

  React.useEffect(() => {
    if (!date) {
      const lsDate = localStorage.getItem('date');
      if (lsDate) {
        setDate(parseDate(lsDate));
      }
    } else {
      localStorage.setItem('date', date.toString());
    }
  }, [date, setDate]);

  React.useEffect(() => {
    if (!market) {
      const lsMarket = localStorage.getItem('market');
      if (lsMarket) {
        setMarket(lsMarket as Market);
      }
    } else {
      localStorage.setItem('market', market);
    }
  }, [market, setMarket]);

  React.useEffect(() => {
    if (Object.keys(errors).length) {
      toast.error('Completa correctamente los campos en rojo');
      setIsFlashingErrors(true);
      setTimeout(() => {
        setIsFlashingErrors(false);
      }, 3000);
    }
  }, [errors]);

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

  const { mutate, data, isSuccess, isPending } = useUpsertInsumos({
    unitId: unitId?.toString(),
    date: date?.toString(),
    market,
  });

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
          toast('Sin cambios por guardar');
        } else {
          if (data.inserted.length > 0) {
            toast.success(`Se crearon ${data.inserted.length} ofertas`);
          }

          if (Object.keys(data.updated).length) {
            toast.success(
              `Se actualizaron ${Object.keys(data.updated).length} ofertas`,
            );
          }
        }
      }
    }
  }, [data, isSuccess, isPending]);

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

  return (
    <div className="container mx-auto">
      <div className="flex items-end justify-between">
        <div className="flex gap-4">
          <DatePicker
            label="Date"
            value={date}
            onChange={(value) => setDate(value)}
          />
          <Select
            className="w-[200px]"
            placeholder="Select a unit"
            selectedKey={unitId}
            onSelectionChange={(selected) => setUnitId(selected)}
          >
            <Label>Unit</Label>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectPopover>
              <SelectListBox>
                {units?.map((unit) => (
                  <SelectItem key={unit.id} id={unit.id}>
                    {unit.name}
                  </SelectItem>
                ))}
              </SelectListBox>
            </SelectPopover>
          </Select>
          <Select
            className="w-[200px]"
            placeholder="Select a market"
            selectedKey={market}
            onSelectionChange={(selected) =>
              setMarket(selected.toString() as Market)
            }
          >
            <Label>Market</Label>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectPopover>
              <SelectListBox>
                <SelectItem id="MDA">MDA</SelectItem>
                <SelectItem id="MTR">MTR</SelectItem>
              </SelectListBox>
            </SelectPopover>
          </Select>
        </div>
        <div className="flex gap-4">
          <Button variant="outline">Exportar</Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Columnas</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Columnas</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={showFT1Columns}
                onCheckedChange={setShowFT1Columns}
              >
                {unit?.fuelType1?.name.toUpperCase()}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={showFT2Columns}
                onCheckedChange={setShowFT2Columns}
              >
                {unit?.fuelType2?.name.toUpperCase()}
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <form
        ref={formRef}
        onSubmit={(event) => {
          event.preventDefault();
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
              const p = InsumoSchema.safeParse({
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

          console.log(_errors, insumosToSubmit);
          if (Object.keys(_errors).length) {
            setErrors(_errors);
          } else {
            mutate(insumosToSubmit);
          }
        }}
      >
        <Table className="my-8">
          <TableHeader>
            {(showFT1Columns || showFT2Columns) && (
              <>
                <TableRow className="text-xs">
                  <TableHead
                    colSpan={2}
                    className="border-l border-t"
                  ></TableHead>
                  {showFT1Columns && (
                    <TableHead colSpan={5} className="border-x border-t">
                      {unit?.fuelType1?.name.toUpperCase()}
                    </TableHead>
                  )}
                  {showFT2Columns && (
                    <TableHead colSpan={5} className="border-x border-t">
                      {unit?.fuelType2?.name.toUpperCase()}
                    </TableHead>
                  )}
                  <TableHead
                    colSpan={13}
                    className="border-r border-t"
                  ></TableHead>
                </TableRow>
              </>
            )}
            <TableRow className="border-t text-[0.7rem] leading-[0.75rem]">
              <TableHead className="border-l">Hora</TableHead>
              <TableHead className="min-w-[100px]">Horario</TableHead>
              {showFT1Columns && (
                <>
                  <TableHead className="min-w-[120px] border-l">
                    Capacidad Neta Corregida a Condiciones de Diseño de Verano
                    (Contractual) MW
                  </TableHead>
                  <TableHead className="min-w-[120px] border-l">
                    Capacidad Neta Expresada a Condiciones Ambientales Reales MW
                  </TableHead>
                  <TableHead className="min-w-[120px] border-l">
                    Capacidad Neta Expresada a Condiciones Ambientales Reales
                    Considerando Cantidad de Gas Disponible
                  </TableHead>
                  <TableHead className="min-w-[120px] border-l">
                    Capacidad Neta del Contrato de Interconexión Legado (CIL) MW
                  </TableHead>
                  <TableHead className="min-w-[120px] border-l">
                    Capacidad Neta con Contrato Tipo LIE MW
                  </TableHead>
                </>
              )}
              {showFT2Columns && (
                <>
                  <TableHead className="min-w-[120px] border-l">
                    Capacidad Neta Corregida a Condiciones de Diseño de Verano
                    (Contractual) MW
                  </TableHead>
                  <TableHead className="min-w-[120px] border-l">
                    Capacidad Neta Expresada a Condiciones Ambientales Reales MW
                  </TableHead>
                  <TableHead className="min-w-[120px] border-l">
                    Capacidad Neta Expresada a Condiciones Ambientales Reales
                    Considerando Cantidad de Diesel Disponible MW
                  </TableHead>
                  <TableHead className="min-w-[120px] border-l">
                    Capacidad Neta del Contrato de Interconexión Legado (CIL) MW
                  </TableHead>
                  <TableHead className="min-w-[120px] border-l">
                    Capacidad Neta con Contrato Tipo LIE MW
                  </TableHead>
                </>
              )}
              <TableHead className="border-l">Pre-Selección</TableHead>
              <TableHead>Disponibilidad para Oferta (Max)</TableHead>
              <TableHead>Disponibilidad para Oferta (Min)</TableHead>
              <TableHead className="min-w-[70px]">% Gas</TableHead>
              <TableHead className="min-w-[70px]">% Diesel</TableHead>
              <TableHead className="min-w-[120px]">Nota</TableHead>
              <TableHead>AGC</TableHead>
              <TableHead className="min-w-[100px]">Precio de Gas</TableHead>
              <TableHead className="min-w-[100px]">Precio de Diesel</TableHead>
              <TableHead className="min-w-[150px]">
                Tipo de Operación (Disponible a Despacho / Operación Obligada)
              </TableHead>
              <TableHead className="min-w-[250px]">
                Comentarios (Precisiones, No. de Licencias, condiciones de AGC,
                Etc.)
              </TableHead>
              <TableHead>Fecha última actualización</TableHead>
              <TableHead className="border-r">Usuario</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody
            className="text-xs"
            key={`${market}-${unitId?.toString()}-${date?.toString()}`}
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
                    <TableRow key={idx}>
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
                            {
                              availability?.fixedAvailability
                                .fuelType1FixedNetCapacity
                            }
                          </TableCell>
                          <TableCell className="bg-muted/50">
                            {availability?.fuelType1NetCapacity}
                          </TableCell>
                          <TableCell className="bg-muted/50">
                            {availability?.fuelType1AvailabilityNetCapacity}
                          </TableCell>
                          <TableCell className="bg-muted/50">
                            {availability?.fuelType1Cil}
                          </TableCell>
                          <TableCell className="bg-muted/50">
                            {availability?.fuelType1Lie}
                          </TableCell>
                        </>
                      )}
                      {showFT2Columns && (
                        <>
                          <TableCell className="bg-muted/50">
                            {
                              availability?.fixedAvailability
                                .fuelType2FixedNetCapacity
                            }
                          </TableCell>
                          <TableCell className="bg-muted/50">
                            {availability?.fuelType2NetCapacity}
                          </TableCell>
                          <TableCell className="bg-muted/50">
                            {availability?.fuelType2AvailabilityNetCapacity}
                          </TableCell>
                          <TableCell className="bg-muted/50">
                            {availability?.fuelType2Cil}
                          </TableCell>
                          <TableCell className="bg-muted/50">
                            {availability?.fuelType2Lie}
                          </TableCell>
                        </>
                      )}
                      <TableCell className="bg-muted/50"></TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          id={`input-${idx}-${0}`}
                          step=".01"
                          defaultValue={insumo?.max}
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
                            'transition-colors duration-300',
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
                            'transition-colors duration-300',
                            'transition-colors duration-300',
                          )}
                          defaultValue={
                            insumo?.share_ft1
                              ? insumo.share_ft1 * 100
                              : undefined
                          }
                          onKeyDown={(e) => handleKeyDown(e, idx, 2)}
                          name={`${hour}-share_ft1`}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          id={`input-${idx}-${3}`}
                          step=".01"
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
                            'transition-colors duration-300',
                            'transition-colors duration-300',
                          )}
                          defaultValue={
                            insumo?.share_ft2
                              ? insumo.share_ft2 * 100
                              : undefined
                          }
                          onKeyDown={(e) => handleKeyDown(e, idx, 3)}
                          name={`${hour}-share_ft2`}
                        />
                      </TableCell>
                      <TableCell>
                        <label className="hidden">Select note</label>
                        <Select
                          aria-labelledby="label"
                          placeholder=""
                          name={`${hour}-note`}
                          defaultSelectedKey={insumo?.note}
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
                            'transition-colors duration-300',
                            'transition-colors duration-300',
                          )}
                          name={`${hour}-price_ft1`}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          id={`input-${idx}-${7}`}
                          step=".01"
                          defaultValue={insumo?.price_ft2}
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
                            'transition-colors duration-300',
                            'transition-colors duration-300',
                          )}
                          name={`${hour}-price_ft2`}
                        />
                      </TableCell>
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
      </form>
      <Button
        type="button"
        onClick={() => {
          formRef?.current?.requestSubmit();
        }}
      >
        Guardar cambios
      </Button>
    </div>
  );
}

export default App;
