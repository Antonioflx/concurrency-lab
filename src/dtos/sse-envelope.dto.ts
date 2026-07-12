export type TSseEventType = 'result' | 'summary' | 'error'

export interface ISseEnvelopeDto<T> {
  event: TSseEventType
  at: string
  payload: T
}
