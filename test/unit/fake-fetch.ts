/** Un `fetch` qui rend des réponses préparées et garde chaque requête reçue. */
export type Recorded = {
  url: string
  method: string
  headers: Record<string, string>
  body: string | undefined
  signal: AbortSignal | undefined
}

type Reply = { status?: number; body?: unknown; headers?: Record<string, string> } | Error

export function fakeFetch(...replies: Reply[]) {
  const calls: Recorded[] = []
  const fetch = async (input: string | URL | Request, init: RequestInit = {}): Promise<Response> => {
    calls.push({
      url: String(input),
      method: init.method ?? 'GET',
      headers: init.headers as Record<string, string>,
      body: init.body as string | undefined,
      signal: init.signal ?? undefined,
    })
    const reply = replies.shift()
    if (!reply) throw new Error('Aucune réponse préparée pour cet appel.')
    if (reply instanceof Error) throw reply
    const text = reply.body === undefined ? '' : typeof reply.body === 'string' ? reply.body : JSON.stringify(reply.body)
    return new Response(text, { status: reply.status ?? 200, headers: { 'Request-Id': 'req_unit', ...reply.headers } })
  }
  return { fetch: fetch as typeof globalThis.fetch, calls }
}

export const error = (status: number, type: string, code: string, extra: Record<string, unknown> = {}) => ({
  status,
  body: {
    error: {
      type,
      code,
      message: `Erreur ${code}.`,
      param: null,
      doc_url: `https://docs.ophelix.fr/erreurs#${code}`,
      request_id: 'req_unit',
      ...extra,
    },
  },
})

export const claim = (id: string, status = 'draft') => ({ id, object: 'claim', status, livemode: false })
