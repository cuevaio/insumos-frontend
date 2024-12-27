import React from 'react';

import { CalendarDate, parseDate } from '@internationalized/date';
import { type Key } from 'react-aria-components';

import { Label } from '@/components/ui/field';
import {
  Select,
  SelectItem,
  SelectListBox,
  SelectPopover,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Button } from './components/ui/button';
import { Checkbox } from './components/ui/checkbox';
import { DatePicker } from './components/ui/date-picker';
import { Input } from './components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './components/ui/table';
import { useAvailabilities } from './hooks/useAvailabilities';
import { useInsumos } from './hooks/useInsumos';
import { useUnits } from './hooks/useUnits';
import { useUpsertInsumos } from './hooks/useUpsertInsumos';
import { InsumoSchema } from './lib/schemas';
import type { InsumoInsert, Market } from './lib/types';
import { cn } from './lib/utils';

function App() {
  const { data: units } = useUnits();

  const [unitId, setUnitId] = React.useState<Key>();
  const [date, setDate] = React.useState<CalendarDate | null>(null);
  const [market, setMarket] = React.useState<Market | null>(null);

  const [errors, setErrors] = React.useState<{ [key: string]: string[] }>({});
  const [isFlashing, setIsFlashing] = React.useState(false);

  const formRef = React.useRef<HTMLFormElement | null>(null);

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
      setIsFlashing(true);
      setTimeout(() => {
        setIsFlashing(false);
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

  const { mutate } = useUpsertInsumos({
    unitId: unitId?.toString(),
    date: date?.toString(),
    market,
  });

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
          <Button variant="outline">Export</Button>
          <Button
            type="button"
            onClick={() => {
              formRef?.current?.requestSubmit();
            }}
          >
            Guardar cambios
          </Button>
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
          const _errors: { [key: string]: string[] } = {};

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
                _errors[hour] = p.error.issues.map((x) => x.path[0].toString());
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
            <TableRow className="text-xs">
              <TableHead colSpan={2} className="border-l border-t"></TableHead>
              <TableHead colSpan={5} className="border-x border-t">
                FT 1
              </TableHead>
              <TableHead colSpan={5} className="border-x border-t">
                FT 2
              </TableHead>
              <TableHead colSpan={13} className="border-r border-t"></TableHead>
            </TableRow>
            <TableRow className="text-[0.7rem] leading-[0.75rem]">
              <TableHead className="border-l">Hora</TableHead>
              <TableHead className="min-w-[100px]">Horario</TableHead>
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
          <TableBody className="text-xs">
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
                  console.log(insumo);
                  return (
                    <TableRow key={idx}>
                      <TableCell className="border-l bg-muted/50 tabular-nums">
                        {hour}
                      </TableCell>
                      <TableCell className="bg-muted/50 tabular-nums">
                        {idx.toString().padStart(2, '0') + ':00'} -{' '}
                        {hour.toString().padStart(2, '0') + ':00'}
                      </TableCell>
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
                      <TableCell className="bg-muted/50"></TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          defaultValue={insumo?.max}
                          className={cn(
                            isFlashing &&
                              errors[hour] &&
                              errors[hour].includes('max') &&
                              'border-red-500',
                            'transition-colors duration-300',
                          )}
                          name={`${hour}-max`}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          defaultValue={insumo?.min}
                          className={cn(
                            isFlashing &&
                              errors[hour] &&
                              errors[hour].includes('min') &&
                              'border-red-500',
                            'transition-colors duration-300',
                          )}
                          name={`${hour}-min`}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          className={cn(
                            isFlashing &&
                              errors[hour] &&
                              errors[hour].includes('share_ft1') &&
                              'border-red-500',
                            'transition-colors duration-300',
                          )}
                          defaultValue={
                            insumo?.share_ft1
                              ? insumo.share_ft1 * 100
                              : undefined
                          }
                          name={`${hour}-share_ft1`}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          className={cn(
                            isFlashing &&
                              errors[hour] &&
                              errors[hour].includes('share_ft2') &&
                              'border-red-500',
                            'transition-colors duration-300',
                          )}
                          defaultValue={
                            insumo?.share_ft2
                              ? insumo.share_ft2 * 100
                              : undefined
                          }
                          name={`${hour}-share_ft2`}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          defaultValue={insumo?.note}
                          className={cn(
                            isFlashing &&
                              errors[hour] &&
                              errors[hour].includes('note') &&
                              'border-red-500',
                            'transition-colors duration-300',
                          )}
                          name={`${hour}-note`}
                        />
                      </TableCell>
                      <TableCell className="flex justify-center">
                        <Checkbox
                          key={`${market}-${unitId?.toString()}-${date.toString()}-${hour}-agc`}
                          defaultChecked={insumo?.agc}
                          name={`${hour}-agc`}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          defaultValue={insumo?.price_ft1}
                          className={cn(
                            isFlashing &&
                              errors[hour] &&
                              errors[hour].includes('price_ft1') &&
                              'border-red-500',
                            'transition-colors duration-300',
                          )}
                          name={`${hour}-price_ft1`}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          defaultValue={insumo?.price_ft2}
                          className={cn(
                            isFlashing &&
                              errors[hour] &&
                              errors[hour].includes('price_ft2') &&
                              'border-red-500',
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
    </div>
  );
}

export default App;
