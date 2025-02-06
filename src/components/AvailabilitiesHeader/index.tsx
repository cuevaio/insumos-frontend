import { Dispatch, FC, SetStateAction, useState } from 'react';

import { CalendarDate } from '@internationalized/date';
import { Check, ChevronsUpDown } from 'lucide-react';
import { type Key } from 'react-aria-components';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectItem,
  SelectListBox,
  SelectPopover,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { UnitWithFuelType } from '@/hooks/useUnits';

import { type Market } from '@/lib/types';
import { cn } from '@/lib/utils';

interface AvailabilitiesHeaderProps {
  showColumns: boolean;
  units: UnitWithFuelType[] | undefined;
  unit: UnitWithFuelType | undefined;
  unitId: Key | undefined;
  date: CalendarDate | null;
  setDate: Dispatch<SetStateAction<CalendarDate | null>>;
  setUnitId: Dispatch<SetStateAction<Key | undefined>>;
  market: Market | null;
  setMarket: Dispatch<SetStateAction<Market | null>>;
  showFT1Columns: boolean;
  setShowFT1Columns: Dispatch<SetStateAction<boolean>>;
  showFT2Columns: boolean;
  setShowFT2Columns: Dispatch<SetStateAction<boolean>>;
}

const AvailabilitiesHeader: FC<AvailabilitiesHeaderProps> = ({
  showColumns,
  units,
  unit,
  unitId,
  setUnitId,
  date,
  setDate,
  market,
  setMarket,
  showFT1Columns,
  setShowFT1Columns,
  showFT2Columns,
  setShowFT2Columns,
}) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  return (
    <div className="flex w-full items-end justify-between">
      <div className="flex gap-2">
        <DatePicker
          label={t('Date')}
          value={date}
          onChange={(value) => setDate(value)}
        />
        <div className="flex flex-col justify-end gap-1">
          <Label>{t('Unit')}</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="h-6 w-[200px] justify-between px-2 py-0 text-xxs"
              >
                {unitId
                  ? units?.find((unit) => unit.id === unitId)?.name
                  : t('Select a unit')}
                <ChevronsUpDown className="size-3 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput
                  placeholder={t('Select a unit')}
                  className="h-9 text-xxs"
                />
                <CommandList>
                  <CommandEmpty>No unit found.</CommandEmpty>
                  <CommandGroup>
                    {units?.map((unit) => (
                      <CommandItem
                        key={unit.id}
                        className="text-xxs"
                        value={unit.name}
                        onSelect={(currentValue) => {
                          const unitId = units?.find(
                            (unit) => unit.name === currentValue,
                          )?.id;
                          setUnitId(unitId);
                          setOpen(false);
                        }}
                      >
                        {unit.name}
                        <Check
                          className={cn(
                            'ml-auto',
                            unitId === unit.id ? 'opacity-100' : 'opacity-0',
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <Select
          className="w-[200px]"
          placeholder={t('Select a market')}
          selectedKey={market}
          onSelectionChange={(selected) =>
            setMarket(selected.toString() as Market)
          }
        >
          <Label>{t('Market')}</Label>
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
        {showColumns && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="h-6 text-xs" variant="outline">
                {t('Columns')}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel className="text-xs">
                {t('Columns')}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                className="text-xs"
                checked={showFT1Columns}
                onCheckedChange={setShowFT1Columns}
              >
                {unit?.fuelType1?.name.toUpperCase()}
              </DropdownMenuCheckboxItem>
              {unit?.fuelType2 && (
                <DropdownMenuCheckboxItem
                  className="text-xs"
                  checked={showFT2Columns}
                  onCheckedChange={setShowFT2Columns}
                >
                  {unit.fuelType2.name.toUpperCase()}
                </DropdownMenuCheckboxItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default AvailabilitiesHeader;
