// Généré par sdks/scripts/generate.ts depuis la spécification OpenAPI : ne pas modifier.

import type { ListPromise } from '../list'
import type { OphelixResponse, RequestOptions, Requester } from '../requester'
import { segment } from '../requester'
import type * as types from './types'

/** Les routes `testHelpers.batches` de l'API. */
export class TestHelpersBatchesService {
  constructor(protected readonly requester: Requester) {}

  /**
   * Déclencher un accusé simulé.
   *
   * Le simulateur écrit le fichier d'accusés de l'organisme destinataire, qui suit le chemin d'un
   * fichier déposé. `arl_positive` acquitte le lot et ses factures. `arl_negative` le refuse avec
   * `code` : `1001` refuse tout le lot (par défaut), `2004` désigne sa première facture, rejetée.
   * Mode test seulement.
   *
   * `POST /v1/test-helpers/batches/{batch}/acknowledgment`
   */
  acknowledgment(batch: string, params: types.TestHelpersBatchesAcknowledgmentParams, options?: RequestOptions): Promise<OphelixResponse<types.Batch>> {
    return this.requester.request<types.Batch>({ method: 'POST', path: `/v1/test-helpers/batches/${segment(batch)}/acknowledgment`, params, options })
  }
}

/** Les routes `testHelpers.claims` de l'API. */
export class TestHelpersClaimsService {
  constructor(protected readonly requester: Requester) {}

  /**
   * Créer une facture de test.
   *
   * Lit deux cartes du simulateur et ouvre un brouillon avec une prestation fictive.
   *
   * `POST /v1/test-helpers/claims`
   */
  create(params?: types.TestHelpersClaimsCreateParams, options?: RequestOptions): Promise<OphelixResponse<types.Claim>> {
    return this.requester.request<types.Claim>({ method: 'POST', path: '/v1/test-helpers/claims', params, options })
  }

  /**
   * Déclencher un retour simulé.
   *
   * `arl_positive`, `arl_negative`, `payment`, `partial_payment` ou `rejection`.
   *
   * `POST /v1/test-helpers/claims/{claim}/returns`
   */
  simulateReturn(claim: string, params: types.TestHelpersClaimsSimulateReturnParams, options?: RequestOptions): Promise<OphelixResponse<types.Claim>> {
    return this.requester.request<types.Claim>({ method: 'POST', path: `/v1/test-helpers/claims/${segment(claim)}/returns`, params, options })
  }
}

/** Les routes `testHelpers.priorAgreements` de l'API. */
export class TestHelpersPriorAgreementsService {
  constructor(protected readonly requester: Requester) {}

  /**
   * Simuler la réponse de la caisse à une entente préalable.
   *
   * Sur une demande envoyée : `approved`, `refused`, ou `no_answer`, le silence de la caisse
   * jusqu'au bout du délai, sans l'attendre.
   *
   * `POST /v1/test-helpers/prior-agreements/{agreement}/response`
   */
  response(agreement: string, params: types.TestHelpersPriorAgreementsResponseParams, options?: RequestOptions): Promise<OphelixResponse<types.PriorAgreement>> {
    return this.requester.request<types.PriorAgreement>({ method: 'POST', path: `/v1/test-helpers/prior-agreements/${segment(agreement)}/response`, params, options })
  }
}

/** Les routes `claims.lines` de l'API. */
export class ClaimsLinesService {
  constructor(protected readonly requester: Requester) {}

  /**
   * Ajouter une prestation à un brouillon.
   *
   * Rend la facture retarifée.
   *
   * `POST /v1/claims/{claim}/lines`
   */
  create(claim: string, params: types.ClaimsLinesCreateParams, options?: RequestOptions): Promise<OphelixResponse<types.Claim>> {
    return this.requester.request<types.Claim>({ method: 'POST', path: `/v1/claims/${segment(claim)}/lines`, params, options })
  }

  /**
   * Corriger une prestation d'un brouillon.
   *
   * Rend la facture retarifée.
   *
   * `PATCH /v1/claims/{claim}/lines/{line}`
   */
  update(claim: string, line: string, params?: types.ClaimsLinesUpdateParams, options?: RequestOptions): Promise<OphelixResponse<types.Claim>> {
    return this.requester.request<types.Claim>({ method: 'PATCH', path: `/v1/claims/${segment(claim)}/lines/${segment(line)}`, params, options })
  }

  /**
   * Retirer une prestation d'un brouillon.
   *
   * Rend la facture retarifée.
   *
   * `DELETE /v1/claims/{claim}/lines/{line}`
   */
  delete(claim: string, line: string, params?: types.ClaimsLinesDeleteParams, options?: RequestOptions): Promise<OphelixResponse<types.Claim>> {
    return this.requester.request<types.Claim>({ method: 'DELETE', path: `/v1/claims/${segment(claim)}/lines/${segment(line)}`, params, options })
  }
}

/** Les routes `acknowledgments` de l'API. */
export class AcknowledgmentsService {
  constructor(protected readonly requester: Requester) {}

  /**
   * Lister les accusés de réception.
   *
   * Du plus récent au plus ancien. Un accusé ne porte ni acte ni patient.
   *
   * `GET /v1/acknowledgments`
   */
  list(params?: types.AcknowledgmentsListParams, options?: RequestOptions): ListPromise<types.Acknowledgment> {
    return this.requester.list<types.Acknowledgment>({ path: '/v1/acknowledgments', params, options })
  }

  /**
   * Déposer un fichier d'accusés.
   *
   * Traduit chaque accusé du fichier, le rattache au lot envoyé qu'il désigne et l'applique : le lot
   * est acquitté, ou refusé avec son code. Un accusé sans lot en attente est gardé non rapproché. La
   * traduction passe par le moteur : 503 en production tant qu'il n'est pas raccordé.
   *
   * `POST /v1/acknowledgments`
   */
  create(params: types.AcknowledgmentsCreateParams, options?: RequestOptions): ListPromise<types.Acknowledgment> {
    return this.requester.list<types.Acknowledgment>({ path: '/v1/acknowledgments', params, options })
  }

  /**
   * Lire un accusé de réception.
   *
   * `GET /v1/acknowledgments/{acknowledgment}`
   */
  retrieve(acknowledgment: string, params?: types.AcknowledgmentsRetrieveParams, options?: RequestOptions): Promise<OphelixResponse<types.Acknowledgment>> {
    return this.requester.request<types.Acknowledgment>({ method: 'GET', path: `/v1/acknowledgments/${segment(acknowledgment)}`, params, options })
  }
}

/** Les routes `acts` de l'API. */
export class ActsService {
  constructor(protected readonly requester: Requester) {}

