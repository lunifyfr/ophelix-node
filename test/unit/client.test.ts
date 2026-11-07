import { describe, expect, it } from 'vitest'
import {
  API_VERSION,
  Ophelix,
  OphelixAPIError,
  OphelixAuthenticationError,
  OphelixConnectionError,
  OphelixIdempotencyError,
  OphelixInvalidRequestError,
  OphelixPermissionError,
  OphelixRateLimitError,
} from '../../src'
import { claim, error, fakeFetch } from './fake-fetch'

const KEY = 'sk_test_unit'

function client(fetch: typeof globalThis.fetch, config: Record<string, unknown> = {}) {
  const sleeps: number[] = []
  const ophelix = new Ophelix(KEY, {
    fetch,
    baseUrl: 'https://api.example.test/',
    sleep: async milliseconds => {
      sleeps.push(milliseconds)
    },
    ...config,
  })
  return { ophelix, sleeps }
}

describe('la clé', () => {
  it('refuse ce qui n’est pas une clé Ophelix', () => {
    expect(() => new Ophelix('pk_test_unit')).toThrow(TypeError)
    expect(() => new Ophelix('')).toThrow(TypeError)
  })

  it('décide du mode', () => {
    expect(new Ophelix('sk_test_unit').livemode).toBe(false)
    expect(new Ophelix('rk_test_unit').livemode).toBe(false)
    expect(new Ophelix('sk_live_unit').livemode).toBe(true)
    expect(new Ophelix('rk_live_unit').livemode).toBe(true)
  })
})

