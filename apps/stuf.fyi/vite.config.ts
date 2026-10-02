import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '../..', '');

    return {
        envDir: '../..',
        server: {
            strictPort: true,
            host: env.LND_HOST ?? 'localhost',
            port: Number(env.LND_PORT ?? 5174),
        },
    };
});
