import { OphelixServices } from './generated/services'
import { API_VERSION, VERSION } from './generated/version'
import { HttpRequester } from './requester'
import { webhooks } from './webhooks'

export const DEFAULT_BASE_URL = 'https://api.ophelix.fr'

export interface OphelixConfig {
  /** La version de l'API. Par défaut, celle que cette version de la bibliothèque épingle. */
  apiVersion?: string
  /** L'adresse de l'API, sans `/v1`. */
  baseUrl?: string
  /** Le nombre de reprises après un 429, un 5xx ou une coupure. Par défaut, 2. */
  maxRetries?: number
  /** Le délai d'une tentative, en millisecondes. Par défaut, 60 secondes. */
  timeout?: number
  /** Un autre `fetch`, pour un proxy ou des tests. Par défaut, celui de Node. */
  fetch?: typeof fetch
  /** @internal L'attente entre deux tentatives. */
  sleep?: (milliseconds: number) => Promise<void>
}

const KEY_PATTERN = /^(sk|rk)_(test|live)_\S+$/

/**
 * Le client de l'API Ophelix. Une clé `sk_test_` ou `rk_test_` travaille en mode test, sur le
 * simulateur ; une clé `sk_live_` ou `rk_live_`, en production.
 *
 *   const ophelix = new Ophelix(process.env.OPHELIX_API_KEY!)
 *   const claim = await ophelix.claims.retrieve('clm_…')
 */
export class Ophelix extends OphelixServices {
  /** La version de l'API que cette version de la bibliothèque épingle. */
  static readonly API_VERSION = API_VERSION
  static readonly VERSION = VERSION
  /** Vérification des signatures de webhooks, sans client. */
  static readonly webhooks = webhooks

  readonly webhooks = webhooks
  /** Vrai pour une clé de production. */
  readonly livemode: boolean
  readonly apiVersion: string

  constructor(apiKey: string, config: OphelixConfig = {}) {
    if (typeof apiKey !== 'string' || !KEY_PATTERN.test(apiKey)) {
      throw new TypeError('Une clé Ophelix commence par sk_test_, sk_live_, rk_test_ ou rk_live_.')
    }
    const apiVersion = config.apiVersion ?? API_VERSION
    super(
      new HttpRequester({
        apiKey,
        apiVersion,
        baseUrl: (config.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, ''),
        maxRetries: config.maxRetries ?? 2,
        timeout: config.timeout ?? 60_000,
        userAgent: `ophelix-node/${VERSION} node/${process.version}`,
        fetch: config.fetch ?? globalThis.fetch,
        sleep: config.sleep ?? (milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds))),
      }),
    )
    this.livemode = apiKey.split('_')[1] === 'live'
    this.apiVersion = apiVersion
  }
}
