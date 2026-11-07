import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

// Dans le dépôt d'Ophelix, le code généré doit suivre api/openapi.json. Hors du dépôt, dans le
// miroir public de la bibliothèque, la spécification n'est pas là : rien à comparer.
const REPO = join(__dirname, '../../../..')
const monorepo = existsSync(join(REPO, 'api/openapi.json'))

describe.skipIf(!monorepo)('la bibliothèque et la spécification', () => {
  it('le code généré suit api/openapi.json', () => {
    const result = spawnSync('bun', ['sdks/scripts/generate.ts', '--check'], { cwd: REPO, encoding: 'utf8' })
    expect(result.stderr).toBe('')
    expect(result.status).toBe(0)
  })
})