  /**
   * Chercher un acte.
   *
   * L'aide à la cotation : les actes NGAP et CCAM qu'un code ou un libellé désigne, dans les
   * référentiels chargés à la date des soins. Le code exact vient d'abord, puis les codes qui
   * commencent par la recherche, puis les libellés qui la contiennent. Une liste courte, sans page
   * suivante : `has_more` dit qu'il faut préciser.
   *
   * `GET /v1/acts`
   */
  list(params?: types.ActsListParams, options?: RequestOptions): Promise<OphelixResponse<types.ActList>> {
    return this.requester.request<types.ActList>({ method: 'GET', path: '/v1/acts', params, options })
  }
}

/** Les routes `requests` de l'API. */
export class RequestsService {
  constructor(protected readonly requester: Requester) {}

  /**
   * Lister les requêtes.
   *
   * `status` accepte un code (`404`) ou une famille (`4xx`), `route` une route, `key` une clé,
   * `object` l'identifiant d'un objet visé par le chemin.
   *
   * `GET /v1/requests`
   */
  list(params?: types.RequestsListParams, options?: RequestOptions): ListPromise<types.ApiRequest> {
    return this.requester.list<types.ApiRequest>({ path: '/v1/requests', params, options })
  }

  /**
   * Lire une requête.
   *
   * `GET /v1/requests/{apiRequest}`
   */
  retrieve(apiRequest: string, params?: types.RequestsRetrieveParams, options?: RequestOptions): Promise<OphelixResponse<types.ApiRequest>> {
    return this.requester.request<types.ApiRequest>({ method: 'GET', path: `/v1/requests/${segment(apiRequest)}`, params, options })
  }
}

/** Les routes `testHelpers` de l'API. */
export class TestHelpersService {
  readonly batches: TestHelpersBatchesService
  readonly claims: TestHelpersClaimsService
  readonly priorAgreements: TestHelpersPriorAgreementsService

  constructor(protected readonly requester: Requester) {
    this.batches = new TestHelpersBatchesService(requester)
    this.claims = new TestHelpersClaimsService(requester)
    this.priorAgreements = new TestHelpersPriorAgreementsService(requester)
  }

  /**
   * Lister les scénarios de test.
   *
   * Cartes Vitale, cartes CPS et retours simulés, avec leur identifiant.
   *
   * `GET /v1/test-helpers/scenarios`
   */
  scenarios(params?: types.TestHelpersScenariosParams, options?: RequestOptions): Promise<OphelixResponse<types.TestScenarios>> {
    return this.requester.request<types.TestScenarios>({ method: 'GET', path: '/v1/test-helpers/scenarios', params, options })
  }

  /**
   * Simuler la lecture d'une carte.
   *
   * `POST /v1/test-helpers/card-reads`
   */
  readCard(params: types.TestHelpersReadCardParams, options?: RequestOptions): Promise<OphelixResponse<types.CardRead>> {
    return this.requester.request<types.CardRead>({ method: 'POST', path: '/v1/test-helpers/card-reads', params, options })
  }

  /**
   * Lire le fil du mode test.
   *
   * Ce qui s'est passé depuis les deux curseurs : les événements, avec le corps exact d'une
   * livraison, et les requêtes, en résumé. Sans curseur, le fil commence maintenant.
   * `signing_secret` signe les événements relayés vers un serveur local : il se déduit de la clé et
   * n'est celui d'aucun point de terminaison. Cette lecture ne s'inscrit pas dans les requêtes.
   *
   * `GET /v1/test-helpers/feed`
   */
  feed(params?: types.TestHelpersFeedParams, options?: RequestOptions): Promise<OphelixResponse<types.TestFeed>> {
    return this.requester.request<types.TestFeed>({ method: 'GET', path: '/v1/test-helpers/feed', params, options })
  }
}

/** Les routes `batches` de l'API. */
export class BatchesService {
  constructor(protected readonly requester: Requester) {}

  /**
   * Lister les lots.
   *
   * Du plus récent au plus ancien. Un lot ne porte ni acte ni patient.
   *
   * `GET /v1/batches`
   */
  list(params?: types.BatchesListParams, options?: RequestOptions): ListPromise<types.Batch> {
    return this.requester.list<types.Batch>({ path: '/v1/batches', params, options })
  }

  /**
   * Voir le prochain envoi.
   *
   * Les lots que formeront les factures sécurisées qui attendent, et l'heure de leur envoi.
   *
   * `GET /v1/batches/upcoming`
   */
  upcoming(params?: types.BatchesUpcomingParams, options?: RequestOptions): Promise<OphelixResponse<types.UpcomingBatches>> {
    return this.requester.request<types.UpcomingBatches>({ method: 'GET', path: '/v1/batches/upcoming', params, options })
  }

  /**
   * Lire un lot.
   *
   * `GET /v1/batches/{batch}`
   */
  retrieve(batch: string, params?: types.BatchesRetrieveParams, options?: RequestOptions): Promise<OphelixResponse<types.Batch>> {
    return this.requester.request<types.Batch>({ method: 'GET', path: `/v1/batches/${segment(batch)}`, params, options })
  }

  /**
   * Envoyer maintenant.
   *
   * Met en lots et envoie tout de suite les factures sécurisées qui attendent, sans attendre l'heure
   * d'envoi. Le moteur réel n'est pas encore raccordé : 503 en production.
   *
   * `POST /v1/batches/send`
   */
  send(params?: types.BatchesSendParams, options?: RequestOptions): ListPromise<types.Batch> {
    return this.requester.list<types.Batch>({ path: '/v1/batches/send', params, options })
  }

  /**
   * Reconstituer un lot refusé.
   *
   * Après un accusé négatif, forme un nouveau lot avec les mêmes factures, sauf celle que l'accusé
   * désigne, déjà rejetée. Le nouveau lot part au prochain envoi. Un lot reconstitué ne se
   * reconstitue pas : ses factures se traitent à la main.
   *
   * `POST /v1/batches/{batch}/rebuild`
   */
  rebuild(batch: string, params?: types.BatchesRebuildParams, options?: RequestOptions): Promise<OphelixResponse<types.Batch>> {
    return this.requester.request<types.Batch>({ method: 'POST', path: `/v1/batches/${segment(batch)}/rebuild`, params, options })
  }
}

/** Les routes `browserOrigins` de l'API. */
export class BrowserOriginsService {
  constructor(protected readonly requester: Requester) {}

  /**
   * Lister les origines autorisées.
   *
   * Les pages qui peuvent piloter les postes de l'organisation, dans le mode de la requête.
   *
   * `GET /v1/browser-origins`
   */
  list(params?: types.BrowserOriginsListParams, options?: RequestOptions): ListPromise<types.BrowserOrigin> {
    return this.requester.list<types.BrowserOrigin>({ path: '/v1/browser-origins', params, options })
  }

  /**
   * Autoriser une origine.
   *
   * Une page de cette origine pourra recevoir une session et demander une lecture à un poste.
   * L'ajouter deux fois rend la même origine.
   *
   * `POST /v1/browser-origins`
   */
  create(params: types.BrowserOriginsCreateParams, options?: RequestOptions): Promise<OphelixResponse<types.BrowserOrigin>> {
    return this.requester.request<types.BrowserOrigin>({ method: 'POST', path: '/v1/browser-origins', params, options })
  }

