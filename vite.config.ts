import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    build: {
      target: 'es2020',
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-core':  ['react', 'react-dom'],
            'react-router': ['react-router-dom'],
            'motion':      ['motion'],
            'recharts':    ['recharts'],
            'i18n':        ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
            'pdf-export':  ['jspdf', 'jspdf-autotable'],
            'icons':       ['lucide-react'],
          },
        },
      },
    },
  };
});
