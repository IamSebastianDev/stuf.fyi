import * as v from 'valibot';

/** Request body for creating a list owned by the authenticated user. */
export const CreateListRequestSchema = v.object({
    /** Display name, trimmed before use. */
    name: v.pipe(v.string(), v.trim(), v.nonEmpty('Enter a list name.')),
    /** Optional display icon. When omitted, the server chooses the list's default icon. */
    icon: v.optional(v.pipe(v.string(), v.trim(), v.nonEmpty('Enter a list icon.'))),
    /** Enables the meal library and planner. Defaults to true. */
    mealsEnabled: v.optional(v.boolean(), true),
});