  /**
   * Retirer une origine.
   *
   * Ses sessions cessent à la requête suivante.
   *
   * `DELETE /v1/browser-origins/{browserOrigin}`
   */
  delete(browserOrigin: string, params?: types.BrowserOriginsDeleteParams, options?: RequestOptions): Promise<OphelixResponse<types.DeletedObject>> {
    return this.requester.request<types.DeletedObject>({ method: 'DELETE', path: `/v1/browser-origins/${segment(browserOrigin)}`, params, options })
  }
}

/** Les routes `browserSessions` de l'API. */
export class BrowserSessionsService {
  constructor(protected readonly requester: Requester) {}

  /**
   * Lire une session de page.
   *
   * Dit notamment à quel poste la page s'est associée.
   *
   * `GET /v1/browser-sessions/{browserSession}`
   */
  retrieve(browserSession: string, params?: types.BrowserSessionsRetrieveParams, options?: RequestOptions): Promise<OphelixResponse<types.BrowserSession>> {
    return this.requester.request<types.BrowserSession>({ method: 'GET', path: `/v1/browser-sessions/${segment(browserSession)}`, params, options })
  }

  /**
   * Ouvrir une session de page.
   *
   * À appeler depuis votre serveur, avec votre clé secrète, puis à passer à la page par
   * `client_secret`. La page s'en sert pour piloter un poste, sans jamais voir de clé d'API. Valable
   * trente minutes, pour une seule origine.
   *
   * `POST /v1/browser-sessions`
   */
  create(params: types.BrowserSessionsCreateParams, options?: RequestOptions): Promise<OphelixResponse<types.BrowserSession>> {
    return this.requester.request<types.BrowserSession>({ method: 'POST', path: '/v1/browser-sessions', params, options })
  }
}

/** Les routes `claimImports` de l'API. */
export class ClaimImportsService {
  constructor(protected readonly requester: Requester) {}

  /**
   * Relire le rapport d'un import.
   *
   * `GET /v1/claim-imports/{claimImport}`
   */
  retrieve(claimImport: string, params?: types.ClaimImportsRetrieveParams, options?: RequestOptions): Promise<OphelixResponse<types.ClaimImport>> {
    return this.requester.request<types.ClaimImport>({ method: 'GET', path: `/v1/claim-imports/${segment(claimImport)}`, params, options })
  }

  /**
   * Importer des prestations.
   *
   * Un message HPRIM Santé de facturation (contexte FAC) : chaque segment FAC ouvre une facture en
   * brouillon pour son patient, déjà connu. Rend le rapport : factures ouvertes, segments refusés et
   * pourquoi. Le message n'est pas gardé.
   *
   * `POST /v1/claim-imports`
   */
  create(params: types.ClaimImportsCreateParams, options?: RequestOptions): Promise<OphelixResponse<types.ClaimImport>> {
    return this.requester.request<types.ClaimImport>({ method: 'POST', path: '/v1/claim-imports', params, options })
  }
}

/** Les routes `claims` de l'API. */
export class ClaimsService {
  readonly lines: ClaimsLinesService

  constructor(protected readonly requester: Requester) {
    this.lines = new ClaimsLinesService(requester)
  }

  /**
   * Lister les factures.
   *
   * Chaque facture rendue laisse une trace dans le journal d'audit.
   *
   * `GET /v1/claims`
   */
  list(params?: types.ClaimsListParams, options?: RequestOptions): ListPromise<types.Claim> {
    return this.requester.list<types.Claim>({ path: '/v1/claims', params, options })
  }

  /**
   * Ouvrir un brouillon de facture.
   *
   * Un brouillon s'enregistre même incomplet. `validate` dit ce qui manque.
   *
   * `POST /v1/claims`
   */
  create(params: types.ClaimsCreateParams, options?: RequestOptions): Promise<OphelixResponse<types.Claim>> {
    return this.requester.request<types.Claim>({ method: 'POST', path: '/v1/claims', params, options })
  }

  /**
   * Lire une facture.
   *
   * `GET /v1/claims/{claim}`
   */
  retrieve(claim: string, params?: types.ClaimsRetrieveParams, options?: RequestOptions): Promise<OphelixResponse<types.Claim>> {
    return this.requester.request<types.Claim>({ method: 'GET', path: `/v1/claims/${segment(claim)}`, params, options })
  }

  /**
   * Modifier un brouillon.
   *
   * Change le contexte de facturation et retarife. Seul un brouillon se modifie.
   *
   * `PATCH /v1/claims/{claim}`
   */
  update(claim: string, params?: types.ClaimsUpdateParams, options?: RequestOptions): Promise<OphelixResponse<types.Claim>> {
    return this.requester.request<types.Claim>({ method: 'PATCH', path: `/v1/claims/${segment(claim)}`, params, options })
  }

  /**
   * Valider une facture à blanc.
   *
   * Rend toutes les règles enfreintes d'un coup, avec la ligne visée, et les alertes à part. Chaque
   * constat cite l'identifiant de sa règle. Rien ne change.
   *
   * `POST /v1/claims/{claim}/validate`
   */
  validate(claim: string, params?: types.ClaimsValidateParams, options?: RequestOptions): Promise<OphelixResponse<types.ClaimValidation>> {
    return this.requester.request<types.ClaimValidation>({ method: 'POST', path: `/v1/claims/${segment(claim)}/validate`, params, options })
  }

  /**
   * Passer une facture à prêt.
   *
   * Un brouillon invalide répond 422 `claim_invalid`, avec les mêmes `violations` que `validate`.
   *
   * `POST /v1/claims/{claim}/finalize`
   */
  finalize(claim: string, params?: types.ClaimsFinalizeParams, options?: RequestOptions): Promise<OphelixResponse<types.Claim>> {
    return this.requester.request<types.Claim>({ method: 'POST', path: `/v1/claims/${segment(claim)}/finalize`, params, options })
  }

  /**
   * Sécuriser une facture.
   *
   * En mode test, le simulateur signe. Le moteur réel n'est pas encore raccordé : 503.
   *
   * `POST /v1/claims/{claim}/secure`
   */
  secure(claim: string, params?: types.ClaimsSecureParams, options?: RequestOptions): Promise<OphelixResponse<types.Claim>> {
    return this.requester.request<types.Claim>({ method: 'POST', path: `/v1/claims/${segment(claim)}/secure`, params, options })
  }

  /**
   * Annuler une facture.
   *
   * Possible jusqu'à la sécurisation. Une facture mise en lot ne s'annule plus.
   *
   * `POST /v1/claims/{claim}/cancel`
   */
  cancel(claim: string, params?: types.ClaimsCancelParams, options?: RequestOptions): Promise<OphelixResponse<types.Claim>> {
    return this.requester.request<types.Claim>({ method: 'POST', path: `/v1/claims/${segment(claim)}/cancel`, params, options })
  }

