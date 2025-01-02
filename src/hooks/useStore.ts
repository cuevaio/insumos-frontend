import { z } from 'zod';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// import { type Market } from 'lib';
const MARKETS = ['MDA', 'MTR'] as const;
const MarketEnum = z.enum(MARKETS);
type Market = z.infer<typeof MarketEnum>;

// import { IdSchema, JustDateSchema, type Id, type JustDate } from 'lib/schemas';
const JustDateSchema = z.string().date();
type JustDate = z.infer<typeof JustDateSchema>;

const IdSchema = z.string().uuid();
type Id = z.infer<typeof IdSchema>;

type Store = {
  // Availability
  availabilityDate: JustDate | undefined;
  availabilityUnitId: Id | undefined;
  availabilityMarket: Market | undefined;
  availabilityEditable: boolean;

  // Historical
  historicalDateStart: JustDate | undefined;
  historicalDateEnd: JustDate | undefined;
  historicalUnitId: Id | undefined;
  historicalMarket: Market | undefined;
  historicalCurrentDate: JustDate | undefined;

  // Configuration
  configurationUnitId: Id | undefined;

  // Setters
  setAvailabilityDate: (date: JustDate | undefined) => void;
  setAvailabilityUnitId: (unitId: Id) => void;
  setAvailabilityMarket: (market: Market | undefined) => void;
  setAvailabilityEditable: (editable: boolean) => void;

  setHistoricalDateStart: (date: JustDate | undefined) => void;
  setHistoricalDateEnd: (date: JustDate | undefined) => void;
  setHistoricalUnitId: (unitId: Id | undefined) => void;
  setHistoricalMarket: (market: Market | undefined) => void;
  setHistoricalCurrentDate: (date: JustDate | undefined) => void;
  setConfigurationUnitId: (unitId: Id | undefined) => void;
};

const dateToISOFormat = (date: Date) => {
  return date
    .toLocaleDateString('es', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .split('/')
    .reverse()
    .join('-');
};

export const useStore = create<Store>()(
  persist(
    (set) => ({
      // Initial values
      availabilityDate: dateToISOFormat(new Date()),
      availabilityUnitId: undefined,
      availabilityMarket: 'MDA',
      availabilityEditable: true,

      historicalDateStart: dateToISOFormat(
        new Date(new Date().getTime() - 8 * 24 * 60 * 60 * 1000),
      ),
      historicalDateEnd: dateToISOFormat(new Date()),
      historicalUnitId: undefined,
      historicalMarket: 'MDA',
      historicalCurrentDate: undefined,

      configurationUnitId: undefined,

      // Setters
      setAvailabilityDate: (date: JustDate | undefined) =>
        set({
          availabilityDate: JustDateSchema.safeParse(date).success
            ? date
            : undefined,
        }),
      setAvailabilityUnitId: (unitId: Id) =>
        set({
          availabilityUnitId: IdSchema.safeParse(unitId).success
            ? unitId
            : undefined,
        }),
      setAvailabilityMarket: (market: Market | undefined) =>
        set({ availabilityMarket: market }),
      setAvailabilityEditable: (editable: boolean) =>
        set({ availabilityEditable: editable }),
      setHistoricalDateStart: (date: JustDate | undefined) =>
        set({
          historicalDateStart: JustDateSchema.safeParse(date).success
            ? date
            : undefined,
        }),

      setHistoricalDateEnd: (date: JustDate | undefined) =>
        set({
          historicalDateEnd: JustDateSchema.safeParse(date).success
            ? date
            : undefined,
        }),
      setHistoricalUnitId: (unitId: Id | undefined) =>
        set({
          historicalUnitId: IdSchema.safeParse(unitId).success
            ? unitId
            : undefined,
        }),
      setHistoricalMarket: (market: Market | undefined) =>
        set({ historicalMarket: market }),
      setConfigurationUnitId: (unitId: Id | undefined) =>
        set({
          configurationUnitId: IdSchema.safeParse(unitId).success
            ? unitId
            : undefined,
        }),
      setHistoricalCurrentDate: (date: JustDate | undefined) =>
        set({
          historicalCurrentDate: JustDateSchema.safeParse(date).success
            ? date
            : undefined,
        }),
    }),
    {
      name: 'market-store',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) =>
          localStorage.setItem(name, JSON.stringify(value)),
        removeItem: (name) => localStorage.removeItem(name),
      },
    },
  ),
);
