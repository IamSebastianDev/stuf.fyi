import * as v from 'valibot';

/** Converts a backend Date value into the ISO timestamp used by transport DTOs. */
export const DateSchema = v.pipe(
    v.date(),
    v.transform((value) => value.toISOString()),
    v.isoTimestamp(),
);
