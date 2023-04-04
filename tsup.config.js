import { defineConfig } from 'tsup'
import multiEntry from 'rollup-plugin-multi-entry'

export default defineConfig({
  entry: [
    'src/@types',
    'src/config/**/*.ts',
    'src/modules/accounts/**/*.ts',
    'src/modules/books/**/*.ts',
    'src/modules/persons/**/*.ts',
    'src/modules/projects/**/*.ts',
    'src/shared/**/*.ts',
    'src/env/**/*.ts',
  ],
  format: 'cjs',
  plugins: [multiEntry()],
  outDir: './build',
});