describe('une requête', () => {
  it('porte la clé, la version épinglée et rien qui ne serve pas à une lecture', async () => {
    const { fetch, calls } = fakeFetch({ body: claim('clm_1') })
    const { ophelix } = client(fetch)

    const retrieved = await ophelix.claims.retrieve('clm_1', { expand: ['patient', 'practitioner'] })

    expect(retrieved.id).toBe('clm_1')
    expect(calls[0]!.url).toBe('https://api.example.test/v1/claims/clm_1?expand[]=patient&expand[]=practitioner')
    expect(calls[0]!.method).toBe('GET')
    expect(calls[0]!.headers.Authorization).toBe(`Bearer ${KEY}`)
    expect(calls[0]!.headers['Ophelix-Version']).toBe(API_VERSION)
    expect(calls[0]!.headers['User-Agent']).toMatch(/^ophelix-node\/\S+ node\/v\d+/)
    expect(calls[0]!.headers['Idempotency-Key']).toBeUndefined()
    expect(calls[0]!.headers['Content-Type']).toBeUndefined()
  })

  it('envoie une écriture en JSON avec une clé d’idempotence tirée pour elle', async () => {
    const { fetch, calls } = fakeFetch({ status: 201, body: claim('clm_1') }, { status: 201, body: claim('clm_2') })
    const { ophelix } = client(fetch)

    await ophelix.claims.create({ practitioner: 'prac_1', patient: 'pat_1', third_party_amo: true })
    await ophelix.claims.create({ practitioner: 'prac_1', patient: 'pat_1' })

    expect(calls[0]!.method).toBe('POST')
    expect(calls[0]!.headers['Content-Type']).toBe('application/json')
    expect(JSON.parse(calls[0]!.body!)).toEqual({ practitioner: 'prac_1', patient: 'pat_1', third_party_amo: true })
    expect(calls[0]!.headers['Idempotency-Key']).toMatch(/^[0-9a-f-]{36}$/)
    expect(calls[1]!.headers['Idempotency-Key']).not.toBe(calls[0]!.headers['Idempotency-Key'])
  })

  it('envoie un objet déplié par son identifiant', async () => {
    const { fetch, calls } = fakeFetch({ status: 201, body: claim('clm_1') })
    const { ophelix } = client(fetch)
    const patient = { id: 'pat_1', object: 'patient' as const, quality: 'insured' as const, livemode: false } as never

    await ophelix.claims.create({
      practitioner: 'prac_1',
      patient,
      lines: [{ nomenclature: 'ngap', code: 'ZC', service_date: '2026-11-06' }],
    })

    expect(JSON.parse(calls[0]!.body!)).toEqual({
      practitioner: 'prac_1',
      patient: 'pat_1',
      lines: [{ nomenclature: 'ngap', code: 'ZC', service_date: '2026-11-06' }],
    })
  })

  it('laisse choisir la clé d’idempotence et la version, appel par appel', async () => {
    const { fetch, calls } = fakeFetch({ body: claim('clm_1', 'ready') })
    const { ophelix } = client(fetch, { apiVersion: '2026-11-01' })

    await ophelix.claims.finalize('clm_1', {}, { idempotencyKey: 'ma-cle', apiVersion: '2027-01-01' })

    expect(calls[0]!.url).toBe('https://api.example.test/v1/claims/clm_1/finalize')
    expect(calls[0]!.body).toBeUndefined()
    expect(calls[0]!.headers['Idempotency-Key']).toBe('ma-cle')
    expect(calls[0]!.headers['Ophelix-Version']).toBe('2027-01-01')
  })

  it('suit les routes imbriquées', async () => {
    const { fetch, calls } = fakeFetch({ body: claim('clm_1') }, { body: claim('clm_1', 'paid') })
    const { ophelix } = client(fetch)

    await ophelix.claims.lines.update('clm_1', 'cli_1', { quantity: 2 })
    await ophelix.testHelpers.claims.simulateReturn('clm_1', { scenario: 'payment' })

    expect(calls[0]!.method).toBe('PATCH')
    expect(calls[0]!.url).toBe('https://api.example.test/v1/claims/clm_1/lines/cli_1')
    expect(calls[1]!.url).toBe('https://api.example.test/v1/test-helpers/claims/clm_1/returns')
  })

  it('encode un identifiant et refuse un identifiant vide', async () => {
    const { fetch, calls } = fakeFetch({ body: claim('a/b') })
    const { ophelix } = client(fetch)

    await ophelix.claims.retrieve('a/b')
    expect(calls[0]!.url).toBe('https://api.example.test/v1/claims/a%2Fb')
    expect(() => ophelix.claims.retrieve('')).toThrow(TypeError)
  })

  it('garde la réponse à côté de l’objet, sans la sérialiser', async () => {
    const { fetch } = fakeFetch({ body: claim('clm_1'), headers: { 'Request-Id': 'req_42', 'Idempotent-Replayed': 'true' } })
    const { ophelix } = client(fetch)

    const created = await ophelix.claims.create({ practitioner: 'prac_1', patient: 'pat_1' })

    expect(created.lastResponse.requestId).toBe('req_42')
    expect(created.lastResponse.statusCode).toBe(200)
    expect(created.lastResponse.idempotentReplayed).toBe(true)
    expect(JSON.parse(JSON.stringify(created))).toEqual(claim('clm_1'))
  })
})

describe('les erreurs', () => {
  it.each([
    [404, 'invalid_request_error', 'resource_missing', OphelixInvalidRequestError],
    [401, 'authentication_error', 'invalid_api_key', OphelixAuthenticationError],
    [403, 'permission_error', 'insufficient_scope', OphelixPermissionError],
    [409, 'idempotency_error', 'idempotency_key_reused', OphelixIdempotencyError],
  ])('un %i %s devient sa classe', async (status, type, code, Kind) => {
    const { fetch, calls } = fakeFetch(error(status, type, code))
    const { ophelix } = client(fetch)

    const failure = await ophelix.claims.retrieve('clm_1').catch(caught => caught)

    expect(failure).toBeInstanceOf(Kind)
    expect(failure).toMatchObject({
      type,
      code,
      statusCode: status,
      requestId: 'req_unit',
      docUrl: `https://docs.ophelix.fr/erreurs#${code}`,
    })
    expect(calls).toHaveLength(1)
  })

  it('garde tous les champs fautifs d’une validation', async () => {
    const { fetch } = fakeFetch(
      error(422, 'invalid_request_error', 'parameter_invalid', {
        param: 'card',
        errors: [
          { param: 'card', message: 'Inconnue.' },
          { param: 'source', message: 'Requise.' },
        ],
      }),
    )
    const { ophelix } = client(fetch)

    const failure = await ophelix.practitioners.create({ card: 'x' }).catch(caught => caught)

    expect(failure.param).toBe('card')
    expect(failure.errors).toHaveLength(2)
  })

  it('reconnaît une réponse qui n’est pas du JSON', async () => {
    const { fetch } = fakeFetch({ status: 502, body: '<html>Bad gateway</html>' })
    const { ophelix } = client(fetch, { maxRetries: 0 })

    const failure = await ophelix.ping().catch(caught => caught)

    expect(failure).toBeInstanceOf(OphelixAPIError)
    expect(failure.statusCode).toBe(502)
    expect(failure.raw).toBe('<html>Bad gateway</html>')
  })
})

