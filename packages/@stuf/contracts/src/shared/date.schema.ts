import * as v from 'valibot';

/** Accepts backend Dates or wire-format timestamps and outputs an ISO timestamp. */
export const DateSchema = v.pipe(
    v.union([v.date(), v.pipe(v.string(), v.isoTimestamp())]),
    v.transform((value) => (value instanceof Date ? value.toISOString() : value)),
    v.isoTimestamp(),
);
