import * as v from 'valibot';

/** Shared identifier format used by transport models. */
export const IdSchema = v.pipe(v.string(), v.uuid());
