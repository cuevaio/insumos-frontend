import { markets, noteConstraintMap } from './constants';
import { InsumoSchema } from './schemas';

export interface CPPAPIResponse<T> {
  success: boolean;
  status: string;
  message: string;
  path: string;
  timestamp: string;
  data: T;
}

export type Market = (typeof markets)[number];
export type Note = keyof typeof noteConstraintMap;

export type InsumoInsert = typeof InsumoSchema._type;

export interface InsumoInsertErrors {
  [key: string]: (keyof InsumoInsert)[];
}

export interface ExtendedInsumoInsert {
  inserted: number[];
  updated: { [hour: number]: (keyof InsumoInsert)[] };
}
