export { DEFAULT_BASE_URL, Ophelix, type OphelixConfig } from './client'
export {
  type ErrorBody,
  OphelixAPIError,
  OphelixAuthenticationError,
  OphelixConnectionError,
  OphelixError,
  OphelixIdempotencyError,
  OphelixInvalidRequestError,
  OphelixPermissionError,
  OphelixRateLimitError,
  OphelixSignatureVerificationError,
} from './errors'
export type * from './generated/types'
export { API_VERSION, VERSION } from './generated/version'
export { ListPromise, type Page } from './list'
export type { ExpandParams, ListParams } from './params'
export type { OphelixResponse, RequestOptions, ResponseMeta } from './requester'
export {
  computeSignature,
  constructEvent,
  DEFAULT_TOLERANCE,
  generateTestHeader,
  SIGNATURE_HEADER,
  type VerifyOptions,
  verifySignature,
  webhooks,
} from './webhooks'

import { Ophelix } from './client'
export default Ophelix
