export const markets = ['MDA', 'MTR'] as const;
export const noteEnumValues = [
  'c_amb',
  'ca_aje',
  'r_com',
  'decrem',
  'sa_fda',
  'sa_prg',
  'prueba',
] as const;

export const DEV:boolean = true;

export const prices: {
  [key: string]: {
    avg: number;
    tm: number;
    op: number;
  };
} = {
  '01930e48-70fe-0e9a-1c18-bff758c72abe': {
    avg: 435.765,
    tm: 76.98,
    op: 56.34,
  },
  '01932144-054b-e7c5-3fa2-2722eb981ebb': {
    avg: 333.295,
    tm: 43.98,
    op: 98.14,
  },
  '019330b2-1c5c-26ab-a9b7-fa209ed976b3': {
    avg: 485.45,
    tm: 36.98,
    op: 96.64,
  },
  '019387e0-f6e2-132d-d4ad-5b9253b7d480': {
    avg: 835.765,
    tm: 56.08,
    op: 86.94,
  },
};
