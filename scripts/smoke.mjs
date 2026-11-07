// Le paquet bâti se charge par import, sans dépendance, et donne un client utilisable.
import assert from 'node:assert/strict'
import Default, { API_VERSION, Ophelix, webhooks } from '../dist/index.js'

const ophelix = new Ophelix('sk_live_smoke')
assert.equal(Default, Ophelix)
assert.equal(ophelix.livemode, true)
assert.equal(ophelix.apiVersion, API_VERSION)
assert.equal(typeof ophelix.claims.lines.create, 'function')
assert.equal(typeof webhooks.verifySignature, 'function')
console.log('ESM : ok')
