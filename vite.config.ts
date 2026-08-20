import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      // En dev, le frontend (port 3000) et l'API Express (port 4000, voir
      // server/index.ts) tournent separement. Ce proxy evite tout souci de
      // CORS pendant le developpement local.
      proxy: {
        '/api': {
          target: process.env.VITE_API_PROXY_TARGET ?? 'http://localhost:4000',
          changeOrigin: true,
        },
      },
    },
  };
});
