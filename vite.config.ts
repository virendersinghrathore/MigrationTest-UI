import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

// Plugin to prevent Vite from triggering full reload or HMR when files in the data/ directory are updated
function ignoreDataStoragePlugin(): Plugin {
  return {
    name: 'ignore-data-storage',
    handleHotUpdate({ file }) {
      const normalized = file.replace(/\\/g, '/');
      if (normalized.includes('/data/') || normalized.endsWith('/data')) {
        return [];
      }
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), ignoreDataStoragePlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {
        ignored: [
          '**/data/**',
          '**/data/**/*',
          '**/data',
          (file: string) => {
            const normalized = file.replace(/\\/g, '/');
            return normalized.includes('/data/') || normalized.endsWith('/data');
          },
        ],
      },
    },
  };
});
