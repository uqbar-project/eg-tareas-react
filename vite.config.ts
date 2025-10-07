/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      src: '/src',
      components: '/src/components',
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      reporter: ['lcov', 'json', 'html', 'text', 'json-summary'],
      exclude: [ './src/App.tsx', 'eslint.config.js', './src/main.tsx', '**/*.cjs', '**/*.d.ts', 'vite.config.ts' ],      
    },
  }
})