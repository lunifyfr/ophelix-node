// Généré par sdks/scripts/generate.ts depuis la spécification OpenAPI : ne pas modifier.

import type { ExpandParams, ListParams } from '../params'

/* Énumérations. */

export type AcknowledgmentResult = 'positive' | 'negative'
export type AgentStatus = 'up_to_date' | 'update_available' | 'outdated'
export type BatchStatus = 'created' | 'sent' | 'acknowledged' | 'failed'
export type ClaimInsuranceNature = 'sickness' | 'maternity' | 'work_accident' | 'free_medical_care'
export type ClaimKind = 'fse' | 'dre'
export type ClaimLineNomenclature = 'ngap' | 'ccam' | 'lpp' | 'biology' | 'medication'
export type ClaimMode = 'secured' | 'degraded' | 'sesam_sans_vitale'
export type ClaimStatus = 'draft' | 'ready' | 'secured' | 'batched' | 'transmitted' | 'acknowledged' | 'paid' | 'partially_paid' | 'adjusted' | 'rejected' | 'flagged' | 'canceled' | 'reissued'
export type ComplementaryManagement = 'single' | 'separate'
export type CoverageRights = 'open' | 'closed'
export type CoverageSource = 'vitale_card' | 'vitale_app' | 'adri' | 'manual'
export type ImportRefusal = 'patient_not_found' | 'patient_ambiguous' | 'patient_unidentified' | 'insurance_nature_unknown' | 'service_date_invalid' | 'incomplete_request' | 'no_billable_line' | 'amount_only' | 'modifier_not_supported' | 'catalogue_not_supported' | 'line_invalid' | 'out_of_place'
export type PairingCodeStatus = 'pending' | 'paired' | 'expired' | 'cancelled'
export type PairingStage = 'waiting' | 'connecting' | 'stalled' | 'agent_outdated' | 'already_paired'
export type PartState = 'paid' | 'rejected' | 'deferred'
export type PatientQuality = 'insured' | 'spouse' | 'child' | 'other'
export type PaymentType = 'liquidation' | 'regularization' | 'one_off_payment' | 'one_off_deduction'
export type PracticeMode = 'holder' | 'replacement' | 'health_center_employee'
export type PractitionerIdentifierType = 'rpps' | 'adeli'
export type PractitionerStatus = 'incomplete' | 'ready' | 'suspended'
export type PriorAgreementChannel = 'paper' | 'online'
export type PriorAgreementResponse = 'favorable' | 'no_answer'
export type PriorAgreementStatus = 'draft' | 'sent' | 'approved' | 'refused' | 'canceled'
export type QuoteStatus = 'draft' | 'open' | 'accepted' | 'declined' | 'expired' | 'invoiced' | 'canceled'
export type RejectionLevel = 'invoice' | 'line' | 'detail'
export type RejectionSource = 'remittance' | 'acknowledgment'
export type RejectionStatus = 'rejected' | 'deferred'
export type ReturnPart = 'amo' | 'amc'
export type ReturnSource = 'file' | 'simulator'
export type WebhookDeliveryStatus = 'pending' | 'succeeded' | 'failed'
export type WebhookEndpointStatus = 'enabled' | 'disabled'
export type WorkstationActionStatus = 'pending' | 'in_progress' | 'succeeded' | 'failed' | 'canceled' | 'expired'
export type WorkstationActionType = 'read_vitale' | 'read_cps' | 'secure_claim'
export type WorkstationPlatform = 'macos' | 'windows' | 'linux'
export type WorkstationStatus = 'online' | 'offline' | 'revoked'

/* Objets. */

/** L'objet `acknowledgment` de l'API. */
export interface Acknowledgment {
  id: string
  object: 'acknowledgment'
  result: AcknowledgmentResult
  /** Le lot qu'il acquitte, ou l'objet avec expand[]=batch. Null : aucun lot en attente ne lui correspond. */
  batch: string | Batch | null
  /** Rattaché à un lot envoyé. Sinon, il reste gardé pour analyse. */
  matched: boolean
  /** Le code de traitement d'un accusé négatif, tel que l'organisme le donne. */
  code: string | null
  /** Le libellé du traitement, tel que la traduction le rend. */
  label: string | null
  /** La facture que le code désigne, quand il en désigne une. */
  claim: string | null
  /** Le numéro de cette facture, lu dans le libellé. */
  invoice_number: string | null
  /** L'émetteur du lot : le numéro de facturation de la situation. */
  emitter: string | null
  /** L'organisme destinataire du lot. */
  recipient: string | null
  batch_number: string | null
  /** La date du lot, `AAAA-MM-JJ`. */
  batch_date: string | null
  source: ReturnSource
  file_name: string | null
  received_at: number | null
  livemode: boolean
  created: number | null
}

/** L'objet `list` de l'API. */
export interface ActList {
  object: 'list'
  url: string
  has_more: boolean
  data: Array<Act>
}

/** L'objet `act` de l'API. */
export interface Act {
  object: 'act'
  /** La nomenclature, celle que prend une ligne de facture. */
  nomenclature: 'ngap' | 'ccam'
  /** Le code à poser sur la ligne : une lettre clé NGAP, un code CCAM. */
  code: string
  /** Le libellé du référentiel. Null quand la source n'en donne pas. */
  label: string | null
  /** Le prix unitaire qui vaut pour tous, en centimes. Null quand il dépend de la profession, de la spécialité, de la zone ou de la grille : la ligne posée sur la facture le calcule. */
  unit_price_cents: number | null
  /** La date des soins à laquelle l'acte a été lu, `AAAA-MM-JJ`. */
  service_date: string
}

/** L'objet `request` de l'API. */
export interface ApiRequest {
  id: string
  object: 'request'
  method: string
  path: string
  route: string | null
  status: number
  duration_ms: number
  api_version: string | null
  api_key: string | null
  idempotency_key: string | null
  livemode: boolean
  request_body: Array<unknown> | null
  response_body: Array<unknown> | null
  created: number
}

/** L'objet `batch` de l'API. */
export interface Batch {
  id: string
  object: 'batch'
  status: BatchStatus
  /** La référence du lot : 001 à 999 pour la FSE, AAA à ZZZ pour la DRE, par situation de facturation. */
  number: string
  kind: ClaimKind
  /** Le mode de sécurisation commun à ses factures. */
  mode: ClaimMode
  /** Ses factures sont en tiers payant : la caisse règle le praticien. */
  third_party: boolean
  /** L'identifiant du praticien, ou l'objet avec expand[]=practitioner. */
  practitioner: string | Practitioner
  practice_situation: string | null
  /** Le régime de l'organisme destinataire. */
  regime_code: string | null
  /** La caisse de l'organisme destinataire. */
  fund_code: string | null
  /** Le fichier qui l'a porté, ou l'objet avec expand[]=transmission. Null avant l'envoi. */
  transmission: string | Transmission | null
  claim_count: number
  /** Le total de ses factures, en centimes. Null si l'une n'a pas de montant. */
  amount_cents: number | null
  /** Le code de traitement de l'accusé négatif, tel que l'organisme le donne (`1001`, `2004`…). */
  failure_code: string | null
  /** Le libellé de ce traitement, tel que la traduction de l'accusé le rend. */
  failure_label: string | null
  /** Lot reconstitué après un accusé négatif : il ne repart qu'une fois. */
  retransmission: boolean
  /** Le lot refusé dont celui-ci est la reconstitution. */
  rebuilt_from: string | null
  /** Le lot refusé peut se reconstituer : `POST /v1/batches/{id}/rebuild`. */
  rebuildable: boolean
  sent_at: number | null
  /** L'instant où, sans accusé, le lot sera en retard : 48 heures après l'envoi. */
  acknowledgment_due_at: number | null
  /** Signalé en retard : envoyé, toujours sans accusé passé le délai. */
  overdue_at: number | null
  acknowledged_at: number | null
  failed_at: number | null
  rebuilt_at: number | null
  livemode: boolean
  created: number | null
  updated: number | null
}

/** L'objet `browser_origin` de l'API. */
export interface BrowserOrigin {
  id: string
  object: 'browser_origin'
  /** Schéma, hôte et port, comme l'en-tête `Origin` du navigateur : `https://app.exemple.fr`. */
  origin: string
  created: number | null
  livemode: boolean
}

