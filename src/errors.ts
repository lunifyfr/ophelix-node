/** Le corps `error` que l'API rend sur tout échec. */
export interface ErrorBody {
  type: string
  code: string
  message: string
  param?: string | null
  doc_url?: string
  request_id?: string
  errors?: Array<{ param: string; message: string }>
}

interface ErrorInit {
  type?: string
  code?: string
  param?: string | null
  docUrl?: string | null
  requestId?: string | null
  statusCode?: number | null
  errors?: Array<{ param: string; message: string }>
  headers?: Headers | null
  raw?: unknown
  cause?: unknown
}

/**
 * Toute erreur de la bibliothèque. Une réponse d'erreur de l'API donne la sous-classe de son
 * `type` ; `code` dit précisément ce qui s'est passé, et `docUrl` mène à sa page.
 */
export class OphelixError extends Error {
  override readonly name: string = 'OphelixError'
  /** Le type de l'erreur : `invalid_request_error`, `authentication_error`… */
  readonly type: string
  /** Le code de l'erreur, documenté sur https://docs.ophelix.fr/erreurs. */
  readonly code: string | undefined
  /** Le paramètre fautif, s'il y en a un. */
  readonly param: string | null
  readonly docUrl: string | null
  /** L'identifiant de la requête, à citer au support. */
  readonly requestId: string | null
  readonly statusCode: number | null
  /** Tous les champs fautifs, sur une erreur de validation. */
  readonly errors: Array<{ param: string; message: string }>
  readonly headers: Headers | null
  /** Le corps reçu, tel quel. */
  readonly raw: unknown

  constructor(message: string, init: ErrorInit = {}) {
    super(message, init.cause === undefined ? undefined : { cause: init.cause })
    this.type = init.type ?? 'api_error'
    this.code = init.code
    this.param = init.param ?? null
    this.docUrl = init.docUrl ?? null
    this.requestId = init.requestId ?? null
    this.statusCode = init.statusCode ?? null
    this.errors = init.errors ?? []
    this.headers = init.headers ?? null
    this.raw = init.raw
  }

  /** L'erreur qui correspond à une réponse non 2xx. */
  static fromResponse(statusCode: number, body: unknown, headers: Headers): OphelixError {
    const error = (body as { error?: ErrorBody } | null)?.error
    const requestId = error?.request_id ?? headers.get('Request-Id')
    const init: ErrorInit = {
      type: error?.type,
      code: error?.code,
      param: error?.param ?? null,
      docUrl: error?.doc_url ?? null,
      requestId,
      statusCode,
      errors: error?.errors ?? [],
      headers,
      raw: body,
    }
    const message = error?.message ?? `L'API a répondu ${statusCode} sans corps d'erreur lisible.`
    const Kind = ERROR_TYPES[error?.type ?? ''] ?? (statusCode === 429 ? OphelixRateLimitError : OphelixAPIError)
    return new Kind(message, init)
  }
}

/** Paramètre faux ou manquant, objet inconnu, état qui ne permet pas l'action. */
export class OphelixInvalidRequestError extends OphelixError {
  override readonly name = 'OphelixInvalidRequestError'
}

/** Clé absente, inconnue, révoquée ou expirée. */
export class OphelixAuthenticationError extends OphelixError {
  override readonly name = 'OphelixAuthenticationError'
}

/** La clé n'a pas le droit demandé, ou le mode ne le permet pas. */
export class OphelixPermissionError extends OphelixError {
  override readonly name = 'OphelixPermissionError'
}

/** Trop de requêtes : la bibliothèque a déjà réessayé. */
export class OphelixRateLimitError extends OphelixError {
  override readonly name = 'OphelixRateLimitError'
}

/** `Idempotency-Key` réutilisée avec un autre corps, ou encore en cours. */
export class OphelixIdempotencyError extends OphelixError {
  override readonly name = 'OphelixIdempotencyError'
}

/** Erreur du côté d'Ophelix, ou moteur indisponible. */
export class OphelixAPIError extends OphelixError {
  override readonly name = 'OphelixAPIError'
}

/** Le réseau a coupé, ou l'API n'a pas répondu dans le délai. */
export class OphelixConnectionError extends OphelixError {
  override readonly name = 'OphelixConnectionError'
}

/** La signature d'un webhook ne correspond pas, ou elle est trop ancienne. */
export class OphelixSignatureVerificationError extends OphelixError {
  override readonly name = 'OphelixSignatureVerificationError'
}

const ERROR_TYPES: Record<string, new (message: string, init: ErrorInit) => OphelixError> = {
  invalid_request_error: OphelixInvalidRequestError,
  authentication_error: OphelixAuthenticationError,
  permission_error: OphelixPermissionError,
  rate_limit_error: OphelixRateLimitError,
  idempotency_error: OphelixIdempotencyError,
  api_error: OphelixAPIError,
}
