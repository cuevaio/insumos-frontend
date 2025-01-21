import { CalendarIcon } from 'lucide-react';
import {
  DatePicker as AriaDatePicker,
  DatePickerProps as AriaDatePickerProps,
  DateRangePicker as AriaDateRangePicker,
  DateValue as AriaDateValue,
  Dialog as AriaDialog,
  DialogProps as AriaDialogProps,
  PopoverProps as AriaPopoverProps,
  ValidationResult as AriaValidationResult,
  composeRenderProps,
} from 'react-aria-components';

import { cn } from '@/lib/utils';

import {
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarHeading,
} from './calendar';
import { DateInput } from './datefield';
import { FieldGroup, Label } from './field';
import { Button } from './jolly-button';
import { Popover } from './jolly-popover';

const DateRangePicker = AriaDateRangePicker;

const DatePickerContent = ({
  className,
  popoverClassName,
  ...props
}: AriaDialogProps & { popoverClassName?: AriaPopoverProps['className'] }) => (
  <Popover
    className={composeRenderProps(popoverClassName, (className) =>
      cn('w-auto p-3', className),
    )}
  >
    <AriaDialog
      className={cn(
        'flex w-full flex-col space-y-4 outline-none sm:flex-row sm:space-x-4 sm:space-y-0',
        className,
      )}
      {...props}
    />
  </Popover>
);

interface DatePickerProps<T extends AriaDateValue>
  extends AriaDatePickerProps<T> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: AriaValidationResult) => string);
}

function DatePicker<T extends AriaDateValue>({
  label,
  ...props
}: DatePickerProps<T>) {
  return (
    <AriaDatePicker {...props}>
      <Label>{label}</Label>
      <FieldGroup>
        <DateInput className="flex-1" variant="ghost" />
        <Button
          variant="ghost"
          size="icon"
          className="mr-1 size-6 data-[focus-visible]:ring-offset-0"
        >
          <CalendarIcon aria-hidden className="size-4" />
        </Button>
      </FieldGroup>
      <DatePickerContent>
        <Calendar>
          <CalendarHeading />
          <CalendarGrid>
            <CalendarGridHeader>
              {(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
            </CalendarGridHeader>
            <CalendarGridBody>
              {(date) => <CalendarCell date={date} />}
            </CalendarGridBody>
          </CalendarGrid>
        </Calendar>
      </DatePickerContent>
    </AriaDatePicker>
  );
}

export { DatePickerContent, DateRangePicker, DatePicker };
export type { DatePickerProps };
