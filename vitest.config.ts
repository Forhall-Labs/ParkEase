import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  test: {
    projects: [
      {
        test: {
          name: 'backend',
          include: ['tests/backend/**/*.test.ts'],
          environment: 'node',
          globals: true,
        },
      },
      {
        plugins: [react()],
        resolve: {
          alias: {
            '@': resolve(__dirname, 'src'),
          },
        },
        test: {
          name: 'frontend',
          include: ['src/**/*.test.{ts,tsx}'],
          environment: 'jsdom',
          globals: true,
          setupFiles: ['tests/frontend/setup.ts'],
        },
      },
    ],
    coverage: {
      provider: 'v8',
      include: [
        'electron/service/**',
        'electron/repositories/**',
        'src/utils/**',
        'src/components/**',
      ],
      exclude: ['**/*.test.*', '**/node_modules/**'],
    },
  },
});
