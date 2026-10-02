import type { Configuration } from '@rspack/core';

export default {
    externals: [
        ({ request }, callback) => {
            return callback(
                null,
                request &&
                    !['@stuf/', '@repository/', '#', '.', '/', 'node:'].some((prefix) => request.startsWith(prefix))
                    ? `module ${request}`
                    : undefined,
            );
        },
    ],
} satisfies Configuration;
