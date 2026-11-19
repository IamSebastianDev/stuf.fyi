import { defineConfig, loadEnv } from 'vite';
import { qrcode } from 'vite-plugin-qrcode';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '../..', '');

    const apiHost = env.API_HOST ?? 'localhost';
    const apiPort = env.API_PORT ?? '5172';

    return {
        envDir: '../..',
        plugins: [qrcode()],

        preview: {
            host: env.APP_HOST ?? 'localhost',
        },

        server: {
            host: '0.0.0.0',
            port: Number(env.APP_PORT ?? 5173),
            strictPort: true,

            proxy: {
                '/api': {
                    target: `http://${apiHost}:${apiPort}`,
                    changeOrigin: true,
                },

                '/socket': {
                    target: `http://${apiHost}:${apiPort}`,
                    changeOrigin: true,
                    ws: true,
                },
            },
        },
    };
});