/** L'objet `browser_session` de l'API. */
export interface BrowserSession {
  id: string
  object: 'browser_session'
  /** À passer à la page, qui le donne au composant navigateur. Rendu seulement à la création. */
  client_secret?: string
  /** La seule origine d'où la page peut s'en servir. */
  origin: string
  /** Le poste que la page pilote : son identifiant, ou l'objet par `expand[]=workstation`. Vide tant qu'elle ne s'est pas associée. */
  workstation: string | null
  linked_at: number | null
  expires_at: number | null
  created: number | null
  livemode: boolean
}

/** L'objet `simulated_card_read` de l'API. */
export interface CardRead {
  object: 'simulated_card_read'
  card_type: unknown
  engine: string
  card: Record<string, unknown>
}

/** L'objet `claim_import` de l'API. */
export interface ClaimImport {
  id: string
  object: 'claim_import'
  format: 'hprim'
  practitioner: string
  /** Les factures ouvertes en brouillon, une par segment FAC : la facture, son patient, la ligne du message où commence la FAC, ses numéros de dossier (20.3) et de demande (20.4), et son nombre de prestations. */
  claims: Array<{
    claim: string
    patient: string
    line: number
    file_number: string | null
    request_number: string | null
    lines: number
  }>
  /** Ce qui n'a pas donné de facture ou de prestation, adressé comme un segment ERR : ligne du message, type et rang du segment, champ en cause, et la raison. */
  refusals: Array<{
    line: number
    segment: string
    rank: string | null
    field: string | null
    reason: ImportRefusal
  }>
  /** Ce qui est passé, mais pas tout entier : segment ignoré, codes détaillés de biologie non repris. */
  warnings: Array<{
    line: number
    segment: string
    rank: string | null
    field: string | null
    reason: 'segment_ignored' | 'biology_codes_not_carried'
  }>
  claims_count: number
  lines_count: number
  refusals_count: number
  livemode: boolean
  created: number | null
}

/** L'objet `claim_line` de l'API. */
export interface ClaimLine {
  id: string
  object: 'claim_line'
  nomenclature: ClaimLineNomenclature
  code: string
  service_date: string
  quantity: number
  /** Le coefficient de l'acte, en chaîne décimale. */
  coefficient: string
  /** Les majorations et modificateurs. */
  modifiers: Array<string>
  /** Le prescripteur et son ordonnance : numéros, spécialité, condition d'exercice, date, origine. */
  prescriber: Record<string, string | boolean> | null
  /** Où le soin a été fait. Null : au cabinet, par défaut. */
  execution_place: 'practice' | 'home' | null
  /** L'identifiant, sur 14 chiffres, de l'établissement où le soin a été fait. */
  facility_identifier: string | null
  /** L'appareil d'un forfait technique : discipline, mode de traitement, identification, installation, puissance, zone, numéro d'ordre. */
  technical_package: Record<string, string> | null
  /** Le code extension documentaire d'un acte CCAM. */
  documentary_extension: string | null
  /** Le praticien facture une consultation obligatoire de l'enfant. */
  mandatory_child_exam: boolean | null
  /** L'entente préalable de l'acte : la réponse de la caisse, la date d'envoi de la demande, son identification. */
  prior_agreement: {
    response: 'favorable' | 'no_answer' | 'emergency' | 'not_required'
    sent_on?: string
    identifier?: string
  } | null
  /** Le prix unitaire demandé, en centimes. Null : le tarif s'applique. */
  unit_price_cents: number | null
  /** Le prix unitaire retenu à la date des soins, en centimes. Null : aucun tarif connu. */
  base_unit_cents: number | null
  /** Le montant facturé, en centimes. Null : la ligne n'a pas de prix. */
  amount_cents: number | null
  /** La base de remboursement, en centimes. Null : les règles ne savent pas encore la calculer. */
  base_amount_cents: number | null
  /** Ce que rembourse l'assurance maladie obligatoire, en centimes. */
  amo_amount_cents: number | null
  /** Ce que rembourse l'organisme complémentaire, en centimes. Zéro quand la facture n'a pas de part complémentaire, null quand elle reste inconnue. */
  amc_amount_cents: number | null
  /** Le taux de remboursement de l'assurance maladie obligatoire, en pour cent. */
  reimbursement_rate: number | null
  /** Le justificatif d'exonération du ticket modérateur, tel que la facture le transmet. */
  exemption_code: string | null
  /** Les étapes du calcul de la ligne, dans l'ordre, chacune avec la règle qui l'a produite. */
  pricing_steps: Array<{
    rule: string
    step: string
    value: unknown
  }>
  livemode: boolean
}

/** L'objet `claim` de l'API. */
export interface Claim {
  id: string
  object: 'claim'
  status: ClaimStatus
  /** Le numéro de la facture, attribué à la signature (neuf chiffres). Les retours de l'Assurance Maladie le citent. */
  number: string | null
  /** La facture rejetée que celle-ci corrige et remplace. */
  replaces: string | null
  /** La copie qui corrige celle-ci, si elle a été réémise. */
  replaced_by: string | null
  /** La chaîne des réémissions, de la première facture à la dernière, celle-ci comprise. */
  reissue_chain: Array<string>
  /** Pour une copie : ce que les rejets de la facture remplacée laissent corriger (`coverage`, `context`, `lines`, `complementary`). Vide : rien à modifier, elle se signe à nouveau. */
  editable: Array<string> | null
  kind: ClaimKind
  mode: ClaimMode
  /** L'identifiant du praticien, ou l'objet avec expand[]=practitioner. */
  practitioner: string | Practitioner
  practice_situation: string | null
  /** L'identifiant du patient, ou l'objet avec expand[]=patient. */
  patient: string | Patient
  /** L'identifiant de la lecture de droits, ou l'objet avec expand[]=coverage. */
  coverage: string | Coverage | null
  /** Le lot qui l'a emportée, ou l'objet avec expand[]=batch. Null avant la mise en lot. */
  batch: string | Batch | null
  /** Le devis dont la facture est née, `qt_…`. Null pour une facture saisie directement. */
  quote: string | null
  insurance_nature: ClaimInsuranceNature
  third_party_amo: boolean
  third_party_amc: boolean
  /** Les dates et numéros que la nature d'assurance demande. */
  context: Record<string, string>
  /** Ce que le praticien dit de la complémentaire : la convention qu'il retient, la réponse de prise en charge qu'il a reçue. */
  complementary: {
    convention?: string | null
    coverage_response?: {
      reference?: string
      lines?: Array<{
        code: string
        amount_cents: number
      }>
      amount_cents?: number
    } | null
  } | null
  lines: Array<ClaimLine>
  /** Le total facturé, en centimes. Null tant qu'une ligne n'a pas de prix. */
  amount_cents: number | null
  /** La base de remboursement totale, en centimes. */
  base_amount_cents: number | null
  /** La part obligatoire, en centimes, calculée par les règles de valorisation. Null : pas encore calculable. */
  amo_amount_cents: number | null
  /** La part complémentaire, en centimes. Zéro quand la facture n'en porte pas, null quand elle reste inconnue : `amc_pricing` dit pourquoi. */
  amc_amount_cents: number | null
  /** L'explication de la part complémentaire. `status` : `computed`, `not_applicable` (zéro) ou `unknown` (null). `reason` : d'où vient le montant, ou pourquoi il n'y en a pas. `rule` : la règle du cahier des charges qui en décide. `conventions` et `convention` : les conventions trouvées dans la table du praticien, et celle qu'il a retenue. */
  amc_pricing: {
    status: 'computed' | 'not_applicable' | 'unknown'
    reason: 'coverage_response' | 'entered_amounts' | 'pricing_service' | 'rules' | 'no_complementary' | 'single_management_without_third_party' | 'insurance_nature' | 'apias' | 'attack_victim' | 'amo_unknown' | 'complementary_undescribed' | 'convention_not_selected' | 'pricing_service_required'
    rule: string | null
    convention?: string | null
    conventions?: Array<string>
  } | null
  /** Le reste à charge de l'assuré, en centimes. */
  patient_amount_cents: number | null
  /** Ce qui a été réglé par les organismes, en centimes : la somme signée de ses paiements, régularisations comprises. */
  paid_amount_cents: number | null
  /** L'état de chaque part dans les retours de paiement : `paid`, `rejected`, `deferred`, ou null tant qu'aucun retour ne l'a dit. */
  returns: {
    amo: PartState | null
    amc: PartState | null
  }
  /** La caisse a régularisé la facture après l'avoir payée ou rejetée. */
  regularized_at: number | null
  rejection_code: string | null
  /** Référentiel => version retenue pour le calcul. */
  referential_versions: Record<string, string> | null
  ready_at: number | null
  secured_at: number | null
  transmitted_at: number | null
  acknowledged_at: number | null
  settled_at: number | null
  canceled_at: number | null
  livemode: boolean
  created: number | null
  updated: number | null
}

