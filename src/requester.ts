import { randomUUID } from 'node:crypto'
import { OphelixConnectionError, OphelixError } from './errors'
import { ListPromise, type Page } from './list'
import type { ListParams } from './params'
import { asIdentifier, encodeQuery } from './query'

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE'

/** Ce qui se règle appel par appel. */
export interface RequestOptions {
  /** La clé d'idempotence d'une écriture. Par défaut, la bibliothèque en tire une par appel. */
  idempotencyKey?: string
  /** La version de l'API pour cet appel seulement. */
  apiVersion?: string
  /** Le nombre de reprises après un 429, un 5xx ou une coupure. */
  maxRetries?: number
  /** Le délai d'une tentative, en millisecondes. */
  timeout?: number
  /** Pour abandonner l'appel. */
  signal?: AbortSignal
}

/** Ce que la réponse HTTP dit en plus de son corps. */
export interface ResponseMeta {
  statusCode: number
  headers: Headers
  /** L'identifiant de la requête, à retrouver dans Développeurs › Requêtes. */
  requestId: string | null
  /** Vrai quand l'API a rejoué la réponse d'une même clé d'idempotence. */
  idempotentReplayed: boolean
}

/** Un objet rendu par l'API, avec la réponse qui l'a porté. */
export type OphelixResponse<T> = T & { readonly lastResponse: ResponseMeta }

export interface Call {
  method: HttpMethod
  path: string
  params?: object | undefined
  options?: RequestOptions | undefined
}

/** @internal Ce que les services appellent. */
export interface Requester {
  request<T>(call: Call): Promise<OphelixResponse<T>>
  list<T>(call: Omit<Call, 'method'>): ListPromise<T>
}

/** @internal Un identifiant dans un chemin : jamais vide, toujours encodé. */
export function segment(value: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError("Un identifiant d'objet est attendu : une chaîne non vide.")
  }
  return encodeURIComponent(value)
}

export interface RequesterConfig {
  apiKey: string
  apiVersion: string
  baseUrl: string
  maxRetries: number
  timeout: number
  userAgent: string
  fetch: typeof fetch
  sleep: (milliseconds: number) => Promise<void>
}

const MAX_RETRY_AFTER_MS = 60_000

/** @internal Le transport : en-têtes, reprises, erreurs. */
export class HttpRequester implements Requester {
  constructor(private readonly config: RequesterConfig) {}

  list<T>({ path, params, options }: Omit<Call, 'method'>): ListPromise<T> {
    return new ListPromise<T>(page => this.request<Page<T>>({ method: 'GET', path, params: page, options }), (params ?? {}) as ListParams)
  }

  async request<T>({ method, path, params, options = {} }: Call): Promise<OphelixResponse<T>> {
    const query = method === 'GET' ? encodeQuery(params) : ''
    const url = `${this.config.baseUrl}${path}${query ? `?${query}` : ''}`
    const body =
      method !== 'GET' && params && Object.keys(params).length
        ? JSON.stringify(params, (key, value) => (key === '' ? value : asIdentifier(value)))
        : undefined

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.config.apiKey}`,
      Accept: 'application/json',
      'Ophelix-Version': options.apiVersion ?? this.config.apiVersion,
      'User-Agent': this.config.userAgent,
    }
    if (body !== undefined) headers['Content-Type'] = 'application/json'
    // Une clé par appel, gardée d'une reprise à l'autre : une écriture rejouée ne se double pas.
    if (method !== 'GET') headers['Idempotency-Key'] = options.idempotencyKey ?? randomUUID()

    const maxRetries = options.maxRetries ?? this.config.maxRetries
    const timeout = options.timeout ?? this.config.timeout

    for (let attempt = 0; ; attempt++) {
      let response: Response
      try {
        const signal = options.signal ? AbortSignal.any([options.signal, AbortSignal.timeout(timeout)]) : AbortSignal.timeout(timeout)
        response = await this.config.fetch(url, { method, headers, body, signal })
      } catch (cause) {
        if (options.signal?.aborted) throw new OphelixConnectionError("L'appel a été abandonné.", { cause })
        if (attempt < maxRetries) {
          await this.config.sleep(retryDelay(attempt, null))
          continue
        }
        const timedOut = cause instanceof Error && cause.name === 'TimeoutError'
        throw new OphelixConnectionError(
          timedOut ? `L'API n'a pas répondu en ${timeout} ms.` : `L'API est injoignable : ${(cause as Error)?.message ?? cause}`,
          { cause },
        )
      }

      const text = await response.text()
      const parsed = parse(text)

      if (response.ok) {
        if (parsed === null || typeof parsed !== 'object') {
          throw new OphelixError(`L'API a répondu ${response.status} avec un corps illisible.`, {
            statusCode: response.status,
            requestId: response.headers.get('Request-Id'),
            headers: response.headers,
            raw: text,
          })
        }
        Object.defineProperty(parsed, 'lastResponse', {
          value: {
            statusCode: response.status,
            headers: response.headers,
            requestId: response.headers.get('Request-Id'),
            idempotentReplayed: response.headers.get('Idempotent-Replayed') === 'true',
          } satisfies ResponseMeta,
          enumerable: false,
        })
        return parsed as OphelixResponse<T>
      }

      const error = OphelixError.fromResponse(response.status, parsed ?? text, response.headers)
      if (attempt < maxRetries && shouldRetry(response.status, error.code)) {
        await this.config.sleep(retryDelay(attempt, response.headers.get('Retry-After')))
        continue
      }
      throw error
    }
  }
}

function parse(text: string): unknown {
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

/** Ce qui vaut une nouvelle tentative : trop de requêtes, une panne passagère, une clé encore en cours. */
export function shouldRetry(statusCode: number, code: string | undefined): boolean {
  if (statusCode === 429 || statusCode >= 500) return true
  return statusCode === 409 && code === 'idempotency_key_in_progress'
}

/** `Retry-After` quand l'API le donne, sinon un délai qui double, de 0,5 à 8 secondes, avec un peu de hasard. */
export function retryDelay(attempt: number, retryAfter: string | null): number {
  const seconds = retryAfter === null ? Number.NaN : Number(retryAfter)
  if (Number.isFinite(seconds) && seconds >= 0) return Math.min(seconds * 1000, MAX_RETRY_AFTER_MS)
  const base = Math.min(500 * 2 ** attempt, 8000)
  return base / 2 + Math.random() * (base / 2)
}
