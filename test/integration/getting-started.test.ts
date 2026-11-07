import { describe, expect, it } from 'vitest'
import { type Claim, Ophelix, OphelixInvalidRequestError } from '../../src'

/**
 * Le parcours du guide de démarrage, contre une vraie API en mode test : une carte CPS, une carte
 * Vitale, une facture, sa validation, sa signature et ses retours simulés jusqu'au paiement.
 *
 *   OPHELIX_TEST_KEY=sk_test_… OPHELIX_API_URL=http://localhost:8000 bun run test:integration
 */
const key = process.env.OPHELIX_TEST_KEY ?? ''
const baseUrl = process.env.OPHELIX_API_URL ?? 'http://localhost:8000'

if (key && !/^[sr]k_test_/.test(key)) throw new Error('OPHELIX_TEST_KEY doit être une clé de test.')

describe.skipIf(!key)('le guide de démarrage, avec la bibliothèque', () => {
  // Sans clé, la suite est sautée : le client n'appelle jamais rien.
  const ophelix = new Ophelix(key || 'sk_test_none', { baseUrl })
  let claim: Claim

  it('répond en mode test', async () => {
    expect(ophelix.livemode).toBe(false)
    const ping = await ophelix.ping()
    expect(ping.object).toBe('ping')
    expect(ping.lastResponse.requestId).toMatch(/^req_/)
  })

  it('mène une facture de test du brouillon au paiement', async () => {
    const practitioner = await ophelix.practitioners.create({ card: 'cps_doctor' })
    expect(practitioner.id).toMatch(/^prac_/)
    expect(practitioner.status).toBe('ready')

    const coverage = await ophelix.coverages.create({ source: 'vitale_card', card: 'vitale_ok' })
    expect(coverage.patient).toMatch(/^pat_/)

    const created = await ophelix.claims.create({
      practitioner: practitioner.id,
      patient: coverage.patient,
      third_party_amo: true,
      context: { care_pathway: 'treating_doctor', common_law_accident: false },
      lines: [{ nomenclature: 'ngap', code: 'ZC', service_date: '2026-11-06', unit_price_cents: 2650 }],
    })
    expect(created.status).toBe('draft')
    expect(created.amount_cents).toBe(2650)
    expect(created.lastResponse.statusCode).toBe(201)
    claim = created

    const validation = await ophelix.claims.validate(claim.id)
    expect(validation.valid).toBe(true)
    expect(validation.violations).toEqual([])

    expect((await ophelix.claims.finalize(claim.id)).status).toBe('ready')
    expect((await ophelix.claims.secure(claim.id)).status).toBe('secured')

    await ophelix.testHelpers.claims.simulateReturn(claim.id, { scenario: 'arl_positive' })
    const paid = await ophelix.testHelpers.claims.simulateReturn(claim.id, { scenario: 'payment' })
    expect(paid.status).toBe('paid')
    // Sans part obligatoire calculée, la caisse simulée règle le total facturé.
    expect(paid.paid_amount_cents).toBe(paid.amo_amount_cents ?? paid.amount_cents)

    const retrieved = await ophelix.claims.retrieve(claim.id, { expand: ['patient', 'practitioner'] })
    expect(retrieved.status).toBe('paid')
    expect(typeof retrieved.patient === 'object' && retrieved.patient.id).toBe(coverage.patient)
    expect(typeof retrieved.practitioner === 'object' && retrieved.practitioner.id).toBe(practitioner.id)
  })

  it('relit la chronologie de la facture, page après page', async () => {
    const types: string[] = []
    for await (const event of ophelix.events.list({ object: claim.id, limit: 2 })) types.push(event.type)

    for (const type of ['claim.created', 'claim.ready', 'claim.secured', 'claim.acknowledged', 'claim.paid']) {
      expect(types).toContain(type)
    }
  })

  it('rejoue une écriture avec la même clé d’idempotence', async () => {
    const body = { url: 'https://exemple.fr/hook', enabled_events: ['claim.*'] }
    const idempotencyKey = crypto.randomUUID()
    const first = await ophelix.webhookEndpoints.create(body, { idempotencyKey })
    const replayed = await ophelix.webhookEndpoints.create(body, { idempotencyKey })

    expect(replayed.id).toBe(first.id)
    expect(replayed.lastResponse.idempotentReplayed).toBe(true)

    const deleted = await ophelix.webhookEndpoints.delete(first.id)
    expect(deleted.deleted).toBe(true)
  })

  it('rend une erreur typée, avec son code et sa requête', async () => {
    const failure = await ophelix.claims.retrieve('clm_inconnu').catch(caught => caught)

    expect(failure).toBeInstanceOf(OphelixInvalidRequestError)
    expect(failure.code).toBe('resource_missing')
    expect(failure.statusCode).toBe(404)
    expect(failure.requestId).toMatch(/^req_/)
    expect(failure.docUrl).toMatch(/\/erreurs#resource_missing$/)
  })
})
