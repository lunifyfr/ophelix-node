import { describe, expect, it } from 'vitest'
import { Ophelix } from '../../src'
import { claim, fakeFetch } from './fake-fetch'

const page = (ids: string[], hasMore: boolean) => ({
  body: { object: 'list', url: '/v1/claims', has_more: hasMore, data: ids.map(id => claim(id)) },
})

describe('une liste', () => {
  it('attendue, donne la première page', async () => {
    const { fetch, calls } = fakeFetch(page(['clm_3', 'clm_2'], true))
    const ophelix = new Ophelix('sk_test_unit', { fetch })

    const first = await ophelix.claims.list({ limit: 2, status: 'paid', 'created[gte]': 1793890000 })

    expect(first.data.map(item => item.id)).toEqual(['clm_3', 'clm_2'])
    expect(first.has_more).toBe(true)
    expect(first.lastResponse.requestId).toBe('req_unit')
    expect(calls[0]!.url).toBe('https://api.ophelix.fr/v1/claims?limit=2&status=paid&created[gte]=1793890000')
  })

  it('parcourue, demande chaque page suivante et garde les filtres', async () => {
    const { fetch, calls } = fakeFetch(page(['clm_5', 'clm_4'], true), page(['clm_3', 'clm_2'], true), page(['clm_1'], false))
    const ophelix = new Ophelix('sk_test_unit', { fetch })

    const ids: string[] = []
    for await (const item of ophelix.claims.list({ limit: 2, status: 'paid' })) ids.push(item.id)

    expect(ids).toEqual(['clm_5', 'clm_4', 'clm_3', 'clm_2', 'clm_1'])
    expect(calls.map(call => call.url.split('?')[1])).toEqual([
      'limit=2&status=paid',
      'limit=2&status=paid&starting_after=clm_4',
      'limit=2&status=paid&starting_after=clm_2',
    ])
  })

  it('remonte vers les plus récents depuis ending_before', async () => {
    const { fetch, calls } = fakeFetch(page(['clm_4', 'clm_3'], true), page(['clm_6', 'clm_5'], false))
    const ophelix = new Ophelix('sk_test_unit', { fetch })

    const ids: string[] = []
    for await (const item of ophelix.claims.list({ limit: 2, ending_before: 'clm_2' })) ids.push(item.id)

    expect(ids).toEqual(['clm_3', 'clm_4', 'clm_5', 'clm_6'])
    expect(calls[1]!.url).toContain('ending_before=clm_4')
  })

  it('s’arrête à la borne de toArray sans lire la page suivante', async () => {
    const { fetch, calls } = fakeFetch(page(['clm_5', 'clm_4'], true), page(['clm_3', 'clm_2'], true))
    const ophelix = new Ophelix('sk_test_unit', { fetch })

    const items = await ophelix.claims.list({ limit: 2 }).toArray({ limit: 3 })

    expect(items.map(item => item.id)).toEqual(['clm_5', 'clm_4', 'clm_3'])
    expect(calls).toHaveLength(2)
  })

  it('ne relit pas la première page quand on l’attend puis la parcourt', async () => {
    const { fetch, calls } = fakeFetch(page(['clm_1'], false))
    const ophelix = new Ophelix('sk_test_unit', { fetch })

    const list = ophelix.claims.list()
    await list
    const ids: string[] = []
    for await (const item of list) ids.push(item.id)

    expect(ids).toEqual(['clm_1'])
    expect(calls).toHaveLength(1)
  })
})
