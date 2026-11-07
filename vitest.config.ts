import { defineConfig } from 'vitest/config'

// Les tests unitaires ne sortent pas du processus. Ceux d'intégration appellent une vraie API, en
// mode test : ils attendent OPHELIX_TEST_KEY, et se taisent sans elle.
export default defineConfig({
  test: {
    projects: [
      { test: { name: 'unit', include: ['test/unit/**/*.test.ts'] } },
      { test: { name: 'integration', include: ['test/integration/**/*.test.ts'], testTimeout: 60_000 } },
    ],
  },
})