/** L'objet `claim_validation` de l'API. */
export interface ClaimValidation {
  object: 'claim_validation'
  claim: string
  valid: boolean
  violations: Array<{
    rule: string
    message: string
    param: string
    line: string | null
  }>
  /** Ce qui n'empêche pas la facture de partir, mais que le praticien doit savoir. */
  warnings: Array<{
    rule: string
    message: string
    param: string
    line: string | null
  }>
}

/** L'objet `coverage` de l'API. */
export interface Coverage {
  id: string
  object: 'coverage'
  /** L'identifiant du patient, ou l'objet avec expand[]=patient. */
  patient: string | Patient
  source: CoverageSource
  rights: CoverageRights
  regime_code: string | null
  fund_code: string | null
  center_code: string | null
  exemptions: Array<string>
  /** Le code situation de la période de droits, quatre chiffres, tel que la carte ou ADRi le donne. Il fixe le taux de remboursement. Null : inconnu, et les parts de la facture ne se calculent pas. */
  coverage_code: string | null
  /** La complémentaire que porte le support. Son mode de gestion (`management`) décide de la part complémentaire : sans lui, elle reste inconnue. */
  complementary: {
    management?: 'single' | 'separate'
    organization?: string
    contract?: string
    processing_indicator?: string
    convention_type?: string
    secondary_criterion?: string
    valid_from?: string
    valid_until?: string
  } | null
  read_at: number | null
  valid_until: string | null
  livemode: boolean
  created: number | null
}

/** L'objet `webhook_endpoint` de l'API. */
export interface DeletedObject {
  id: string
  object: 'webhook_endpoint'
  deleted: boolean
}

/** L'objet `event` de l'API. */
export interface Event {
  id: string
  object: 'event'
  type: string
  livemode: boolean
  created: number
  api_version: string
  request: string | null
  data: {
    object: Record<string, unknown>
    previous_attributes: Record<string, unknown>
  }
}

/** L'objet `patient_erasure` de l'API. */
export interface PatientErasure {
  id: string
  object: 'patient_erasure'
  /** Le patient, `pat_…`. Effacé, il ne se lit plus. */
  patient: string
  /** À la demande du patient, ou par la purge. */
  reason: 'request' | 'retention'
  /** `completed` : tout est effacé, l'identité comprise. `partial` : une part reste sous conservation, `retained` dit laquelle. */
  status: 'completed' | 'partial'
  /** L'identité du patient est effacée. */
  patient_erased: boolean
  /** Ce qui a été effacé, par type. */
  erased: {
    claims: number
    coverages: number
    quotes: number
    prior_agreements: number
  }
  /** Ce qui reste, et pourquoi : `billing_retention`, une facture signée dont le double se conserve ; `referenced`, une facture qu'une autre donnée cite encore. `retained_until` : la fin de conservation, null tant qu'aucune durée n'est réglée. */
  retained: Array<{
    object: 'claim'
    id: string
    reason: 'billing_retention' | 'referenced'
    retained_until: string | null
  }>
  livemode: boolean
  created: number | null
}

/** L'objet `patient_export` de l'API. */
export interface PatientExport {
  object: 'patient_export'
  patient: Patient
  /** Chaque lecture de droits, de la plus ancienne à la plus récente. */
  coverages: Array<Coverage>
  /** Chaque facture, avec ses prestations. */
  claims: Array<Claim>
  quotes: Array<Quote>
  prior_agreements: Array<PriorAgreement>
  /** Les paiements des caisses sur ses factures. */
  payments: Array<Payment>
  /** Les rejets de ses factures. */
  rejections: Array<Rejection>
  /** Le moment de l'export, en secondes Unix. */
  created: number
  livemode: boolean
}

/** L'objet `patient` de l'API. */
export interface Patient {
  id: string
  object: 'patient'
  first_name: string
  last_name: string
  birth_date: string
  /** Le rang du bénéficiaire sur la carte. */
  rank: number
  quality: PatientQuality
  /** L'assuré qui ouvre droit, quand ce n'est pas le patient lui-même. */
  insured_first_name: string | null
  insured_last_name: string | null
  nir_last4: string
  /** La dernière lecture de droits, ou l'objet avec expand[]=latest_coverage. Null : aucune lecture. */
  latest_coverage: string | Record<string, unknown> | null
  livemode: boolean
  created: number | null
}

/** L'objet `payment` de l'API. */
export interface Payment {
  id: string
  object: 'payment'
  type: PaymentType
  part: ReturnPart | null
  /** Le montant, en centimes, signé : négatif pour une retenue ou un indu. */
  amount_cents: number
  /** Ce que la facture demandait pour cette part, en centimes. */
  requested_cents: number | null
  /** La facture qu'il règle. Null s'il n'en suit aucune, ou s'il attend un rapprochement à la main. */
  claim: string | null
  /** Rapproché d'une facture, ou ponctuel. `false` : à rapprocher à la main. */
  matched: boolean
  remittance: string
  /** Le type de retour NOEMIE : `01` liquidation, `02`, `03` paiement ponctuel, `04` et `05` régularisation. */
  return_code: string | null
  /** La facture telle que le retour la cite. */
  invoice: {
    number: string | null
    date: string | null
    type: string | null
  }
  /** Le numéro de facturation du professionnel payé. */
  practitioner_number: string | null
  /** Le virement : son libellé, qui le retrouve sur le relevé, sa date comptable et l'organisme payeur. */
  transfer: {
    label: string | null
    accounting_date: string | null
    payer: string | null
  }
  /** La référence de la dette d'une retenue. */
  debt_reference: string | null
  /** `CIN` constat initial, `RPR` repaiement. */
  operation_nature: string | null
  /** Le code d'un paiement ponctuel. */
  code: string | null
  /** Le libellé d'un paiement ponctuel, tel que la caisse le donne. */
  label: string | null
  /** L'assuré et le bénéficiaire lus dans un retour non rapproché, pour retrouver la facture à la main. Null une fois rapproché. */
  beneficiary: Record<string, string | null> | null
  matched_at: number | null
  livemode: boolean
  created: number | null
}

/** L'objet `ping` de l'API. */
export interface Ping {
  object: 'ping'
  name: string
  api_version: 'v1'
  time: string
}

/** L'objet `practice_situation` de l'API. */
export interface PracticeSituation {
  id: string
  object: 'practice_situation'
  /** Le numéro logique de la situation sur la carte. */
  number: number
  practice_mode: PracticeMode
  exercise_mode_code: string | null
  exercise_status_code: string | null
  activity_sector_code: string | null
  structure_identifier_type: string | null
  structure_identifier: string | null
  structure_name: string | null
  billing_number: string | null
  billing_key: string | null
  replacement_number: string | null
  replacement_key: string | null
  convention_code: string | null
  specialty_code: string | null
  price_zone_code: string | null
  ik_zone_code: string | null
  approval_codes: Array<string>
  can_sign_invoice: boolean
  can_sign_batch: boolean
  /** Ce que la carte ne porte pas, renseigné par le praticien. */
  settings: Record<string, unknown>
  /** Vrai si une facture peut partir sous cette situation. */
  billable: boolean
  withdrawn_at: number | null
  livemode: boolean
  created: number | null
}

