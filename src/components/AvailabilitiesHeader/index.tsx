import React from 'react';

import {
  useDate,
  useMarket,
  useShowFT1Columns,
  useShowFT2Columns,
  useUnit,
} from '@/contexts/AppContext';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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

import { useUnits } from '@/hooks/useUnits';

import { Market } from '@/lib/types';
import { cn } from '@/lib/utils';

import { Button } from '../ui/button';

export const AvailabilitiesHeader = () => {
  const { data: units } = useUnits();

  const { value: unit, setId: setUnitId } = useUnit();
  const { value: date, setValue: setDate } = useDate();
  const { value: market, setValue: setMarket } = useMarket();
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const { value: showFT1Columns, setValue: setShowFT1Columns } =
    useShowFT1Columns();
  const { value: showFT2Columns, setValue: setShowFT2Columns } =
    useShowFT2Columns();

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
                {unit?.name ? unit.name : t('Select a unit')}
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
                    {units?.map((u) => (
                      <CommandItem
                        key={u.id}
                        className="text-xxs"
                        value={u.name}
                        onSelect={(currentValue) => {
                          const unitId = units?.find(
                            (unit) => unit.name === currentValue,
                          )?.id;
                          setUnitId(unitId);
                          setOpen(false);
                        }}
                      >
                        {u.name}
                        <Check
                          className={cn(
                            'ml-auto',
                            u.id === unit?.id ? 'opacity-100' : 'opacity-0',
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
      {unit && (
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
              data-testid="fuel-type-1-checkbox"
            >
              {unit?.fuelType1?.name.toUpperCase()}
            </DropdownMenuCheckboxItem>
            {unit?.fuelType2 && (
              <DropdownMenuCheckboxItem
                className="text-xs"
                checked={showFT2Columns}
                onCheckedChange={setShowFT2Columns}
                data-testid="fuel-type-2-checkbox"
              >
                {unit.fuelType2.name.toUpperCase()}
              </DropdownMenuCheckboxItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default AvailabilitiesHeader;