describe('les reprises', () => {
  it('reprend un 429 après Retry-After, avec la même clé d’idempotence', async () => {
    const { fetch, calls } = fakeFetch(
      { ...error(429, 'rate_limit_error', 'rate_limit_exceeded'), headers: { 'Retry-After': '3' } },
      { status: 201, body: claim('clm_1') },
    )
    const { ophelix, sleeps } = client(fetch)

    const created = await ophelix.claims.create({ practitioner: 'prac_1', patient: 'pat_1' })

    expect(created.id).toBe('clm_1')
    expect(sleeps).toEqual([3000])
    expect(calls[1]!.headers['Idempotency-Key']).toBe(calls[0]!.headers['Idempotency-Key'])
  })

  it('reprend un 5xx avec un délai croissant, puis abandonne', async () => {
    const failure = error(503, 'api_error', 'engine_unavailable')
    const { fetch, calls } = fakeFetch(failure, failure, failure)
    const { ophelix, sleeps } = client(fetch)

    const caught = await ophelix.claims.secure('clm_1').catch(reason => reason)

    expect(caught).toBeInstanceOf(OphelixAPIError)
    expect(calls).toHaveLength(3)
    expect(sleeps[0]).toBeGreaterThanOrEqual(250)
    expect(sleeps[0]).toBeLessThanOrEqual(500)
    expect(sleeps[1]).toBeGreaterThanOrEqual(500)
    expect(sleeps[1]).toBeLessThanOrEqual(1000)
  })

  it('reprend une clé d’idempotence encore en cours, pas une clé réutilisée', async () => {
    const { fetch, calls } = fakeFetch(error(409, 'idempotency_error', 'idempotency_key_in_progress'), { body: claim('clm_1') })
    const { ophelix } = client(fetch)

    await ophelix.claims.finalize('clm_1')
    expect(calls).toHaveLength(2)
  })

  it('reprend une coupure du réseau', async () => {
    const { fetch, calls } = fakeFetch(new TypeError('fetch failed'), { body: claim('clm_1') })
    const { ophelix } = client(fetch)

    await ophelix.claims.retrieve('clm_1')
    expect(calls).toHaveLength(2)
  })

  it('rend une erreur de connexion quand le réseau ne revient pas', async () => {
    const { fetch } = fakeFetch(new TypeError('fetch failed'))
    const { ophelix } = client(fetch, { maxRetries: 0 })

    await expect(ophelix.claims.retrieve('clm_1')).rejects.toBeInstanceOf(OphelixConnectionError)
  })

  it('coupe une tentative trop longue', async () => {
    const hanging = ((_: unknown, init: RequestInit) =>
      new Promise((_, reject) => init.signal?.addEventListener('abort', () => reject(init.signal?.reason)))) as typeof globalThis.fetch
    const { ophelix } = client(hanging, { maxRetries: 0, timeout: 20 })

    const failure = await ophelix.claims.retrieve('clm_1').catch(caught => caught)
    expect(failure).toBeInstanceOf(OphelixConnectionError)
    expect(failure.message).toContain('20 ms')
  })

  it('n’essaie qu’une fois quand les reprises sont coupées', async () => {
    const { fetch, calls } = fakeFetch(error(429, 'rate_limit_error', 'rate_limit_exceeded'))
    const { ophelix } = client(fetch, { maxRetries: 0 })

    await expect(ophelix.claims.list()).rejects.toBeInstanceOf(OphelixRateLimitError)
    expect(calls).toHaveLength(1)
  })
})