  /**
   * Corriger et réémettre une facture rejetée.
   *
   * Copie la facture rejetée en brouillon lié à l'original (`replaces`), avec ses prestations et son
   * contexte. `editable` dit ce que les rejets laissent corriger. La copie se valide et se signe
   * comme une facture neuve, avec un nouveau numéro ; signée, elle remplace l'original, qui passe à
   * `reissued`.
   *
   * `POST /v1/claims/{claim}/reissue`
   */
  reissue(claim: string, params?: types.ClaimsReissueParams, options?: RequestOptions): Promise<OphelixResponse<types.Claim>> {
    return this.requester.request<types.Claim>({ method: 'POST', path: `/v1/claims/${segment(claim)}/reissue`, params, options })
  }
}

/** Les routes `coverages` de l'API. */
export class CoveragesService {
  constructor(protected readonly requester: Requester) {}

  /**
   * Lire une Coverage.
   *
   * `GET /v1/coverages/{coverage}`
   */
  retrieve(coverage: string, params?: types.CoveragesRetrieveParams, options?: RequestOptions): Promise<OphelixResponse<types.Coverage>> {
    return this.requester.request<types.Coverage>({ method: 'GET', path: `/v1/coverages/${segment(coverage)}`, params, options })
  }

  /**
   * Lire les droits d'un patient.
   *
   * Chaque lecture crée une nouvelle Coverage, et le patient s'il est nouveau. Une Coverage ne se
   * modifie jamais. `source: manual` saisit les droits en mode dégradé.
   *
   * `POST /v1/coverages`
   */
  create(params: types.CoveragesCreateParams, options?: RequestOptions): Promise<OphelixResponse<types.Coverage>> {
    return this.requester.request<types.Coverage>({ method: 'POST', path: '/v1/coverages', params, options })
  }
}

/** Les routes `events` de l'API. */
export class EventsService {
  constructor(protected readonly requester: Requester) {}

  /**
   * Lister les événements.
   *
   * Du plus récent au plus ancien. `type` accepte un joker : `claim.*`. `object` retient les
   * événements d'un objet, `request` ceux d'une requête, `created[gte]` et `created[lte]` bornent la
   * date, en secondes depuis l'époque Unix.
   *
   * `GET /v1/events`
   */
  list(params?: types.EventsListParams, options?: RequestOptions): ListPromise<types.Event> {
    return this.requester.list<types.Event>({ path: '/v1/events', params, options })
  }

  /**
   * Lire un événement.
   *
   * `GET /v1/events/{event}`
   */
  retrieve(event: string, params?: types.EventsRetrieveParams, options?: RequestOptions): Promise<OphelixResponse<types.Event>> {
    return this.requester.request<types.Event>({ method: 'GET', path: `/v1/events/${segment(event)}`, params, options })
  }
}

/** Les routes `patients` de l'API. */
export class PatientsService {
  constructor(protected readonly requester: Requester) {}

  /**
   * Exporter les données d'un patient.
   *
   * Tout ce qu'Ophelix garde d'un patient : identité, lectures de droits, factures et prestations,
   * devis, ententes préalables, paiements et rejets. L'export laisse sa trace dans le journal
   * d'audit.
   *
   * `GET /v1/patients/{patient}/export`
   */
  export(patient: string, params?: types.PatientsExportParams, options?: RequestOptions): Promise<OphelixResponse<types.PatientExport>> {
    return this.requester.request<types.PatientExport>({ method: 'GET', path: `/v1/patients/${segment(patient)}/export`, params, options })
  }

  /**
   * Effacer un patient.
   *
   * Efface ce qui n'est sous aucune obligation de conservation, l'identité comprise quand rien ne
   * reste. Une facture signée reste, avec ce qu'elle cite : `retained` dit pourquoi et jusqu'à
   * quand. Rejouable : un nouvel appel, une fois la conservation finie, efface le reste.
   *
   * `POST /v1/patients/{patient}/erase`
   */
  erase(patient: string, params?: types.PatientsEraseParams, options?: RequestOptions): Promise<OphelixResponse<types.PatientErasure>> {
    return this.requester.request<types.PatientErasure>({ method: 'POST', path: `/v1/patients/${segment(patient)}/erase`, params, options })
  }

  /**
   * Lister les patients.
   *
   * Chaque patient rendu laisse une trace dans le journal d'audit. `name` et `nir` retrouvent un
   * patient sans que son identité, chiffrée, passe en clair dans la base.
   *
   * `GET /v1/patients`
   */
  list(params?: types.PatientsListParams, options?: RequestOptions): ListPromise<types.Patient> {
    return this.requester.list<types.Patient>({ path: '/v1/patients', params, options })
  }

  /**
   * Lire un patient.
   *
   * `GET /v1/patients/{patient}`
   */
  retrieve(patient: string, params?: types.PatientsRetrieveParams, options?: RequestOptions): Promise<OphelixResponse<types.Patient>> {
    return this.requester.request<types.Patient>({ method: 'GET', path: `/v1/patients/${segment(patient)}`, params, options })
  }

  /**
   * Lister les droits lus d'un patient.
   *
   * Du plus récent au plus ancien : la première Coverage est la dernière lecture.
   *
   * `GET /v1/patients/{patient}/coverages`
   */
  coverages(patient: string, params?: types.PatientsCoveragesParams, options?: RequestOptions): ListPromise<types.Coverage> {
    return this.requester.list<types.Coverage>({ path: `/v1/patients/${segment(patient)}/coverages`, params, options })
  }
}

/** Les routes `payments` de l'API. */
export class PaymentsService {
  constructor(protected readonly requester: Requester) {}

  /**
   * Lister les paiements.
   *
   * Ce que les retours de paiement versent ou retiennent, du plus récent au plus ancien.
   *
   * `GET /v1/payments`
   */
  list(params?: types.PaymentsListParams, options?: RequestOptions): ListPromise<types.Payment> {
    return this.requester.list<types.Payment>({ path: '/v1/payments', params, options })
  }

  /**
   * Lire un paiement.
   *
   * `GET /v1/payments/{payment}`
   */
  retrieve(payment: string, params?: types.PaymentsRetrieveParams, options?: RequestOptions): Promise<OphelixResponse<types.Payment>> {
    return this.requester.request<types.Payment>({ method: 'GET', path: `/v1/payments/${segment(payment)}`, params, options })
  }

  /**
   * Rapprocher un paiement à la main.
   *
   * Rattache à une facture un retour que le rapprochement automatique n'a pas reconnu : ce paiement
   * et tout ce que porte le même retour. Rend la facture, dans son nouvel état.
   *
   * `POST /v1/payments/{payment}/match`
   */
  match(payment: string, params: types.PaymentsMatchParams, options?: RequestOptions): Promise<OphelixResponse<types.Claim>> {
    return this.requester.request<types.Claim>({ method: 'POST', path: `/v1/payments/${segment(payment)}/match`, params, options })
  }
}

/** Les routes `practitioners` de l'API. */
export class PractitionersService {
  constructor(protected readonly requester: Requester) {}

