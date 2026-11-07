/** Un objet rendu par l'API, passé en paramètre, part par son identifiant. */
export function asIdentifier(value: unknown): unknown {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const candidate = value as { id?: unknown; object?: unknown }
    if (typeof candidate.id === 'string' && typeof candidate.object === 'string') return candidate.id
  }
  return value
}

/**
 * Une chaîne de requête comme l'API la lit : `expand[]=patient`, `created[gte]=1793890000`.
 * Une date devient un horodatage Unix en secondes, `null` et `undefined` disparaissent.
 */
export function encodeQuery(params: object | undefined): string {
  const parts: string[] = []

  const add = (key: string, raw: unknown): void => {
    const value = asIdentifier(raw)
    if (value === undefined || value === null) return
    if (Array.isArray(value)) {
      for (const item of value) add(`${key}[]`, item)
      return
    }
    if (value instanceof Date) {
      add(key, Math.floor(value.getTime() / 1000))
      return
    }
    if (typeof value === 'object') {
      for (const [name, item] of Object.entries(value)) add(`${key}[${name}]`, item)
      return
    }
    parts.push(`${encodeKey(key)}=${encodeURIComponent(String(value))}`)
  }

  for (const [key, value] of Object.entries(params ?? {})) add(key, value)
  return parts.join('&')
}

/** Les crochets restent lisibles : `expand[]` plutôt que `expand%5B%5D`. */
function encodeKey(key: string): string {
  return encodeURIComponent(key).replace(/%5B/gi, '[').replace(/%5D/gi, ']')
}
