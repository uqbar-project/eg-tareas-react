import { defineConfig } from '@playwright/test'

export default defineConfig({
  webServer: {
    command: 'VITE_PAGINATION_ENABLED=false pnpm build && pnpm preview',
    port: 4173,
  },

  use: {
    baseURL: 'http://localhost:4173',
  },

  testDir: 'e2e',
})
