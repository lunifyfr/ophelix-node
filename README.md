# Ophelix pour Node

La bibliothèque Node officielle de l'[API Ophelix](https://docs.ophelix.fr) : la facturation de l'Assurance Maladie (FSE, SESAM-Vitale) par une API.

- Node 20.3 et plus, ESM et CommonJS, types TypeScript fournis.
- `fetch` natif, aucune dépendance.
- Un service par ressource, des types générés depuis la spécification OpenAPI, une classe par type d'erreur.
- Clé d'idempotence tirée pour chaque écriture, reprises sur 429 et 5xx, pagination par `for await`.
- Vérification de la signature des webhooks.

## Installation

```bash
npm install @ophelix/node
```

## Premier appel, en mode test

Créez une clé secrète dans **Développeurs › Clés** sur [app.ophelix.fr](https://app.ophelix.fr). Une clé `sk_test_` travaille sur le simulateur : elle ne touche ni l'Assurance Maladie ni une vraie carte.

```ts
import { Ophelix } from '@ophelix/node'

const ophelix = new Ophelix(process.env.OPHELIX_API_KEY!)

// Un praticien naît de la lecture de sa carte CPS, un patient de celle de sa carte Vitale.
const practitioner = await ophelix.practitioners.create({ card: 'cps_doctor' })
const coverage = await ophelix.coverages.create({ source: 'vitale_card', card: 'vitale_ok' })

const claim = await ophelix.claims.create({
  practitioner: practitioner.id,
  patient: coverage.patient,
  third_party_amo: true,
  context: { care_pathway: 'treating_doctor', common_law_accident: false },
  lines: [{ nomenclature: 'ngap', code: 'ZC', service_date: '2026-11-06', unit_price_cents: 2650 }],
})

await ophelix.claims.finalize(claim.id)
await ophelix.claims.secure(claim.id)

// En mode test, les retours de l'Assurance Maladie se déclenchent à la main.
await ophelix.testHelpers.claims.simulateReturn(claim.id, { scenario: 'arl_positive' })
const paid = await ophelix.testHelpers.claims.simulateReturn(claim.id, { scenario: 'payment' })

console.log(paid.status) // paid
```

En CommonJS : `const { Ophelix } = require('@ophelix/node')`. Le parcours complet est dans le [guide de démarrage](https://docs.ophelix.fr/guides/demarrage).

## Ce que fait le client

| Réglage | Par défaut | Sens |
| --- | --- | --- |
| `apiVersion` | celle que la bibliothèque épingle | L'en-tête `Ophelix-Version` |
| `baseUrl` | `https://api.ophelix.fr` | L'adresse de l'API, sans `/v1` |
| `maxRetries` | `2` | Les reprises après un 429, un 5xx ou une coupure |
| `timeout` | `60000` | Le délai d'une tentative, en millisecondes |
| `fetch` | celui de Node | Un autre `fetch`, pour un proxy ou des tests |

```ts
const ophelix = new Ophelix(key, { maxRetries: 4, timeout: 20_000 })
ophelix.livemode // false pour une clé de test
```

Chaque méthode accepte en dernier argument des options d'appel : `idempotencyKey`, `apiVersion`, `maxRetries`, `timeout`, `signal`.

### Objets

Les types de chaque objet et de chaque paramètre sont exportés : `Claim`, `Patient`, `ClaimsCreateParams`… Un champ lié rend un identifiant, ou l'objet avec `expand` :

```ts
const claim = await ophelix.claims.retrieve('clm_…', { expand: ['patient'] })
if (typeof claim.patient === 'object') claim.patient.quality
claim.lastResponse.requestId // à retrouver dans Développeurs › Requêtes
```

Un objet passé en paramètre part par son identifiant : `patient: claim.patient` marche, déplié ou non.

### Listes

Attendue, une liste rend la première page. Parcourue par `for await`, elle les rend toutes, en demandant la suivante quand la précédente est lue :

```ts
const page = await ophelix.claims.list({ status: 'paid', limit: 50 })
page.data
page.has_more

for await (const claim of ophelix.claims.list({ status: 'paid' })) {
  // toutes les factures payées
}

const first200 = await ophelix.claims.list({ status: 'paid' }).toArray({ limit: 200 })
```

### Idempotence et reprises

Chaque écriture porte une clé `Idempotency-Key` tirée pour elle, et la garde d'une reprise à l'autre : un 429, un 5xx ou une coupure se rejouent sans doubler l'écriture. Passez la vôtre pour rejouer un appel d'un processus à l'autre :

```ts
await ophelix.claims.create(params, { idempotencyKey: order.uuid })
```

## Erreurs

Une erreur de l'API rejette la sous-classe de son type, qui étend `OphelixError` :

| Classe | Type | Exemple |
| --- | --- | --- |
| `OphelixInvalidRequestError` | `invalid_request_error` | paramètre faux, objet inconnu |
| `OphelixAuthenticationError` | `authentication_error` | clé inconnue ou révoquée |
| `OphelixPermissionError` | `permission_error` | droit manquant sur une clé restreinte |
| `OphelixRateLimitError` | `rate_limit_error` | débit dépassé, après les reprises |
| `OphelixIdempotencyError` | `idempotency_error` | même clé, autre corps |
| `OphelixAPIError` | `api_error` | erreur d'Ophelix, moteur indisponible |

`OphelixConnectionError` dit que l'API n'a pas répondu.

```ts
import { OphelixInvalidRequestError } from '@ophelix/node'

try {
  await ophelix.claims.retrieve('clm_inconnu')
} catch (error) {
  if (error instanceof OphelixInvalidRequestError) {
    error.code      // resource_missing
    error.docUrl    // https://docs.ophelix.fr/erreurs#resource_missing
    error.requestId // req_…
  }
}
```

## Webhooks

Vérifiez chaque livraison sur le corps brut, avant tout décodage. Avec Express :

```ts
import express from 'express'
import { Ophelix, OphelixSignatureVerificationError } from '@ophelix/node'

const app = express()

app.post('/hook', express.raw({ type: 'application/json' }), (request, response) => {
  try {
    const event = Ophelix.webhooks.constructEvent(request.body, request.headers['ophelix-signature'], process.env.OPHELIX_WEBHOOK_SECRET!)
    if (event.type === 'claim.paid') {
      // event.data.object est la facture
    }
    response.sendStatus(200)
  } catch (error) {
    if (error instanceof OphelixSignatureVerificationError) return response.sendStatus(400)
    throw error
  }
})
```

Une livraison signée il y a plus de cinq minutes est refusée. `Ophelix.webhooks.generateTestHeader()` signe un corps pour tester votre point de terminaison.

## Pages web

Quand une page lit les cartes sur le poste où elle s'affiche, par le composant navigateur d'Ophelix, votre serveur garde la clé : il ouvre la session de la page, puis facture ce qu'elle a lu. La page ne lui envoie que l'identifiant de sa demande ; relisez-la avant de vous en servir.

```ts
const session = await ophelix.browserSessions.create({ origin: 'https://app.exemple.fr' })
// session.client_secret va à la page, session.id reste ici, lié à votre utilisateur.

const reading = await ophelix.workstationActions.retrieve(actionIdSentByThePage)
if (reading.type === 'read_vitale' && reading.status === 'succeeded' && reading.browser_session === session.id) {
  const draft = await ophelix.claims.create(
    { practitioner, patient: reading.result!.patient!, third_party_amo: true, context, lines },
    { idempotencyKey: `facture-${reading.id}` },
  )
  const claim = await ophelix.claims.finalize(draft.id)
  // claim.id retourne à la page, qui le fait signer par la CPS du poste.
}
```

Le parcours complet est dans le [guide des pages web](https://docs.ophelix.fr/guides/pages-web#facturer).

## Versions

La bibliothèque suit le versionnage sémantique. Chaque version épingle une version datée de l'API (`Ophelix.API_VERSION`) : une réponse n'y perd ni ne renomme jamais un champ. Voir [CHANGELOG.md](CHANGELOG.md).

## Licence

MIT. Voir [LICENSE](LICENSE).
