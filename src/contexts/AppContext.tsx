import React from 'react';

import { CalendarDate, parseDate } from '@internationalized/date';
import { type Key } from 'react-aria-components';
import { useLocalStorage } from 'usehooks-ts';

import { useUnits, type Unit } from '@/hooks/useUnits';

import type { InsumoInsert, Market } from '@/lib/types';

interface AppContextType {
  unit: {
    value: Unit | undefined;
    setId: (id: Key | undefined) => void;
  };
  date: {
    value: CalendarDate | null;
    setValue: (date: CalendarDate | null) => void;
    dateDiff: number;
  };
  market: {
    value: Market | null;
    setValue: (market: Market | null) => void;
  };
  showFT1Columns: {
    value: boolean;
    setValue: (show: boolean) => void;
  };
  showFT2Columns: {
    value: boolean;
    setValue: (show: boolean) => void;
  };
  upsertInsumos: {
    errors: {
      [key: string]: (keyof InsumoInsert)[];
    };
    setErrors: (errors: { [key: string]: (keyof InsumoInsert)[] }) => void;
    isFlashingSuccess: boolean;
    setIsFlashingSuccess: (isFlashingSuccess: boolean) => void;
    isFlashingErrors: boolean;
    setIsFlashingErrors: (isFlashingErrors: boolean) => void;
    data:
      | {
          inserted: number[];
          updated: { [hour: number]: (keyof InsumoInsert)[] };
        }
      | undefined;

    setData: (
      data:
        | {
            inserted: number[];
            updated: { [hour: number]: (keyof InsumoInsert)[] };
          }
        | undefined,
    ) => void;
  };
}

const AppContext = React.createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [unitId, setUnitId] = React.useState<Key>();
  const [date, setDate] = React.useState<CalendarDate | null>(null);
  const [market, setMarket] = React.useState<Market | null>(null);

  const [showFT1Columns, setShowFT1Columns] = useLocalStorage(
    'show_ft_1',
    false,
  );
  const [showFT2Columns, setShowFT2Columns] = useLocalStorage(
    'show_ft_2',
    false,
  );

  // Load initial values from localStorage
  React.useEffect(() => {
    const lsUnitId = localStorage.getItem('unit_id');
    if (lsUnitId) setUnitId(lsUnitId);

    const lsDate = localStorage.getItem('date');
    if (lsDate) setDate(parseDate(lsDate));

    const lsMarket = localStorage.getItem('market');
    if (lsMarket) setMarket(lsMarket as Market);
  }, []);

  // Persist unit_id changes to localStorage
  React.useEffect(() => {
    if (unitId) {
      localStorage.setItem('unit_id', unitId.toString());
    }
  }, [unitId]);

  // Persist date changes to localStorage
  React.useEffect(() => {
    if (date) {
      localStorage.setItem('date', date.toString());
    }
  }, [date]);

  // Persist market changes to localStorage
  React.useEffect(() => {
    if (market) {
      localStorage.setItem('market', market);
    }
  }, [market]);

  const { data: units } = useUnits();
  const unit = React.useMemo(
    () => units?.find((unit) => unit.id === unitId),
    [units, unitId],
  );

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

  const [errors, setErrors] = React.useState<{
    [key: string]: (keyof InsumoInsert)[];
  }>({});
  const [isFlashingSuccess, setIsFlashingSuccess] = React.useState(false);
  const [isFlashingErrors, setIsFlashingErrors] = React.useState(false);
  const [data, setData] = React.useState<
    | {
        inserted: number[];
        updated: { [hour: number]: (keyof InsumoInsert)[] };
      }
    | undefined
  >(undefined);

  const value = {
    unit: {
      value: unit,
      setId: setUnitId,
    },
    date: {
      value: date,
      setValue: setDate,
      dateDiff,
    },
    market: {
      value: market,
      setValue: setMarket,
    },
    showFT1Columns: {
      value: showFT1Columns,
      setValue: setShowFT1Columns,
    },
    showFT2Columns: {
      value: showFT2Columns,
      setValue: setShowFT2Columns,
    },
    upsertInsumos: {
      errors,
      setErrors,
      isFlashingSuccess,
      setIsFlashingSuccess,
      isFlashingErrors,
      setIsFlashingErrors,
      data,
      setData,
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Custom hooks to use the context
export function useUnit() {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error('useUnit must be used within an AppProvider');
  }
  return context.unit;
}

export function useDate() {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error('useDate must be used within an AppProvider');
  }
  return context.date;
}

export function useMarket() {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error('useMarket must be used within an AppProvider');
  }
  return context.market;
}

export function useShowFT1Columns() {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error('useShowFT1Columns must be used within an AppProvider');
  }
  return context.showFT1Columns;
}

export function useShowFT2Columns() {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error('useShowFT2Columns must be used within an AppProvider');
  }
  return context.showFT2Columns;
}

export function useUpsertInsumosState() {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error('useUpsertInsumosState must be used within an AppProvider');
  }
  return context.upsertInsumos;
}