/** L'objet `practitioner` de l'API. */
export interface Practitioner {
  id: string
  object: 'practitioner'
  identifier_type: PractitionerIdentifierType
  identifier: string
  card_type: string | null
  first_name: string
  last_name: string
  profession: string
  /** La spécialité de sa première situation. Chaque situation porte la sienne. */
  specialty_code: string | null
  /** La convention de sa première situation. Chaque situation porte la sienne. */
  convention_code: string | null
  status: PractitionerStatus
  situations: Array<PracticeSituation>
  /** L'heure de l'envoi quotidien de ses lots, `HH:MM` à l'heure de Paris. */
  batch_cutoff: string
  onboarded_at: number | null
  /** La dernière facture transmise. Null tant qu'aucune n'est partie. */
  last_transmitted_at: number | null
  livemode: boolean
  created: number | null
}

/** L'objet `prior_agreement` de l'API. */
export interface PriorAgreement {
  id: string
  object: 'prior_agreement'
  status: PriorAgreementStatus
  practitioner: string
  patient: string
  /** Le devis dont la demande porte les soins, `qt_…`. */
  quote: string | null
  /** Les actes demandés. */
  lines: Array<{
    nomenclature: string
    code: string
    quantity: number
    coefficient: string
  }>
  /** Les soins n'attendent pas la réponse : la facture porte le code d'urgence dès l'envoi. */
  urgent: boolean
  channel: PriorAgreementChannel | null
  /** Le jour où la demande est partie. */
  sent_on: string | null
  response: PriorAgreementResponse | null
  /** Le jour où la réponse est arrivée. */
  responded_on: string | null
  /** L'identification que porte la réponse. */
  identifier: string | null
  /** Ce qu'une ligne de facture porte de cette entente, à recopier dans `lines[].prior_agreement`. Null tant qu'elle ne permet pas de facturer. */
  claim_line_agreement: {
    response: 'favorable' | 'no_answer' | 'emergency'
    sent_on: string
    identifier?: string
  } | null
  sent_at: number | null
  approved_at: number | null
  refused_at: number | null
  canceled_at: number | null
  livemode: boolean
  created: number | null
}

/** L'objet `quote_line` de l'API. */
export interface QuoteLine {
  id: string
  object: 'quote_line'
  nomenclature: ClaimLineNomenclature
  code: string
  /** La date prévue des soins, qui donne le tarif. La facture prendra celle du soin. */
  service_date: string
  quantity: number
  /** Le coefficient de l'acte, en chaîne décimale. */
  coefficient: string
  modifiers: Array<string>
  prescriber: Record<string, string | boolean> | null
  /** Les détails d'une ligne de facture que la ligne porte déjà : lieu, établissement, forfait technique, extension documentaire. */
  details: Record<string, unknown>
  /** Le prix unitaire demandé, en centimes. Null : le tarif s'applique. */
  unit_price_cents: number | null
  /** Le prix unitaire retenu à la date prévue, en centimes. */
  base_unit_cents: number | null
  /** Le montant proposé, en centimes. */
  amount_cents: number | null
  /** La base de remboursement estimée, en centimes. */
  base_amount_cents: number | null
  /** La part obligatoire estimée, en centimes. Null : pas encore calculable. */
  amo_amount_cents: number | null
  /** La part complémentaire estimée, en centimes. Zéro sans part complémentaire, null quand elle reste inconnue. */
  amc_amount_cents: number | null
  reimbursement_rate: number | null
  exemption_code: string | null
  /** Les étapes de l'estimation, chacune avec la règle qui l'a produite. */
  pricing_steps: Array<{
    rule: string
    step: string
    value: unknown
  }>
  livemode: boolean
}

/** L'objet `quote` de l'API. */
export interface Quote {
  id: string
  object: 'quote'
  status: QuoteStatus
  practitioner: string
  practice_situation: string | null
  patient: string
  /** La lecture de droits qui a servi à estimer les parts. */
  coverage: string | null
  insurance_nature: ClaimInsuranceNature
  third_party_amo: boolean
  third_party_amc: boolean
  /** Le contexte de la facture à venir, mêmes champs qu'une facture. */
  context: Record<string, string>
  complementary: {
    convention?: string | null
    coverage_response?: Record<string, unknown> | null
  } | null
  /** Le dernier jour où le patient peut accepter le devis. */
  valid_until: string
  lines: Array<QuoteLine>
  /** Le total proposé, en centimes. */
  amount_cents: number | null
  /** La base de remboursement estimée, en centimes. */
  base_amount_cents: number | null
  /** La part obligatoire estimée, en centimes. Null : pas encore calculable, par exemple sans code situation. */
  amo_amount_cents: number | null
  /** La part complémentaire estimée, en centimes. Zéro sans part complémentaire, null quand elle reste inconnue : `amc_pricing` dit pourquoi. */
  amc_amount_cents: number | null
  /** L'explication de la part complémentaire, comme sur une facture. */
  amc_pricing: {
    status: 'computed' | 'not_applicable' | 'unknown'
    reason: string
    rule: string | null
  } | null
  /** Le reste à charge estimé de l'assuré, en centimes. */
  patient_amount_cents: number | null
  /** Référentiel => version retenue pour l'estimation. */
  referential_versions: Record<string, string> | null
  /** La facture née du devis, `clm_…`, une fois facturé. */
  claim: string | null
  finalized_at: number | null
  accepted_at: number | null
  declined_at: number | null
  expired_at: number | null
  invoiced_at: number | null
  canceled_at: number | null
  livemode: boolean
  created: number | null
  updated: number | null
}

/** L'objet `rejection` de l'API. */
export interface Rejection {
  id: string
  object: 'rejection'
  /** `deferred` : la caisse n'a pas fini, un second retour viendra. */
  status: RejectionStatus
  source: RejectionSource
  part: ReturnPart | null
  /** Le code du rejet, tel que l'organisme le donne. */
  code: string | null
  /** Le libellé du rejet, tel que l'organisme le donne. */
  label: string | null
  /** Le même libellé, rendu lisible : en minuscules quand la caisse l'écrit en capitales. */
  reason: string | null
  level: RejectionLevel | null
  /** La place de la prestation rejetée dans la facture, à partir de 1. */
  line_number: number | null
  /** La prestation rejetée, `cli_…`, quand la facture est rapprochée. */
  claim_line: string | null
  /** Le rang du code affiné dans sa prestation. */
  rank: number | null
  /** Ce que la réémission peut corriger pour y répondre : `coverage`, `context`, `lines`, `complementary`. Vide : rien à modifier, la facture se signe à nouveau, ou la caisse n'a pas fini. */
  editable: Array<string>
  /** La prestation que vise le rejet : nature, date des soins, exécutant. */
  service: Record<string, string | null> | null
  /** Le commentaire de l'organisme, s'il en donne un. */
  comment: string | null
  claim: string | null
  /** Rapproché d'une facture. `false` : à rapprocher à la main. */
  matched: boolean
  remittance: string | null
  acknowledgment: string | null
  /** La facture telle que le retour la cite. */
  invoice: {
    number: string | null
    date: string | null
    type: string | null
  }
  /** L'assuré et le bénéficiaire lus dans un retour non rapproché, pour retrouver la facture à la main. Null une fois rapproché. */
  beneficiary: Record<string, string | null> | null
  matched_at: number | null
  livemode: boolean
  created: number | null
}

/** L'objet `remittance` de l'API. */
export interface Remittance {
  id: string
  object: 'remittance'
  /** La référence NOEMIE du fichier : `580`. */
  norm: string
  /** L'organisme qui a émis le fichier, tel que l'entité 000 le nomme. */
  emitter: string | null
  source: ReturnSource
  file_name: string | null
  /** Les retours du fichier : un par facture, paiement ponctuel ou retenue. */
  return_count: number
  /** Les retours rapprochés d'une facture. */
  matched_count: number
  /** Les retours de facture qu'aucune facture n'a reconnus : ils attendent un rapprochement à la main. */
  unmatched_count: number
  /** La somme signée des virements du fichier, en centimes. */
  total_cents: number
  /** Les écarts relevés : `unmatched` (retour sans facture), `underpaid` (payé moins que demandé), `total_mismatch` (cumul d'un virement faux), `unknown_return` (type de retour inconnu). */
  discrepancies: Array<Record<string, string | number | null>>
  received_at: number | null
  livemode: boolean
  created: number | null
}

