import { z } from 'zod';

import { noteConstraintMap } from './constants';

export const noteEnumZod = z.enum(
  Object.keys(noteConstraintMap) as [string, ...string[]],
);

export const InsumoSchema = z.object({
  hour: z.coerce.number().min(1).max(25),
  min: z.number().min(0).max(1000),
  max: z.number().min(0).max(1000),
  share_ft1: z.number().min(0).max(100).nullish(),
  share_ft2: z.number().min(0).max(100).nullish(),
  note: noteEnumZod.nullish(),
  agc: z
    .enum(['on', 'off'])
    .nullish()
    .transform((x) => x === 'on'),
  price_ft1: z.number().min(0).max(1000),
  price_ft2: z.number().min(0).max(1000).nullish(),
});