  /**
   * Lister les praticiens.
   *
   * `GET /v1/practitioners`
   */
  list(params?: types.PractitionersListParams, options?: RequestOptions): ListPromise<types.Practitioner> {
    return this.requester.list<types.Practitioner>({ path: '/v1/practitioners', params, options })
  }

  /**
   * Lire une carte de praticien.
   *
   * Crée le praticien avec toutes ses situations, ou le remet à jour s'il existe déjà. Ses
   * situations viennent de la carte et ne se saisissent pas.
   *
   * `POST /v1/practitioners`
   */
  create(params: types.PractitionersCreateParams, options?: RequestOptions): Promise<OphelixResponse<types.Practitioner>> {
    return this.requester.request<types.Practitioner>({ method: 'POST', path: '/v1/practitioners', params, options })
  }

  /**
   * Lire un praticien.
   *
   * `GET /v1/practitioners/{practitioner}`
   */
  retrieve(practitioner: string, params?: types.PractitionersRetrieveParams, options?: RequestOptions): Promise<OphelixResponse<types.Practitioner>> {
    return this.requester.request<types.Practitioner>({ method: 'GET', path: `/v1/practitioners/${segment(practitioner)}`, params, options })
  }

  /**
   * Modifier un praticien.
   *
   * Règle l'heure de l'envoi quotidien de ses lots. Le reste vient de sa carte.
   *
   * `PATCH /v1/practitioners/{practitioner}`
   */
  update(practitioner: string, params: types.PractitionersUpdateParams, options?: RequestOptions): Promise<OphelixResponse<types.Practitioner>> {
    return this.requester.request<types.Practitioner>({ method: 'PATCH', path: `/v1/practitioners/${segment(practitioner)}`, params, options })
  }

  /**
   * Suspendre un praticien.
   *
   * Une relecture de sa carte ne lève pas la suspension.
   *
   * `POST /v1/practitioners/{practitioner}/suspend`
   */
  suspend(practitioner: string, params?: types.PractitionersSuspendParams, options?: RequestOptions): Promise<OphelixResponse<types.Practitioner>> {
    return this.requester.request<types.Practitioner>({ method: 'POST', path: `/v1/practitioners/${segment(practitioner)}/suspend`, params, options })
  }

  /**
   * Lever une suspension.
   *
   * `POST /v1/practitioners/{practitioner}/reactivate`
   */
  reactivate(practitioner: string, params?: types.PractitionersReactivateParams, options?: RequestOptions): Promise<OphelixResponse<types.Practitioner>> {
    return this.requester.request<types.Practitioner>({ method: 'POST', path: `/v1/practitioners/${segment(practitioner)}/reactivate`, params, options })
  }
}

/** Les routes `priorAgreements` de l'API. */
export class PriorAgreementsService {
  constructor(protected readonly requester: Requester) {}

  /**
   * Lister les demandes d'entente préalable.
   *
   * `GET /v1/prior-agreements`
   */
  list(params?: types.PriorAgreementsListParams, options?: RequestOptions): ListPromise<types.PriorAgreement> {
    return this.requester.list<types.PriorAgreement>({ path: '/v1/prior-agreements', params, options })
  }

  /**
   * Préparer une demande d'entente préalable.
   *
   * Sur un devis, elle en reprend le praticien, le patient et les lignes. Sans devis, elle nomme ses
   * actes.
   *
   * `POST /v1/prior-agreements`
   */
  create(params?: types.PriorAgreementsCreateParams, options?: RequestOptions): Promise<OphelixResponse<types.PriorAgreement>> {
    return this.requester.request<types.PriorAgreement>({ method: 'POST', path: '/v1/prior-agreements', params, options })
  }

  /**
   * Lire une demande d'entente préalable.
   *
   * `GET /v1/prior-agreements/{agreement}`
   */
  retrieve(agreement: string, params?: types.PriorAgreementsRetrieveParams, options?: RequestOptions): Promise<OphelixResponse<types.PriorAgreement>> {
    return this.requester.request<types.PriorAgreement>({ method: 'GET', path: `/v1/prior-agreements/${segment(agreement)}`, params, options })
  }

  /**
   * Envoyer une demande d'entente préalable.
   *
   * `paper` retient la date d'envoi du formulaire. `online` passe par le simulateur en mode test ;
   * le téléservice n'est pas encore raccordé en production : 503.
   *
   * `POST /v1/prior-agreements/{agreement}/send`
   */
  send(agreement: string, params: types.PriorAgreementsSendParams, options?: RequestOptions): Promise<OphelixResponse<types.PriorAgreement>> {
    return this.requester.request<types.PriorAgreement>({ method: 'POST', path: `/v1/prior-agreements/${segment(agreement)}/send`, params, options })
  }

  /**
   * Enregistrer la réponse de la caisse.
   *
   * Accord ou refus d'une demande envoyée. Le silence au-delà du délai l'accorde de lui-même.
   *
   * `POST /v1/prior-agreements/{agreement}/answer`
   */
  answer(agreement: string, params: types.PriorAgreementsAnswerParams, options?: RequestOptions): Promise<OphelixResponse<types.PriorAgreement>> {
    return this.requester.request<types.PriorAgreement>({ method: 'POST', path: `/v1/prior-agreements/${segment(agreement)}/answer`, params, options })
  }

  /**
   * Annuler une demande d'entente préalable.
   *
   * `POST /v1/prior-agreements/{agreement}/cancel`
   */
  cancel(agreement: string, params?: types.PriorAgreementsCancelParams, options?: RequestOptions): Promise<OphelixResponse<types.PriorAgreement>> {
    return this.requester.request<types.PriorAgreement>({ method: 'POST', path: `/v1/prior-agreements/${segment(agreement)}/cancel`, params, options })
  }
}

/** Les routes `quotes` de l'API. */
export class QuotesService {
  constructor(protected readonly requester: Requester) {}

  /**
   * Lister les devis.
   *
   * Chaque devis rendu laisse une trace dans le journal d'audit.
   *
   * `GET /v1/quotes`
   */
  list(params?: types.QuotesListParams, options?: RequestOptions): ListPromise<types.Quote> {
    return this.requester.list<types.Quote>({ path: '/v1/quotes', params, options })
  }

  /**
   * Ouvrir un devis.
   *
   * Mêmes champs qu'une facture. Les parts s'estiment par les règles de la facture, à la date
   * prévue.
   *
   * `POST /v1/quotes`
   */
  create(params: types.QuotesCreateParams, options?: RequestOptions): Promise<OphelixResponse<types.Quote>> {
    return this.requester.request<types.Quote>({ method: 'POST', path: '/v1/quotes', params, options })
  }

  /**
   * Lire un devis.
   *
   * `GET /v1/quotes/{quote}`
   */
  retrieve(quote: string, params?: types.QuotesRetrieveParams, options?: RequestOptions): Promise<OphelixResponse<types.Quote>> {
    return this.requester.request<types.Quote>({ method: 'GET', path: `/v1/quotes/${segment(quote)}`, params, options })
  }

