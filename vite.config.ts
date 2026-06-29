import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),

    electron([
  {
    entry: 'electron/main.ts',
    vite: {
      build: {
        outDir: 'dist-electron',
        sourcemap: true,
        rollupOptions: {
          external: ['better-sqlite3'],
          output: {
            format: 'cjs',  // ← agregar esto
          },
        },
      },
    },
  },
  {
    entry: 'electron/preload.ts',
    vite: {
      build: {
        outDir: 'dist-electron',
        sourcemap: true,
        rollupOptions: {
          output: {
            format: 'cjs',  // ← agregar esto también
          },
        },
      },
    },
  },
]),
  ],

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },

  // Importante: Electron espera el dev server en este puerto
  server: {
    port: 5173,
  },

  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});