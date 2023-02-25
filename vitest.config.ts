// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    includeSource: ['src/**/*.ts'],
  },
  resolve: {
    alias: {
      '@modules/': '/src/modules/',
      '@errors/': '/src/errors/',
      '@middlewares/': '/src/middlewares/',
      '@routes/': '/src/routes/',
      '@config/': '/src/config/',
      '@shared/': '/src/shared/',
    },
  },
})