  /**
   * Modifier un brouillon de devis.
   *
   * `lines`, quand il est donné, remplace toutes les lignes. Les parts se réestiment.
   *
   * `PATCH /v1/quotes/{quote}`
   */
  update(quote: string, params?: types.QuotesUpdateParams, options?: RequestOptions): Promise<OphelixResponse<types.Quote>> {
    return this.requester.request<types.Quote>({ method: 'PATCH', path: `/v1/quotes/${segment(quote)}`, params, options })
  }

  /**
   * Remettre un devis au patient.
   *
   * Les parts s'estiment une dernière fois, puis le devis ne se modifie plus.
   *
   * `POST /v1/quotes/{quote}/finalize`
   */
  finalize(quote: string, params?: types.QuotesFinalizeParams, options?: RequestOptions): Promise<OphelixResponse<types.Quote>> {
    return this.requester.request<types.Quote>({ method: 'POST', path: `/v1/quotes/${segment(quote)}/finalize`, params, options })
  }

  /**
   * Le patient accepte le devis.
   *
   * Passé `valid_until`, le devis expire et répond 409.
   *
   * `POST /v1/quotes/{quote}/accept`
   */
  accept(quote: string, params?: types.QuotesAcceptParams, options?: RequestOptions): Promise<OphelixResponse<types.Quote>> {
    return this.requester.request<types.Quote>({ method: 'POST', path: `/v1/quotes/${segment(quote)}/accept`, params, options })
  }

  /**
   * Le patient refuse le devis.
   *
   * `POST /v1/quotes/{quote}/decline`
   */
  decline(quote: string, params?: types.QuotesDeclineParams, options?: RequestOptions): Promise<OphelixResponse<types.Quote>> {
    return this.requester.request<types.Quote>({ method: 'POST', path: `/v1/quotes/${segment(quote)}/decline`, params, options })
  }

  /**
   * Annuler un devis.
   *
   * `POST /v1/quotes/{quote}/cancel`
   */
  cancel(quote: string, params?: types.QuotesCancelParams, options?: RequestOptions): Promise<OphelixResponse<types.Quote>> {
    return this.requester.request<types.Quote>({ method: 'POST', path: `/v1/quotes/${segment(quote)}/cancel`, params, options })
  }

  /**
   * Facturer un devis accepté.
   *
   * Ouvre la facture en brouillon, avec les lignes du devis à la date des soins et l'entente
   * préalable du devis sur chaque ligne. Rend la facture.
   *
   * `POST /v1/quotes/{quote}/invoice`
   */
  invoice(quote: string, params?: types.QuotesInvoiceParams, options?: RequestOptions): Promise<OphelixResponse<types.Claim>> {
    return this.requester.request<types.Claim>({ method: 'POST', path: `/v1/quotes/${segment(quote)}/invoice`, params, options })
  }
}

/** Les routes `rejections` de l'API. */
export class RejectionsService {
  constructor(protected readonly requester: Requester) {}

  /**
   * Lister les rejets.
   *
   * Ce que les organismes refusent ou diffèrent, avec le motif qu'ils donnent et ce qui se corrige,
   * du plus récent au plus ancien.
   *
   * `GET /v1/rejections`
   */
  list(params?: types.RejectionsListParams, options?: RequestOptions): ListPromise<types.Rejection> {
    return this.requester.list<types.Rejection>({ path: '/v1/rejections', params, options })
  }

  /**
   * Lire un rejet.
   *
   * `GET /v1/rejections/{rejection}`
   */
  retrieve(rejection: string, params?: types.RejectionsRetrieveParams, options?: RequestOptions): Promise<OphelixResponse<types.Rejection>> {
    return this.requester.request<types.Rejection>({ method: 'GET', path: `/v1/rejections/${segment(rejection)}`, params, options })
  }

  /**
   * Rapprocher un rejet à la main.
   *
   * Rattache à une facture un retour que le rapprochement automatique n'a pas reconnu : ce rejet et
   * tout ce que porte le même retour. Rend la facture, dans son nouvel état.
   *
   * `POST /v1/rejections/{rejection}/match`
   */
  match(rejection: string, params: types.RejectionsMatchParams, options?: RequestOptions): Promise<OphelixResponse<types.Claim>> {
    return this.requester.request<types.Claim>({ method: 'POST', path: `/v1/rejections/${segment(rejection)}/match`, params, options })
  }
}

/** Les routes `remittances` de l'API. */
export class RemittancesService {
  constructor(protected readonly requester: Requester) {}

  /**
   * Lister les retours de paiement.
   *
   * Les fichiers de retours reçus, du plus récent au plus ancien, avec leurs écarts.
   *
   * `GET /v1/remittances`
   */
  list(params?: types.RemittancesListParams, options?: RequestOptions): ListPromise<types.Remittance> {
    return this.requester.list<types.Remittance>({ path: '/v1/remittances', params, options })
  }

  /**
   * Déposer un fichier de retours de paiement.
   *
   * Lit un fichier NOEMIE 580, rapproche chaque retour de sa facture, crée ses paiements et ses
   * rejets, et fait passer chaque facture rapprochée à l'état que ses parts lui donnent. Un retour
   * sans facture reste à rapprocher à la main. Les écarts relevés sont dans `discrepancies`.
   *
   * `POST /v1/remittances`
   */
  create(params: types.RemittancesCreateParams, options?: RequestOptions): Promise<OphelixResponse<types.Remittance>> {
    return this.requester.request<types.Remittance>({ method: 'POST', path: '/v1/remittances', params, options })
  }

  /**
   * Lire un retour de paiement.
   *
   * `GET /v1/remittances/{remittance}`
   */
  retrieve(remittance: string, params?: types.RemittancesRetrieveParams, options?: RequestOptions): Promise<OphelixResponse<types.Remittance>> {
    return this.requester.request<types.Remittance>({ method: 'GET', path: `/v1/remittances/${segment(remittance)}`, params, options })
  }
}

/** Les routes `transmissions` de l'API. */
export class TransmissionsService {
  constructor(protected readonly requester: Requester) {}

  /**
   * Lister les fichiers envoyés.
   *
   * `GET /v1/transmissions`
   */
  list(params?: types.TransmissionsListParams, options?: RequestOptions): ListPromise<types.Transmission> {
    return this.requester.list<types.Transmission>({ path: '/v1/transmissions', params, options })
  }

  /**
   * Lire un fichier envoyé.
   *
   * `GET /v1/transmissions/{transmission}`
   */
  retrieve(transmission: string, params?: types.TransmissionsRetrieveParams, options?: RequestOptions): Promise<OphelixResponse<types.Transmission>> {
    return this.requester.request<types.Transmission>({ method: 'GET', path: `/v1/transmissions/${segment(transmission)}`, params, options })
  }
}

/** Les routes `webhookEndpoints` de l'API. */
export class WebhookEndpointsService {
  constructor(protected readonly requester: Requester) {}

