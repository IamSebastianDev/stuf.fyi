import type { Configuration } from '@rspack/core';

const bundledPrefixes = ['@stuf/', '@repository/', '#', '.', '/'];

export default {
    target: 'node26',

    externalsPresets: {
        node: true,
    },

    externals: [
        ({ request }, callback) => {
            if (!request || bundledPrefixes.some((prefix) => request.startsWith(prefix))) {
                callback();
                return;
            }

            callback(null, `module ${request}`);
        },
    ],
} satisfies Configuration;
