import * as v from 'valibot';

/** Avatar palette values accepted by the user profile contract. */
export const ProfileColorSchema = v.picklist(['MINT', 'BLUE', 'AMBER', 'CORAL', 'VIOLET']);

/** Named avatar color used by clients to select a theme token. */
export type ProfileColor = v.InferOutput<typeof ProfileColorSchema>;
