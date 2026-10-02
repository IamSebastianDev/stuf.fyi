import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '../..', '');

    const apiHost = env.API_HOST ?? 'localhost';
    const apiPort = env.API_PORT ?? '5172';

    return {
        envDir: '../..',

        server: {
            host: env.APP_HOST ?? 'localhost',
            port: Number(env.APP_PORT ?? 5173),
            strictPort: true,

            proxy: {
                '/api': {
                    target: `http://${apiHost}:${apiPort}`,
                    changeOrigin: true,
                },
            },
        },
    };
});
