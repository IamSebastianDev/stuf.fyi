import * as v from 'valibot';

export const dateSchema = v.pipe(
    v.date(),
    v.transform((date) => date.toISOString()),
);
