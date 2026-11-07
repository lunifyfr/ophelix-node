import { describe, expect, it } from 'vitest'
import { Ophelix, OphelixSignatureVerificationError, webhooks } from '../../src'

// Un vecteur calculé par l'algorithme du serveur : HMAC-SHA256 de `t.corps`, en hexadécimal.
const PAYLOAD = '{"id":"evt_unit","object":"event","type":"claim.paid"}'
const SECRET = 'whsec_unit-secret'
const TIMESTAMP = 1793890000
const HEADER = `t=${TIMESTAMP},v1=551e2f9591a9a85d12a909939a36337682d4f204795aed8637a4b21cd7c5c606`

describe('la signature d’un webhook', () => {
  it('se vérifie comme le serveur la calcule', () => {
    expect(webhooks.computeSignature(PAYLOAD, SECRET, TIMESTAMP)).toBe(HEADER.split('v1=')[1])
    expect(() => webhooks.verifySignature(PAYLOAD, HEADER, SECRET, { now: TIMESTAMP + 10 })).not.toThrow()
  })

  it('rend l’événement, depuis une chaîne comme depuis un Buffer', () => {
    const event = Ophelix.webhooks.constructEvent(Buffer.from(PAYLOAD), HEADER, SECRET, { now: TIMESTAMP })
    expect(event.id).toBe('evt_unit')
    expect(event.type).toBe('claim.paid')
    expect(new Ophelix('sk_test_unit').webhooks.constructEvent(PAYLOAD, [HEADER], SECRET, { now: TIMESTAMP }).id).toBe('evt_unit')
  })

  it.each([
    ['un corps modifié', `${PAYLOAD} `, HEADER, SECRET],
    ['un autre secret', PAYLOAD, HEADER, 'whsec_other-secret'],
    ['un en-tête absent', PAYLOAD, undefined, SECRET],
    ['un en-tête mal formé', PAYLOAD, 'v1=abc', SECRET],
  ])('refuse %s', (_, payload, header, secret) => {
    expect(() => webhooks.constructEvent(payload, header, secret, { now: TIMESTAMP })).toThrow(OphelixSignatureVerificationError)
  })

  it('refuse une livraison trop ancienne, sauf tolérance coupée', () => {
    expect(() => webhooks.verifySignature(PAYLOAD, HEADER, SECRET, { now: TIMESTAMP + 301 })).toThrow(/tolérance/)
    expect(() => webhooks.verifySignature(PAYLOAD, HEADER, SECRET, { now: TIMESTAMP + 301, tolerance: 0 })).not.toThrow()
  })

  it('accepte une signature parmi plusieurs', () => {
    const header = `t=${TIMESTAMP},v1=${'0'.repeat(64)},v1=${HEADER.split('v1=')[1]}`
    expect(() => webhooks.verifySignature(PAYLOAD, header, SECRET, { now: TIMESTAMP })).not.toThrow()
  })

  it('refuse un corps déjà décodé', () => {
    expect(() => webhooks.verifySignature(JSON.parse(PAYLOAD), HEADER, SECRET)).toThrow(TypeError)
  })

  it('signe un en-tête de test qui se vérifie', () => {
    const header = webhooks.generateTestHeader({ payload: PAYLOAD, secret: SECRET })
    expect(webhooks.constructEvent(PAYLOAD, header, SECRET).id).toBe('evt_unit')
  })
})
