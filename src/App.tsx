import React from 'react';

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
import { DatePicker } from './components/ui/date-picker';
import { useAuth } from './hooks/useAuth';
import { useUnits } from './hooks/useUnits';
import { useAvailabilities } from './hooks/useAvailabilities';
import { CalendarDate } from '@internationalized/date';
import { Table, TableHead, TableHeader, TableRow } from './components/ui/table';

function App() {
  const token = useAuth();
  const { data: units } = useUnits();
  const [unitId, setUnitId] = React.useState<Key>();
  const [date, setDate] = React.useState<CalendarDate | null>(null)

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

  const {data: availabilities} = useAvailabilities({unitId: unitId?.toString(), date, market: "MDA"})

  return (
    <div className="container mx-auto">
      <div className="flex items-end justify-between">
        <div className="flex gap-4">
          <DatePicker label="Date" value={date} onChange={(value)=>setDate(value)} />
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
        </div>
        <div className="flex gap-4">
          <div>{token ? 'Authenticated' : 'Not authenticated'}</div>
          <Button variant="outline">Export</Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Hora</TableHead>
            <TableHead>Horario</TableHead>
            <TableHead>Capacidad declarada de la central o paquete de Gas</TableHead>
          </TableRow>
          <TableRow>
            <TableHead>Capacidad neta corregida a condiciones de verano contractual (MW)</TableHead>
            <TableHead>Capacidad neta expresa a condiciones ambientales reales MW</TableHead>
            <TableHead>Capacidad neta expresa a condiciones ambientales reales considerando cantidad de Gas disponible MW</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    </div>
  );
}

export default App;