/** L'objet `status` de l'API. */
export interface Status {
  object: 'status'
  /** `operational`, `degraded` ou `down`. */
  status: string
  components: Array<{
    id: string
    status: string
  }>
  checked_at: number | null
}

/** L'objet `test_feed` de l'API. */
export interface TestFeed {
  object: 'test_feed'
  events: Array<{
    id: string
    type: string
    created: number
    body: string
  }>
  requests: Array<{
    id: string
    method: string
    path: string
    status: number
    duration_ms: number
    error_code: string | null
    api_key: string | null
    created: number
  }>
  events_cursor: string
  requests_cursor: string
  signing_secret: string
  poll_interval: number
}

/** L'objet `test_scenarios` de l'API. */
export interface TestScenarios {
  object: 'test_scenarios'
  vitale_cards: Array<unknown>
  cps_cards: Array<unknown>
  returns: Array<unknown>
}

/** L'objet `transmission` de l'API. */
export interface Transmission {
  id: string
  object: 'transmission'
  /** Le numéro du fichier, continu dans un mode. */
  number: number
  /** Par où le fichier part : `oct`, l'organisme concentrateur technique. */
  route: string
  /** Le régime de l'organisme destinataire. */
  regime_code: string | null
  /** La caisse de l'organisme destinataire. */
  fund_code: string | null
  file_name: string
  size_bytes: number
  /** Les lots du fichier. Chacun porte son accusé. */
  batches: Array<string>
  sent_at: number | null
  livemode: boolean
  created: number | null
}

/** L'objet `upcoming_batches` de l'API. */
export interface UpcomingBatches {
  object: 'upcoming_batches'
  claim_count: number
  amount_cents: null | number
  fund_count: number
  next_send_at: number | null
  livemode: boolean
  data: Array<unknown>
}

/** L'objet `webhook_delivery` de l'API. */
export interface WebhookDelivery {
  id: string
  object: 'webhook_delivery'
  status: WebhookDeliveryStatus
  endpoint: string
  event: string
  event_type: string
  attempt_count: number
  next_attempt_at: number | null
  attempts: Array<{
    id: string
    object: 'webhook_attempt'
    response_status: number | null
    duration_ms: number
    response_body: string | null
    error: string | null
    request_body: string
    created: number
  }>
  created: number | null
}

/** L'objet `webhook_endpoint` de l'API. */
export interface WebhookEndpoint {
  id: string
  object: 'webhook_endpoint'
  url: string
  description: string | null
  enabled_events: Array<string>
  status: WebhookEndpointStatus
  livemode: boolean
  disabled_at: number | null
  created: number | null
  /** Le secret de signature. Il n'apparaît qu'à la création et au renouvellement. */
  secret?: string
}

/** L'objet `workstation_action` de l'API. */
export interface WorkstationAction {
  id: string
  object: 'workstation_action'
  type: WorkstationActionType
  /** `pending` tant que l'agent ne l'a pas prise, `in_progress` pendant la lecture, puis `succeeded`, `failed`, `canceled`, ou `expired` si personne ne l'a prise à temps. */
  status: WorkstationActionStatus
  workstation: string | null
  /** La session de la page qui l'a demandée, vide si c'est un serveur. */
  browser_session: string | null
  /** Le scénario du simulateur, en mode test. Sans lui, `vitale_ok` ou `cps_doctor`. */
  scenario: string | null
  /** La facture à sécuriser, pour `secure_claim`. */
  claim: string | null
  /** Ce que la demande a produit, par identifiant : `coverage` et `patient` pour une carte Vitale, `practitioner` pour une CPS, `claim` pour une signature. À relire avec la clé secrète : la demande ne porte aucune donnée de la carte. */
  result: {
    coverage?: string
    patient?: string
    practitioner?: string
    claim?: string
  } | null
  /** `card_absent`, `declined`, ou le code d'erreur du moteur (`card_unreadable`, `engine_unavailable`…). */
  failure_code: string | null
  failure_message: string | null
  expires_at: number | null
  started_at: number | null
  completed_at: number | null
  created: number | null
  livemode: boolean
}

/** L'objet `workstation_pairing_code` de l'API. */
export interface WorkstationPairingCode {
  id: string
  object: 'workstation_pairing_code'
  /** À saisir dans l'agent. Rendu seulement à la création. */
  code?: string
  status: PairingCodeStatus
  stage: PairingStage | null
  previewed_at: number | null
  /** Ce que l'agent a dit de lui en présentant le code. Vide avant. */
  agent: {
    name: string | null
    platform: string | null
    os_version: string | null
    version: string | null
    status: AgentStatus | null
    minimum_version: string
    latest_version: string
  } | null
  /** L'organisation que le poste quitterait, tant que `stage` vaut `already_paired`. */
  current_organization: string | null
  expires_at: number | null
  /** Le poste appairé par ce code : son identifiant, ou l'objet par `expand[]=workstation`. */
  workstation: string | null
  created: number | null
  livemode: boolean
}

/** L'objet `workstation` de l'API. */
export interface Workstation {
  id: string
  object: 'workstation'
  name: string
  platform: WorkstationPlatform
  os_version: string | null
  agent_version: string
  agent_status: AgentStatus
  /** Le poste a remonté son état il y a moins de 45 secondes, et n'est pas révoqué. */
  online: boolean
  status: WorkstationStatus
  /** Le dernier état remonté : pour chaque lecteur, ses fentes et le genre de la carte. */
  readers: Array<{
    name: string
    slots: Array<{
      index: number
      reader_name: string
      card: {
        kind: 'cps' | 'vitale' | 'unknown'
      } | null
    }>
  }>
  last_seen_at: number | null
  /** Le dernier état remonté. Vide juste après l'appairage : `readers` ne dit encore rien. */
  state_reported_at: number | null
  last_card_at: number | null
  certificate_expires_at: number | null
  revoked_at: number | null
  created: number | null
  livemode: boolean
}

/* Paramètres. */

export interface AcknowledgmentsListParams extends ListParams {
  result?: AcknowledgmentResult
  batch?: string | Batch
  matched?: 'true' | 'false'
}

export interface AcknowledgmentsCreateParams {
  /** Le contenu du fichier, encodé en base 64. */
  contents: string
  /** Le nom du fichier reçu, pour le retrouver. */
  file_name?: string
}

export type AcknowledgmentsRetrieveParams = ExpandParams

export interface ActsListParams extends ExpandParams {
  query?: string
  service_date?: string
  limit?: number
}

export interface RequestsListParams extends ListParams {
  status?: string | Status
  route?: string
  key?: string
  object?: string
}

export type RequestsRetrieveParams = ExpandParams

export interface TestHelpersBatchesAcknowledgmentParams {
  /** `arl_positive` ou `arl_negative`. */
  scenario: 'arl_positive' | 'arl_negative'
  /** Le code de traitement d'un accusé négatif : `1001`, `2004` ou `5001`. */
  code?: '1001' | '2004' | '5001'
}

export interface BatchesListParams extends ListParams {
  status?: BatchStatus
  practitioner?: string | Practitioner
  transmission?: string | Transmission
  fund?: string
  number?: string
  'created[gte]'?: number
  'created[lte]'?: number
}

export interface BatchesUpcomingParams extends ExpandParams {
  practitioner?: string | Practitioner
}

export type BatchesRetrieveParams = ExpandParams

export interface BatchesSendParams {
  /** Seulement les factures de ce praticien, `prac_…`. */
  practitioner?: string | Practitioner
}

export type BatchesRebuildParams = Record<string, unknown>

export type BrowserOriginsListParams = ListParams

export interface BrowserOriginsCreateParams {
  /** L'adresse de la page, réduite à son origine : `https://app.exemple.fr`. HTTP seulement pour `localhost`, en mode test. */
  origin: string
}

export type BrowserOriginsDeleteParams = Record<string, unknown>

export type BrowserSessionsRetrieveParams = ExpandParams

export interface BrowserSessionsCreateParams {
  /** L'origine de la page qui recevra le secret. Elle doit figurer parmi les origines autorisées du mode. */
  origin: string
  /** Le poste à piloter, si votre serveur le connaît. Sans lui, la page s'associe par le code que montre l'agent. */
  workstation?: string | null
}

