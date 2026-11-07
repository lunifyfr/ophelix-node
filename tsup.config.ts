import { defineConfig } from 'tsup'

// ESM et CommonJS, avec leurs déclarations, pour Node 20 et plus. Aucune dépendance embarquée.
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  target: 'node20',
  platform: 'node',
  clean: true,
  sourcemap: true,
})
