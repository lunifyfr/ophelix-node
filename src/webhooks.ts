import { createHmac, timingSafeEqual } from 'node:crypto'
import { OphelixSignatureVerificationError } from './errors'
import type { Event } from './generated/types'

/** L'en-tête qui porte la signature d'une livraison. */
export const SIGNATURE_HEADER = 'Ophelix-Signature'

/** L'écart toléré entre l'horodatage signé et l'horloge du serveur, en secondes. */
export const DEFAULT_TOLERANCE = 300

export interface VerifyOptions {
  /** En secondes. `0` désactive le contrôle de fraîcheur : à réserver aux tests. */
  tolerance?: number
  /** L'heure courante, en secondes Unix. Par défaut, l'horloge du serveur. */
  now?: number
}

type Payload = string | Uint8Array

/** `v1` : le HMAC-SHA256, en hexadécimal, de `t`, d'un point et du corps brut. */
export function computeSignature(payload: Payload, secret: string, timestamp: number): string {
  return createHmac('sha256', secret).update(`${timestamp}.`).update(payload).digest('hex')
}

function parseHeader(header: string): { timestamp: number; signatures: string[] } | null {
  let timestamp = Number.NaN
  const signatures: string[] = []
  for (const part of header.split(',')) {
    const [key, value] = part.trim().split('=', 2)
    if (key === 't' && value && /^\d+$/.test(value)) timestamp = Number(value)
    if (key === 'v1' && value && /^[0-9a-f]{64}$/.test(value)) signatures.push(value)
  }
  return Number.isFinite(timestamp) && signatures.length ? { timestamp, signatures } : null
}

function assertPayload(payload: unknown): asserts payload is Payload {
  if (typeof payload !== 'string' && !(payload instanceof Uint8Array)) {
    throw new TypeError('Le corps brut est attendu, tel que reçu : une chaîne ou un Buffer, pas un objet déjà décodé.')
  }
}

/**
 * Vérifie qu'une livraison vient d'Ophelix, et qu'elle est fraîche. Lève
 * `OphelixSignatureVerificationError` sinon.
 */
export function verifySignature(
  payload: Payload,
  header: string | string[] | null | undefined,
  secret: string,
  options: VerifyOptions = {},
): void {
  assertPayload(payload)
  const value = Array.isArray(header) ? header[0] : header
  if (!value) throw new OphelixSignatureVerificationError(`L'en-tête ${SIGNATURE_HEADER} manque.`)

  const parsed = parseHeader(value)
  if (!parsed) throw new OphelixSignatureVerificationError(`L'en-tête ${SIGNATURE_HEADER} est mal formé.`)

  const tolerance = options.tolerance ?? DEFAULT_TOLERANCE
  const now = options.now ?? Math.floor(Date.now() / 1000)
  if (tolerance > 0 && Math.abs(now - parsed.timestamp) > tolerance) {
    throw new OphelixSignatureVerificationError("L'horodatage de la signature sort de la tolérance : la livraison peut être rejouée.")
  }

  const expected = Buffer.from(computeSignature(payload, secret, parsed.timestamp))
  const matches = parsed.signatures.some(signature => timingSafeEqual(expected, Buffer.from(signature)))
  if (!matches)
    throw new OphelixSignatureVerificationError('La signature ne correspond pas au corps : vérifiez le secret et le corps brut.')
}

/** Vérifie la signature, puis rend l'événement décodé. */
export function constructEvent(
  payload: Payload,
  header: string | string[] | null | undefined,
  secret: string,
  options: VerifyOptions = {},
): Event {
  verifySignature(payload, header, secret, options)
  const text = typeof payload === 'string' ? payload : new TextDecoder().decode(payload)
  return JSON.parse(text) as Event
}

/** Un en-tête signé, pour tester son propre point de terminaison. */
export function generateTestHeader({ payload, secret, timestamp }: { payload: Payload; secret: string; timestamp?: number }): string {
  const t = timestamp ?? Math.floor(Date.now() / 1000)
  return `t=${t},v1=${computeSignature(payload, secret, t)}`
}

export const webhooks = { SIGNATURE_HEADER, DEFAULT_TOLERANCE, computeSignature, verifySignature, constructEvent, generateTestHeader }