export type ClaimImportsRetrieveParams = ExpandParams

export interface ClaimImportsCreateParams {
  /** Le format du message. `hprim` : HPRIM Santé 2.x, contexte de facturation (FAC). */
  format: 'hprim'
  /** Le message, tel que le fichier le porte. Un million de caractères au plus. */
  content: string
  /** Le praticien qui facture les prestations du message, `prac_…`. */
  practitioner: string | Practitioner
  /** Le tiers payant de la part obligatoire, pour toutes les factures du message. */
  third_party_amo?: boolean
  /** Le tiers payant de la part complémentaire, pour toutes les factures du message. */
  third_party_amc?: boolean
}

export interface ClaimsLinesCreateParams {
  nomenclature: ClaimLineNomenclature
  code: string
  service_date: string
  quantity?: number
  coefficient?: number
  modifiers?: Array<string>
  unit_price_cents?: number | null
  prescriber?: {
    identifier?: string
    key?: string
    specialty_code?: string
    prescribed_on?: string
    exercise_condition?: 'liberal' | 'salaried' | 'volunteer'
    rpps?: string
    rpps_key?: string
    structure_number?: string
    origin?: 'treating_doctor' | 'correspondent' | 'other_pathway' | 'outside_pathway' | 'adapted_renewal' | 'identical_renewal'
    sncf_doctor?: boolean
  }
  execution_place?: 'practice' | 'home' | null
  facility_identifier?: string | null
  documentary_extension?: string | null
  mandatory_child_exam?: boolean | null
  technical_package?: {
    discipline?: string
    treatment_mode?: string
    device_id?: string
    installation_date?: string
    power?: string
    zone?: string
    exam_number?: string
  }
  /** L'entente préalable de l'acte : la réponse de la caisse, la date d'envoi de la demande, son identification. */
  prior_agreement?: {
    /** `favorable`, `no_answer` (pas de réponse dans le délai réglementaire), `emergency` (urgence) ou `not_required` (acte non soumis). */
    response?: 'no_answer' | 'favorable' | 'emergency' | 'not_required'
    sent_on?: string
    identifier?: string
  }
}

export interface ClaimsLinesUpdateParams {
  nomenclature?: ClaimLineNomenclature
  code?: string
  service_date?: string
  quantity?: number
  coefficient?: number
  modifiers?: Array<string>
  unit_price_cents?: number | null
  prescriber?: {
    identifier?: string
    key?: string
    specialty_code?: string
    prescribed_on?: string
    exercise_condition?: 'liberal' | 'salaried' | 'volunteer'
    rpps?: string
    rpps_key?: string
    structure_number?: string
    origin?: 'treating_doctor' | 'correspondent' | 'other_pathway' | 'outside_pathway' | 'adapted_renewal' | 'identical_renewal'
    sncf_doctor?: boolean
  }
  execution_place?: 'practice' | 'home' | null
  facility_identifier?: string | null
  documentary_extension?: string | null
  mandatory_child_exam?: boolean | null
  technical_package?: {
    discipline?: string
    treatment_mode?: string
    device_id?: string
    installation_date?: string
    power?: string
    zone?: string
    exam_number?: string
  }
  /** L'entente préalable de l'acte : la réponse de la caisse, la date d'envoi de la demande, son identification. */
  prior_agreement?: {
    /** `favorable`, `no_answer` (pas de réponse dans le délai réglementaire), `emergency` (urgence) ou `not_required` (acte non soumis). */
    response?: 'no_answer' | 'favorable' | 'emergency' | 'not_required'
    sent_on?: string
    identifier?: string
  }
}

export type ClaimsLinesDeleteParams = Record<string, unknown>

export interface TestHelpersClaimsCreateParams {
  /** Le scénario de carte CPS. Par défaut, `cps_doctor`. */
  practitioner_card?: string
  /** Le scénario de carte Vitale. Par défaut, `vitale_ok`. */
  patient_card?: string
}

export interface TestHelpersClaimsSimulateReturnParams {
  /** Un retour de `/v1/test-helpers/scenarios`. */
  scenario: 'arl_positive' | 'arl_negative' | 'payment' | 'partial_payment' | 'rejection' | 'line_rejection' | 'complementary_rejection' | 'deferred' | 'regularization'
}

export interface ClaimsListParams extends ListParams {
  status?: ClaimStatus
  patient?: string | Patient
  practitioner?: string | Practitioner
  mode?: ClaimMode
  batch?: string | Batch
  fund?: string
  number?: string
  replaces?: string
  'created[gte]'?: number
  'created[lte]'?: number
}

export interface ClaimsCreateParams {
  /** Le praticien qui facture, `prac_…`. */
  practitioner: string | Practitioner
  /** Le patient, `pat_…`. */
  patient: string | Patient
  kind?: ClaimKind
  mode?: ClaimMode
  insurance_nature?: ClaimInsuranceNature
  third_party_amo?: boolean
  third_party_amc?: boolean
  coverage?: string | Coverage
  practice_situation?: string | PracticeSituation
  context?: {
    maternity_date?: string
    work_accident_date?: string
    work_accident_number?: string
    common_law_accident?: boolean
    common_law_accident_date?: string
    care_pathway?: 'excluded' | 'emergency' | 'treating_doctor' | 'new_treating_doctor' | 'substitute' | 'recent_generalist' | 'underserved_area' | 'away_from_home' | 'direct_access' | 'outside_direct_access' | 'referred_by_treating' | 'referred_by_other' | 'not_respected'
    treating_doctor_declared?: 'yes' | 'no' | 'unknown'
    referring_doctor_last_name?: string
    referring_doctor_first_name?: string
    treatment_series?: boolean
    sick_leave_days?: number
    sick_leave_end_date?: string
  }
  /** Ce que le praticien dit de la complémentaire du patient. Il remplace ce qui était dit. */
  complementary?: {
    /** La référence de la convention retenue, dans la table des conventions de la situation de facturation. */
    convention?: string | null
    /** La réponse de prise en charge de l'organisme complémentaire : sa référence, et le montant pris en charge, par acte ou au total. */
    coverage_response?: {
      reference?: string
      lines?: Array<{
        code?: string
        amount_cents?: number
      }>
      amount_cents?: number
    }
  }
  lines?: Array<{
    nomenclature: ClaimLineNomenclature
    code: string
    service_date: string
    quantity?: number
    coefficient?: number
    modifiers?: Array<string>
    unit_price_cents?: number | null
    prescriber?: {
      identifier?: string
      key?: string
      specialty_code?: string
      prescribed_on?: string
      exercise_condition?: 'liberal' | 'salaried' | 'volunteer'
      rpps?: string
      rpps_key?: string
      structure_number?: string
      origin?: 'treating_doctor' | 'correspondent' | 'other_pathway' | 'outside_pathway' | 'adapted_renewal' | 'identical_renewal'
      sncf_doctor?: boolean
    }
    execution_place?: 'practice' | 'home' | null
    facility_identifier?: string | null
    documentary_extension?: string | null
    mandatory_child_exam?: boolean | null
    technical_package?: {
      discipline?: string
      treatment_mode?: string
      device_id?: string
      installation_date?: string
      power?: string
      zone?: string
      exam_number?: string
    }
    /** L'entente préalable de l'acte : la réponse de la caisse, la date d'envoi de la demande, son identification. */
    prior_agreement?: {
      /** `favorable`, `no_answer` (pas de réponse dans le délai réglementaire), `emergency` (urgence) ou `not_required` (acte non soumis). */
      response?: 'no_answer' | 'favorable' | 'emergency' | 'not_required'
      sent_on?: string
      identifier?: string
    }
  }>
}

export type ClaimsRetrieveParams = ExpandParams