  /**
   * Lister les points de terminaison.
   *
   * `GET /v1/webhook-endpoints`
   */
  list(params?: types.WebhookEndpointsListParams, options?: RequestOptions): ListPromise<types.WebhookEndpoint> {
    return this.requester.list<types.WebhookEndpoint>({ path: '/v1/webhook-endpoints', params, options })
  }

  /**
   * Créer un point de terminaison.
   *
   * Le secret de signature n'apparaît que dans cette réponse, sous `secret`.
   *
   * `POST /v1/webhook-endpoints`
   */
  create(params: types.WebhookEndpointsCreateParams, options?: RequestOptions): Promise<OphelixResponse<types.WebhookEndpoint>> {
    return this.requester.request<types.WebhookEndpoint>({ method: 'POST', path: '/v1/webhook-endpoints', params, options })
  }

  /**
   * Lire un point de terminaison.
   *
   * `GET /v1/webhook-endpoints/{webhookEndpoint}`
   */
  retrieve(webhookEndpoint: string, params?: types.WebhookEndpointsRetrieveParams, options?: RequestOptions): Promise<OphelixResponse<types.WebhookEndpoint>> {
    return this.requester.request<types.WebhookEndpoint>({ method: 'GET', path: `/v1/webhook-endpoints/${segment(webhookEndpoint)}`, params, options })
  }

  /**
   * Modifier un point de terminaison.
   *
   * Passer `status` à `enabled` réactive un point désactivé après trois jours d'échecs.
   *
   * `PATCH /v1/webhook-endpoints/{webhookEndpoint}`
   */
  update(webhookEndpoint: string, params?: types.WebhookEndpointsUpdateParams, options?: RequestOptions): Promise<OphelixResponse<types.WebhookEndpoint>> {
    return this.requester.request<types.WebhookEndpoint>({ method: 'PATCH', path: `/v1/webhook-endpoints/${segment(webhookEndpoint)}`, params, options })
  }

  /**
   * Supprimer un point de terminaison.
   *
   * `DELETE /v1/webhook-endpoints/{webhookEndpoint}`
   */
  delete(webhookEndpoint: string, params?: types.WebhookEndpointsDeleteParams, options?: RequestOptions): Promise<OphelixResponse<types.DeletedObject>> {
    return this.requester.request<types.DeletedObject>({ method: 'DELETE', path: `/v1/webhook-endpoints/${segment(webhookEndpoint)}`, params, options })
  }

  /**
   * Lister les livraisons d'un point de terminaison.
   *
   * `GET /v1/webhook-endpoints/{webhookEndpoint}/deliveries`
   */
  deliveries(webhookEndpoint: string, params?: types.WebhookEndpointsDeliveriesParams, options?: RequestOptions): ListPromise<types.WebhookDelivery> {
    return this.requester.list<types.WebhookDelivery>({ path: `/v1/webhook-endpoints/${segment(webhookEndpoint)}/deliveries`, params, options })
  }

  /**
   * Renouveler le secret de signature.
   *
   * L'ancien secret cesse de signer aussitôt. Le nouveau n'apparaît que dans cette réponse.
   *
   * `POST /v1/webhook-endpoints/{webhookEndpoint}/rotate-secret`
   */
  rotateSecret(webhookEndpoint: string, params?: types.WebhookEndpointsRotateSecretParams, options?: RequestOptions): Promise<OphelixResponse<types.WebhookEndpoint>> {
    return this.requester.request<types.WebhookEndpoint>({ method: 'POST', path: `/v1/webhook-endpoints/${segment(webhookEndpoint)}/rotate-secret`, params, options })
  }

  /**
   * Envoyer un événement de test.
   *
   * Produit un événement `webhook_endpoint.test`, livré à ce seul point.
   *
   * `POST /v1/webhook-endpoints/{webhookEndpoint}/test`
   */
  test(webhookEndpoint: string, params?: types.WebhookEndpointsTestParams, options?: RequestOptions): Promise<OphelixResponse<types.WebhookDelivery>> {
    return this.requester.request<types.WebhookDelivery>({ method: 'POST', path: `/v1/webhook-endpoints/${segment(webhookEndpoint)}/test`, params, options })
  }

  /**
   * Renvoyer un événement à un point de terminaison.
   *
   * `POST /v1/webhook-endpoints/{webhookEndpoint}/resend`
   */
  resend(webhookEndpoint: string, params: types.WebhookEndpointsResendParams, options?: RequestOptions): Promise<OphelixResponse<types.WebhookDelivery>> {
    return this.requester.request<types.WebhookDelivery>({ method: 'POST', path: `/v1/webhook-endpoints/${segment(webhookEndpoint)}/resend`, params, options })
  }
}

/** Les routes `workstationActions` de l'API. */
export class WorkstationActionsService {
  constructor(protected readonly requester: Requester) {}

  /**
   * Lister les demandes aux postes.
   *
   * `GET /v1/workstation-actions`
   */
  list(params?: types.WorkstationActionsListParams, options?: RequestOptions): ListPromise<types.WorkstationAction> {
    return this.requester.list<types.WorkstationAction>({ path: '/v1/workstation-actions', params, options })
  }

  /**
   * Demander une lecture ou une signature à un poste.
   *
   * L'agent du poste relève la demande en deux secondes au plus tant qu'une page est associée, sinon
   * à son prochain appel d'état. Elle expire au bout de deux minutes si personne ne la prend.
   * Suivez-la par `workstation_action.succeeded` et `workstation_action.failed`, ou en la relisant.
   *
   * `POST /v1/workstation-actions`
   */
  create(params: types.WorkstationActionsCreateParams, options?: RequestOptions): Promise<OphelixResponse<types.WorkstationAction>> {
    return this.requester.request<types.WorkstationAction>({ method: 'POST', path: '/v1/workstation-actions', params, options })
  }

  /**
   * Lire une demande à un poste.
   *
   * `GET /v1/workstation-actions/{workstationAction}`
   */
  retrieve(workstationAction: string, params?: types.WorkstationActionsRetrieveParams, options?: RequestOptions): Promise<OphelixResponse<types.WorkstationAction>> {
    return this.requester.request<types.WorkstationAction>({ method: 'GET', path: `/v1/workstation-actions/${segment(workstationAction)}`, params, options })
  }

  /**
   * Annuler une demande à un poste.
   *
   * Seulement tant que l'agent ne l'a pas prise.
   *
   * `POST /v1/workstation-actions/{workstationAction}/cancel`
   */
  cancel(workstationAction: string, params?: types.WorkstationActionsCancelParams, options?: RequestOptions): Promise<OphelixResponse<types.WorkstationAction>> {
    return this.requester.request<types.WorkstationAction>({ method: 'POST', path: `/v1/workstation-actions/${segment(workstationAction)}/cancel`, params, options })
  }
}

/** Les routes `workstationPairingCodes` de l'API. */
export class WorkstationPairingCodesService {
  constructor(protected readonly requester: Requester) {}

