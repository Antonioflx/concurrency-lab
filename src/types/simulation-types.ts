export type TSimulationMode = 'naive' | 'optimized'

export type TIncomeSourceType =
  | 'salary'
  | 'freelance'
  | 'pension'
  | 'rental'
  | 'benefits'
  | 'investments'
  | 'alimony'
  | 'royalties'
  | 'sideBusiness'
  | 'other'

export const INCOME_SOURCE_TYPES: TIncomeSourceType[] = [
  'salary',
  'freelance',
  'pension',
  'rental',
  'benefits',
  'investments',
  'alimony',
  'royalties',
  'sideBusiness',
  'other',
]

export interface IParticipantResult {
  participantId: string
  name: string
  totalIncome: number
  membersCount: number
  perCapitaIncome: number
  perCapitaIncomeFormatted: string
}
