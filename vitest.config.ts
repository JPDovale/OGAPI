// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    includeSource: ['src/**/*.ts'],
    exclude: ['node_modules', 'build'],
  },
  resolve: {
    alias: {
      '@modules/': '/src/modules/',
      '@errors/': '/src/errors/',
      '@middlewares/': '/src/middlewares/',
      '@routes/': '/src/routes/',
      '@config/': '/src/config/',
      '@shared/': '/src/shared/',
      '@env/': '/src/env/',
      '@utils/': '/src/utils/',
    },
  },
})
