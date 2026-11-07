// Le paquet bâti se charge par require, sans dépendance, et donne un client utilisable.
const assert = require('node:assert/strict')
const { Ophelix, OphelixError, webhooks } = require('../dist/index.cjs')

const ophelix = new Ophelix('sk_test_smoke')
assert.equal(typeof ophelix.claims.list, 'function')
assert.equal(typeof ophelix.testHelpers.claims.simulateReturn, 'function')
assert.equal(typeof webhooks.constructEvent, 'function')
assert.ok(new OphelixError('x') instanceof Error)
console.log('CommonJS : ok')
