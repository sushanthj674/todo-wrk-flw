import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
      exclude: [
        'node_modules/**',
        '.next/**',
        'out/**',
        '**/*.config.*',
        '**/*.setup.*',
        '**/layout.tsx',
        '**/*.d.ts',
        'lib/todo/types.ts', // Type definitions do not need coverage
      ],
      include: ['app/**/*.ts', 'app/**/*.tsx', 'lib/**/*.ts'],
    },
  },
});
