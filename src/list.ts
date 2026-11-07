import type { ListParams } from './params'
import type { OphelixResponse } from './requester'

/** Une page d'une liste, du plus récent au plus ancien. */
export interface Page<T> {
  object: 'list'
  url: string
  has_more: boolean
  data: T[]
}

type FetchPage<T> = (params: ListParams) => Promise<OphelixResponse<Page<T>>>

/**
 * Le retour d'une liste. Attendu, il donne la première page. Parcouru par `for await`, il donne
 * chaque objet de toutes les pages, en demandant la suivante quand la précédente est lue.
 *
 *   const page = await ophelix.claims.list({ limit: 10 })
 *   for await (const claim of ophelix.claims.list({ status: 'paid' })) { … }
 */
export class ListPromise<T> implements PromiseLike<OphelixResponse<Page<T>>>, AsyncIterable<T> {
  #first: Promise<OphelixResponse<Page<T>>> | undefined

  constructor(
    private readonly fetchPage: FetchPage<T>,
    private readonly params: ListParams,
  ) {}

  private first(): Promise<OphelixResponse<Page<T>>> {
    this.#first ??= this.fetchPage(this.params)
    return this.#first
  }

  // biome-ignore lint/suspicious/noThenProperty: un retour de liste s'attend comme une promesse.
  then<A = OphelixResponse<Page<T>>, B = never>(
    onfulfilled?: ((value: OphelixResponse<Page<T>>) => A | PromiseLike<A>) | null,
    onrejected?: ((reason: unknown) => B | PromiseLike<B>) | null,
  ): Promise<A | B> {
    return this.first().then(onfulfilled, onrejected)
  }

  catch<B = never>(onrejected?: ((reason: unknown) => B | PromiseLike<B>) | null): Promise<OphelixResponse<Page<T>> | B> {
    return this.first().catch(onrejected)
  }

  /**
   * Chaque objet, page après page. Avec `ending_before`, le parcours remonte vers les plus
   * récents, et chaque page se lit à l'envers.
   */
  async *[Symbol.asyncIterator](): AsyncIterator<T> {
    const backwards = this.params.ending_before !== undefined
    const { starting_after: _after, ending_before: _before, ...rest } = this.params
    let page: Page<T> = await this.first()

    while (true) {
      const items = backwards ? [...page.data].reverse() : page.data
      for (const item of items) yield item

      if (!page.has_more || page.data.length === 0) return
      const edge = (backwards ? page.data[0] : page.data[page.data.length - 1]) as { id?: string }
      if (typeof edge.id !== 'string') return
      page = await this.fetchPage(backwards ? { ...rest, ending_before: edge.id } : { ...rest, starting_after: edge.id })
    }
  }

  /** Les objets de toutes les pages, jusqu'à `limit`. La borne est obligatoire : une liste peut être longue. */
  async toArray({ limit }: { limit: number }): Promise<T[]> {
    const items: T[] = []
    if (limit <= 0) return items
    for await (const item of this) {
      items.push(item)
      if (items.length >= limit) break
    }
    return items
  }
}
