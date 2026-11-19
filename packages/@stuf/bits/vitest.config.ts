import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        projects: (['light', 'dark'] as const).map((theme) => ({
            plugins: [storybookTest({ initialGlobals: { theme } })],
            optimizeDeps: {
                include: ['storybook/actions', 'storybook/internal/core-events', 'storybook/theming'],
            },
            test: {
                name: `storybook-${theme}`,
                browser: {
                    enabled: true,
                    headless: true,
                    provider: playwright(),
                    instances: [{ browser: 'chromium' }],
                },
            },
        })),
    },
});