export interface ClaimsUpdateParams {
  kind?: ClaimKind
  mode?: ClaimMode
  insurance_nature?: ClaimInsuranceNature
  third_party_amo?: boolean
  third_party_amc?: boolean
  coverage?: string | Coverage
  practice_situation?: string | PracticeSituation
  context?: {
    maternity_date?: string
    work_accident_date?: string
    work_accident_number?: string
    common_law_accident?: boolean
    common_law_accident_date?: string
    care_pathway?: 'excluded' | 'emergency' | 'treating_doctor' | 'new_treating_doctor' | 'substitute' | 'recent_generalist' | 'underserved_area' | 'away_from_home' | 'direct_access' | 'outside_direct_access' | 'referred_by_treating' | 'referred_by_other' | 'not_respected'
    treating_doctor_declared?: 'yes' | 'no' | 'unknown'
    referring_doctor_last_name?: string
    referring_doctor_first_name?: string
    treatment_series?: boolean
    sick_leave_days?: number
    sick_leave_end_date?: string
  }
  /** Ce que le praticien dit de la complémentaire du patient. Il remplace ce qui était dit. */
  complementary?: {
    /** La référence de la convention retenue, dans la table des conventions de la situation de facturation. */
    convention?: string | null
    /** La réponse de prise en charge de l'organisme complémentaire : sa référence, et le montant pris en charge, par acte ou au total. */
    coverage_response?: {
      reference?: string
      lines?: Array<{
        code?: string
        amount_cents?: number
      }>
      amount_cents?: number
    }
  }
}

export type ClaimsValidateParams = Record<string, unknown>

export type ClaimsFinalizeParams = Record<string, unknown>

export type ClaimsSecureParams = Record<string, unknown>

export type ClaimsCancelParams = Record<string, unknown>

export type ClaimsReissueParams = Record<string, unknown>

export type CoveragesRetrieveParams = ExpandParams

export interface CoveragesCreateParams {
  source: CoverageSource
  /** Le support à lire. En mode test, un scénario de `/v1/test-helpers/scenarios`. */
  card?: string
  /** Le rang, sur la carte, du bénéficiaire qui reçoit les soins. Obligatoire quand la carte en porte plusieurs. */
  beneficiary_rank?: number
  /** Le mode dégradé : un patient connu, ou un bénéficiaire saisi. */
  patient?: string | Patient
  beneficiary?: {
    nir?: string
    first_name?: string
    last_name?: string
    birth_date?: string
    rank?: number
    quality?: PatientQuality
    insured_first_name?: string | null
    insured_last_name?: string | null
  }
  rights?: CoverageRights
  regime_code?: string
  fund_code?: string
  center_code?: string
  exemptions?: Array<string>
  coverage_code?: string
  /** La complémentaire, telle que l'attestation la décrit. Sans mode de gestion, la part complémentaire de la facture reste inconnue. */
  complementary?: {
    /** `single` : la caisse gère aussi la complémentaire (gestion unique). `separate` : l'organisme complémentaire la gère (gestion séparée). */
    management?: ComplementaryManagement
    /** Le numéro de l'organisme complémentaire. */
    organization?: string
    /** Le numéro d'adhérent. */
    contract?: string
    /** L'indicateur de traitement, deux chiffres : les services que l'organisme ouvre (tiers payant, hors tiers payant). */
    processing_indicator?: string
    /** Le type de convention, deux caractères. */
    convention_type?: string
    /** Le critère secondaire de la recherche de convention. */
    secondary_criterion?: string
    valid_from?: string
    valid_until?: string
  } | null
  valid_until?: string
}

export interface EventsListParams extends ListParams {
  type?: string
  object?: string
  request?: string | ApiRequest
  'created[gte]'?: number
  'created[lte]'?: number
}

export type EventsRetrieveParams = ExpandParams

export type PingParams = ExpandParams

export type StatusParams = ExpandParams

export type PatientsExportParams = ExpandParams

export type PatientsEraseParams = Record<string, unknown>

export interface PatientsListParams extends ListParams {
  name?: string
  nir?: string
}

export type PatientsRetrieveParams = ExpandParams

export type PatientsCoveragesParams = ListParams

export interface PaymentsListParams extends ListParams {
  claim?: string | Claim
  remittance?: string | Remittance
  matched?: 'true' | 'false'
  type?: PaymentType
  status?: RejectionStatus
}

export type PaymentsRetrieveParams = ExpandParams

export interface PaymentsMatchParams {
  /** La facture que le professionnel reconnaît dans ce retour, `clm_…`. */
  claim: string | Claim
}

export interface PractitionersListParams extends ListParams {
  status?: PractitionerStatus
  profession?: string
  fund?: string
}

export interface PractitionersCreateParams {
  /** La carte à lire. En mode test, un scénario de `/v1/test-helpers/scenarios`. */
  card: string
}

export type PractitionersRetrieveParams = ExpandParams

export interface PractitionersUpdateParams {
  /** L'heure de l'envoi quotidien de ses lots, `HH:MM` à l'heure de Paris. Null reprend celle d'Ophelix, 19:00. */
  batch_cutoff: string | null
}

export type PractitionersSuspendParams = Record<string, unknown>

export type PractitionersReactivateParams = Record<string, unknown>

export interface TestHelpersPriorAgreementsResponseParams {
  /** `approved`, `refused`, ou `no_answer` : le silence de la caisse jusqu'au bout du délai. */
  scenario: 'approved' | 'refused' | 'no_answer'
}

export interface PriorAgreementsListParams extends ListParams {
  status?: PriorAgreementStatus
  patient?: string | Patient
  quote?: string | Quote
}

export interface PriorAgreementsCreateParams {
  /** Le devis dont la demande porte les soins, `qt_…`. Elle en reprend praticien, patient et lignes. */
  quote?: string | Quote
  /** Sans devis : le praticien qui demande, `prac_…`. */
  practitioner?: string | Practitioner
  /** Sans devis : le patient, `pat_…`. */
  patient?: string | Patient
  /** Sans devis : les actes demandés. */
  lines?: Array<{
    nomenclature: ClaimLineNomenclature
    code: string
    quantity?: number
    coefficient?: number
  }>
  /** Les soins ne peuvent pas attendre la réponse : la facture porte le code d'urgence dès l'envoi. */
  urgent?: boolean
}

export type PriorAgreementsRetrieveParams = ExpandParams

export interface PriorAgreementsSendParams {
  /** `paper` : le praticien a posté le formulaire. `online` : le téléservice, joué par le simulateur en mode test, pas encore raccordé en production. */
  channel: PriorAgreementChannel
  /** Sur papier, le jour où la demande est partie. Aujourd'hui par défaut. */
  sent_on?: string
}

export interface PriorAgreementsAnswerParams {
  /** `approved` : la caisse accorde. `refused` : elle refuse. */
  decision: 'approved' | 'refused'
  /** Le jour où la réponse est arrivée. Aujourd'hui par défaut. */
  responded_on?: string
  /** L'identification que porte la réponse, jusqu'à 15 chiffres. */
  identifier?: string
}

export type PriorAgreementsCancelParams = Record<string, unknown>

export interface QuotesListParams extends ListParams {
  status?: QuoteStatus
  patient?: string | Patient
  practitioner?: string | Practitioner
}

