import { DateSchema } from '#/shared/date.schema';
import { IdSchema } from '#/shared/id.schema';
import * as v from 'valibot';

/** Public representation of a shared shopping and meal-planning list. */
export const ListResponseSchema = v.object({
    /** Public identifier of the list. */
    id: IdSchema,
    /** Display name of the list. */
    name: v.string(),
    /** Display icon, currently an emoji. */
    icon: v.string(),
    /** Whether the list includes a meal library and dinner planner. */
    mealsEnabled: v.boolean(),
    /** Public identifier of the user who owns the list. */
    ownerId: IdSchema,
    /** Time at which the list was created. */
    createdAt: DateSchema,
    /** Time at which the list record was last changed. */
    updatedAt: DateSchema,
});
