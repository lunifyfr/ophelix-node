import { describe, expect, it } from 'vitest'
import { encodeQuery } from '../../src/query'

describe('la chaîne de requête', () => {
  it('écrit tableaux, objets, dates et booléens comme l’API les lit', () => {
    expect(
      encodeQuery({
        expand: ['data.patient', 'data.practitioner'],
        created: { gte: new Date('2026-11-01T00:00:00Z'), lte: 1793890000 },
        object: 'clm_1',
        third_party_amo: true,
        skipped: undefined,
        empty: null,
      }),
    ).toBe(
      'expand[]=data.patient&expand[]=data.practitioner&created[gte]=1793491200&created[lte]=1793890000&object=clm_1&third_party_amo=true',
    )
  })

  it('envoie un objet de l’API par son identifiant', () => {
    expect(encodeQuery({ patient: { id: 'pat_1', object: 'patient', quality: 'insured' }, context: { care_pathway: 'emergency' } })).toBe(
      'patient=pat_1&context[care_pathway]=emergency',
    )
  })

  it('encode les valeurs', () => {
    expect(encodeQuery({ type: 'claim.*', route: '/v1/claims?x=1&y' })).toBe('type=claim.*&route=%2Fv1%2Fclaims%3Fx%3D1%26y')
  })
})