export interface QuotesCreateParams {
  /** Le praticien qui propose les soins, `prac_…`. */
  practitioner: string | Practitioner
  /** Le patient, `pat_…`. */
  patient: string | Patient
  insurance_nature?: ClaimInsuranceNature
  third_party_amo?: boolean
  third_party_amc?: boolean
  coverage?: string | Coverage
  practice_situation?: string | PracticeSituation
  context?: {
    maternity_date?: string
    work_accident_date?: string
    work_accident_number?: string
    common_law_accident?: boolean
    common_law_accident_date?: string
    care_pathway?: 'excluded' | 'emergency' | 'treating_doctor' | 'new_treating_doctor' | 'substitute' | 'recent_generalist' | 'underserved_area' | 'away_from_home' | 'direct_access' | 'outside_direct_access' | 'referred_by_treating' | 'referred_by_other' | 'not_respected'
    treating_doctor_declared?: 'yes' | 'no' | 'unknown'
    referring_doctor_last_name?: string
    referring_doctor_first_name?: string
    treatment_series?: boolean
    sick_leave_days?: number
    sick_leave_end_date?: string
  }
  complementary?: {
    convention?: string | null
    coverage_response?: {
      reference?: string
      lines?: Array<{
        code?: string
        amount_cents?: number
      }>
      amount_cents?: number
    }
  }
  /** Le dernier jour où le patient peut accepter le devis. Par défaut, 90 jours après sa création. */
  valid_until?: string
  /** Les soins proposés, avec les champs d'une ligne de facture. `service_date` est la date prévue, celle du jour par défaut. */
  lines?: Array<{
    nomenclature: ClaimLineNomenclature
    code: string
    service_date?: string
    quantity?: number
    coefficient?: number
    modifiers?: Array<string>
    unit_price_cents?: number | null
    prescriber?: {
      identifier?: string
      key?: string
      specialty_code?: string
      prescribed_on?: string
      exercise_condition?: 'liberal' | 'salaried' | 'volunteer'
      rpps?: string
      rpps_key?: string
      structure_number?: string
      origin?: 'treating_doctor' | 'correspondent' | 'other_pathway' | 'outside_pathway' | 'adapted_renewal' | 'identical_renewal'
      sncf_doctor?: boolean
    }
    execution_place?: 'practice' | 'home' | null
    facility_identifier?: string | null
    documentary_extension?: string | null
    mandatory_child_exam?: boolean | null
    technical_package?: {
      discipline?: string
      treatment_mode?: string
      device_id?: string
      installation_date?: string
      power?: string
      zone?: string
      exam_number?: string
    }
    /** L'entente préalable de l'acte : la réponse de la caisse, la date d'envoi de la demande, son identification. */
    prior_agreement?: {
      /** `favorable`, `no_answer` (pas de réponse dans le délai réglementaire), `emergency` (urgence) ou `not_required` (acte non soumis). */
      response?: 'no_answer' | 'favorable' | 'emergency' | 'not_required'
      sent_on?: string
      identifier?: string
    }
  }>
}

export type QuotesRetrieveParams = ExpandParams

export interface QuotesUpdateParams {
  insurance_nature?: ClaimInsuranceNature
  third_party_amo?: boolean
  third_party_amc?: boolean
  coverage?: string | Coverage
  practice_situation?: string | PracticeSituation
  context?: {
    maternity_date?: string
    work_accident_date?: string
    work_accident_number?: string
    common_law_accident?: boolean
    common_law_accident_date?: string
    care_pathway?: 'excluded' | 'emergency' | 'treating_doctor' | 'new_treating_doctor' | 'substitute' | 'recent_generalist' | 'underserved_area' | 'away_from_home' | 'direct_access' | 'outside_direct_access' | 'referred_by_treating' | 'referred_by_other' | 'not_respected'
    treating_doctor_declared?: 'yes' | 'no' | 'unknown'
    referring_doctor_last_name?: string
    referring_doctor_first_name?: string
    treatment_series?: boolean
    sick_leave_days?: number
    sick_leave_end_date?: string
  }
  complementary?: {
    convention?: string | null
    coverage_response?: {
      reference?: string
      lines?: Array<{
        code?: string
        amount_cents?: number
      }>
      amount_cents?: number
    }
  }
  /** Le dernier jour où le patient peut accepter le devis. Par défaut, 90 jours après sa création. */
  valid_until?: string
  /** Les soins proposés, avec les champs d'une ligne de facture. `service_date` est la date prévue, celle du jour par défaut. */
  lines?: Array<{
    nomenclature: ClaimLineNomenclature
    code: string
    service_date?: string
    quantity?: number
    coefficient?: number
    modifiers?: Array<string>
    unit_price_cents?: number | null
    prescriber?: {
      identifier?: string
      key?: string
      specialty_code?: string
      prescribed_on?: string
      exercise_condition?: 'liberal' | 'salaried' | 'volunteer'
      rpps?: string
      rpps_key?: string
      structure_number?: string
      origin?: 'treating_doctor' | 'correspondent' | 'other_pathway' | 'outside_pathway' | 'adapted_renewal' | 'identical_renewal'
      sncf_doctor?: boolean
    }
    execution_place?: 'practice' | 'home' | null
    facility_identifier?: string | null
    documentary_extension?: string | null
    mandatory_child_exam?: boolean | null
    technical_package?: {
      discipline?: string
      treatment_mode?: string
      device_id?: string
      installation_date?: string
      power?: string
      zone?: string
      exam_number?: string
    }
    /** L'entente préalable de l'acte : la réponse de la caisse, la date d'envoi de la demande, son identification. */
    prior_agreement?: {
      /** `favorable`, `no_answer` (pas de réponse dans le délai réglementaire), `emergency` (urgence) ou `not_required` (acte non soumis). */
      response?: 'no_answer' | 'favorable' | 'emergency' | 'not_required'
      sent_on?: string
      identifier?: string
    }
  }>
}

export type QuotesFinalizeParams = Record<string, unknown>

export type QuotesAcceptParams = Record<string, unknown>

export type QuotesDeclineParams = Record<string, unknown>

export type QuotesCancelParams = Record<string, unknown>

export interface QuotesInvoiceParams {
  /** La date des soins, qui remplace la date prévue sur chaque ligne. Aujourd'hui par défaut. */
  service_date?: string
  /** La lecture de droits à retenir, `cov_…`. Par défaut, la dernière du patient. */
  coverage?: string | Coverage
}

export interface RejectionsListParams extends ListParams {
  claim?: string | Claim
  remittance?: string | Remittance
  matched?: 'true' | 'false'
  type?: PaymentType
  status?: RejectionStatus
}

export type RejectionsRetrieveParams = ExpandParams

export interface RejectionsMatchParams {
  /** La facture que le professionnel reconnaît dans ce retour, `clm_…`. */
  claim: string | Claim
}

export interface RemittancesListParams extends ListParams {
  with_discrepancies?: 'true' | 'false'
}

export interface RemittancesCreateParams {
  /** Le contenu du fichier, encodé en base 64. */
  contents: string
  /** Le nom du fichier reçu, pour le retrouver. */
  file_name?: string
}

export type RemittancesRetrieveParams = ExpandParams

export type TestHelpersScenariosParams = ExpandParams

export interface TestHelpersReadCardParams {
  card_type: 'vitale' | 'cps'
  scenario: string
}

export interface TestHelpersFeedParams extends ExpandParams {
  events_after?: string | null
  requests_after?: string | null
}

export interface TransmissionsListParams extends ListParams {
  fund?: string
}

export type TransmissionsRetrieveParams = ExpandParams

export type WebhookEndpointsListParams = ListParams

export interface WebhookEndpointsCreateParams {
  url: string
  description?: string | null
  enabled_events: Array<string>
  status?: WebhookEndpointStatus
}

export type WebhookEndpointsRetrieveParams = ExpandParams

export interface WebhookEndpointsUpdateParams {
  url?: string
  description?: string | null
  enabled_events?: Array<string>
  status?: WebhookEndpointStatus
}

export type WebhookEndpointsDeleteParams = Record<string, unknown>

export type WebhookEndpointsDeliveriesParams = ListParams

export type WebhookEndpointsRotateSecretParams = Record<string, unknown>

export type WebhookEndpointsTestParams = Record<string, unknown>

export interface WebhookEndpointsResendParams {
  event: string | Event
}

export type WorkstationActionsListParams = ListParams

export interface WorkstationActionsCreateParams {
  /** Le poste où la carte est insérée. */
  workstation: string | Workstation
  /** `read_vitale`, `read_cps` ou `secure_claim`. */
  type: WorkstationActionType
  /** En mode test, le scénario que répond le simulateur. Voir `/v1/test-helpers/scenarios`. */
  scenario?: string | null
  /** La facture à sécuriser, pour `secure_claim` seulement. Elle doit être `ready`. */
  claim?: string | Claim
}

export type WorkstationActionsRetrieveParams = ExpandParams

export type WorkstationActionsCancelParams = Record<string, unknown>

export type WorkstationPairingCodesRetrieveParams = ExpandParams

export type WorkstationPairingCodesCreateParams = Record<string, unknown>

export type WorkstationPairingCodesConfirmTransferParams = Record<string, unknown>

export type WorkstationPairingCodesCancelParams = Record<string, unknown>

export type WorkstationsListParams = ListParams

export type WorkstationsRetrieveParams = ExpandParams

export interface WorkstationsUpdateParams {
  /** Le nom affiché du poste. */
  name: string
}

export type WorkstationsRevokeParams = Record<string, unknown>
