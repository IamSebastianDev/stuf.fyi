import * as v from 'valibot';

/** Normalizes account addresses before comparing or storing them. */
export const EmailSchema = v.pipe(v.string(), v.trim(), v.toLowerCase(), v.maxLength(254), v.email());
