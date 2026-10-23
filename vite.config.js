import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(async () => ({
    plugins: [react()],

    server: {
        host: '0.0.0.0',
        port: 3000,
        strictPort: true,
        allowedHosts: true,
    },
    resolve: {
        alias: {
            '@tauri-apps/api/window': resolve(__dirname, 'src/mocks/tauri-api.js'),
            '@tauri-apps/api/tauri': resolve(__dirname, 'src/mocks/tauri-api.js'),
            '@tauri-apps/api/path': resolve(__dirname, 'src/mocks/tauri-api.js'),
            '@tauri-apps/api/fs': resolve(__dirname, 'src/mocks/tauri-api.js'),
            '@tauri-apps/api/event': resolve(__dirname, 'src/mocks/tauri-api.js'),
            '@tauri-apps/api/http': resolve(__dirname, 'src/mocks/tauri-api.js'),
            '@tauri-apps/api/os': resolve(__dirname, 'src/mocks/tauri-api.js'),
            '@tauri-apps/api/app': resolve(__dirname, 'src/mocks/tauri-api.js'),
            '@tauri-apps/api/updater': resolve(__dirname, 'src/mocks/tauri-api.js'),
            '@tauri-apps/api/process': resolve(__dirname, 'src/mocks/tauri-api.js'),
            '@tauri-apps/api/clipboard': resolve(__dirname, 'src/mocks/tauri-api.js'),
            '@tauri-apps/api/notification': resolve(__dirname, 'src/mocks/tauri-api.js'),
            '@tauri-apps/api/shell': resolve(__dirname, 'src/mocks/tauri-api.js'),
            '@tauri-apps/api/globalShortcut': resolve(__dirname, 'src/mocks/tauri-api.js'),
            '@tauri-apps/api/dialog': resolve(__dirname, 'src/mocks/tauri-api.js'),
            '@tauri-apps/api': resolve(__dirname, 'src/mocks/tauri-api.js'),
            'tauri-plugin-store-api': resolve(__dirname, 'src/mocks/tauri-store.js'),
            'tauri-plugin-fs-watch-api': resolve(__dirname, 'src/mocks/tauri-watch.js'),
            'tauri-plugin-log-api': resolve(__dirname, 'src/mocks/tauri-log.js'),
            'tauri-plugin-sql-api': resolve(__dirname, 'src/mocks/tauri-sql.js'),
        },
    },
    build: {
        rollupOptions: {
            input: {
                index: resolve(__dirname, 'index.html'),
                daemon: resolve(__dirname, 'daemon.html'),
            },
        },
        target: 'es2022',
        minify: 'esbuild',
        sourcemap: false,
    },
}));

