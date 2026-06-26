/// <reference types="vitest" />
/// <reference types="vite/client" />

import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      src: '/src',
      components: '/src/components',
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      exclude: ['./src/main.tsx', '**/*.cjs', '**/*.d.ts', '**/*.css', 'vite.config.ts'],
      reporter: ['lcov', 'json', 'html', 'json-summary', 'text'],
    },
  },
})