  /**
   * Lire un code d'appairage.
   *
   * `GET /v1/workstation-pairing-codes/{code}`
   */
  retrieve(code: string, params?: types.WorkstationPairingCodesRetrieveParams, options?: RequestOptions): Promise<OphelixResponse<types.WorkstationPairingCode>> {
    return this.requester.request<types.WorkstationPairingCode>({ method: 'GET', path: `/v1/workstation-pairing-codes/${segment(code)}`, params, options })
  }

  /**
   * Créer un code d'appairage.
   *
   * Valable dix minutes et une seule fois, dans le mode de la requête. `code` ne se rend qu'ici.
   * Cette route ignore `Idempotency-Key` : un rejeu devrait garder le code en clair.
   *
   * `POST /v1/workstation-pairing-codes`
   */
  create(params?: types.WorkstationPairingCodesCreateParams, options?: RequestOptions): Promise<OphelixResponse<types.WorkstationPairingCode>> {
    return this.requester.request<types.WorkstationPairingCode>({ method: 'POST', path: '/v1/workstation-pairing-codes', params, options })
  }

  /**
   * Confirmer le rattachement d'un poste déjà appairé.
   *
   * Quand `stage` vaut `already_paired`. Le poste quitte son organisation au moment où l'agent
   * termine l'appairage.
   *
   * `POST /v1/workstation-pairing-codes/{code}/confirm-transfer`
   */
  confirmTransfer(code: string, params?: types.WorkstationPairingCodesConfirmTransferParams, options?: RequestOptions): Promise<OphelixResponse<types.WorkstationPairingCode>> {
    return this.requester.request<types.WorkstationPairingCode>({ method: 'POST', path: `/v1/workstation-pairing-codes/${segment(code)}/confirm-transfer`, params, options })
  }

  /**
   * Annuler un code d'appairage.
   *
   * `POST /v1/workstation-pairing-codes/{code}/cancel`
   */
  cancel(code: string, params?: types.WorkstationPairingCodesCancelParams, options?: RequestOptions): Promise<OphelixResponse<types.WorkstationPairingCode>> {
    return this.requester.request<types.WorkstationPairingCode>({ method: 'POST', path: `/v1/workstation-pairing-codes/${segment(code)}/cancel`, params, options })
  }
}

/** Les routes `workstations` de l'API. */
export class WorkstationsService {
  constructor(protected readonly requester: Requester) {}

  /**
   * Lister les postes.
   *
   * `GET /v1/workstations`
   */
  list(params?: types.WorkstationsListParams, options?: RequestOptions): ListPromise<types.Workstation> {
    return this.requester.list<types.Workstation>({ path: '/v1/workstations', params, options })
  }

  /**
   * Lire un poste.
   *
   * `GET /v1/workstations/{workstation}`
   */
  retrieve(workstation: string, params?: types.WorkstationsRetrieveParams, options?: RequestOptions): Promise<OphelixResponse<types.Workstation>> {
    return this.requester.request<types.Workstation>({ method: 'GET', path: `/v1/workstations/${segment(workstation)}`, params, options })
  }

  /**
   * Renommer un poste.
   *
   * `PATCH /v1/workstations/{workstation}`
   */
  update(workstation: string, params: types.WorkstationsUpdateParams, options?: RequestOptions): Promise<OphelixResponse<types.Workstation>> {
    return this.requester.request<types.Workstation>({ method: 'PATCH', path: `/v1/workstations/${segment(workstation)}`, params, options })
  }

  /**
   * Révoquer un poste.
   *
   * Son jeton cesse à la requête suivante, sans délai de grâce.
   *
   * `POST /v1/workstations/{workstation}/revoke`
   */
  revoke(workstation: string, params?: types.WorkstationsRevokeParams, options?: RequestOptions): Promise<OphelixResponse<types.Workstation>> {
    return this.requester.request<types.Workstation>({ method: 'POST', path: `/v1/workstations/${segment(workstation)}/revoke`, params, options })
  }
}

/** Les routes `racine` de l'API. */
export class OphelixServices {
  readonly acknowledgments: AcknowledgmentsService
  readonly acts: ActsService
  readonly requests: RequestsService
  readonly testHelpers: TestHelpersService
  readonly batches: BatchesService
  readonly browserOrigins: BrowserOriginsService
  readonly browserSessions: BrowserSessionsService
  readonly claimImports: ClaimImportsService
  readonly claims: ClaimsService
  readonly coverages: CoveragesService
  readonly events: EventsService
  readonly patients: PatientsService
  readonly payments: PaymentsService
  readonly practitioners: PractitionersService
  readonly priorAgreements: PriorAgreementsService
  readonly quotes: QuotesService
  readonly rejections: RejectionsService
  readonly remittances: RemittancesService
  readonly transmissions: TransmissionsService
  readonly webhookEndpoints: WebhookEndpointsService
  readonly workstationActions: WorkstationActionsService
  readonly workstationPairingCodes: WorkstationPairingCodesService
  readonly workstations: WorkstationsService

  constructor(protected readonly requester: Requester) {
    this.acknowledgments = new AcknowledgmentsService(requester)
    this.acts = new ActsService(requester)
    this.requests = new RequestsService(requester)
    this.testHelpers = new TestHelpersService(requester)
    this.batches = new BatchesService(requester)
    this.browserOrigins = new BrowserOriginsService(requester)
    this.browserSessions = new BrowserSessionsService(requester)
    this.claimImports = new ClaimImportsService(requester)
    this.claims = new ClaimsService(requester)
    this.coverages = new CoveragesService(requester)
    this.events = new EventsService(requester)
    this.patients = new PatientsService(requester)
    this.payments = new PaymentsService(requester)
    this.practitioners = new PractitionersService(requester)
    this.priorAgreements = new PriorAgreementsService(requester)
    this.quotes = new QuotesService(requester)
    this.rejections = new RejectionsService(requester)
    this.remittances = new RemittancesService(requester)
    this.transmissions = new TransmissionsService(requester)
    this.webhookEndpoints = new WebhookEndpointsService(requester)
    this.workstationActions = new WorkstationActionsService(requester)
    this.workstationPairingCodes = new WorkstationPairingCodesService(requester)
    this.workstations = new WorkstationsService(requester)
  }

  /**
   * Vérifier que l'API répond.
   *
   * Ne demande aucune clé.
   *
   * `GET /v1/ping`
   */
  ping(params?: types.PingParams, options?: RequestOptions): Promise<OphelixResponse<types.Ping>> {
    return this.requester.request<types.Ping>({ method: 'GET', path: '/v1/ping', params, options })
  }

  /**
   * Lire l'état de la plateforme.
   *
   * Ne demande aucune clé. L'état se relève au plus toutes les trente secondes.
   *
   * `GET /v1/status`
   */
  status(params?: types.StatusParams, options?: RequestOptions): Promise<OphelixResponse<types.Status>> {
    return this.requester.request<types.Status>({ method: 'GET', path: '/v1/status', params, options })
  }
}
