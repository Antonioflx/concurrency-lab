import { TSimulationMode } from '@shared-types/simulation-types'
import { IParticipantResultDto } from '@dtos/participant-result.dto'
import { INaiveConcurrencyInfoDto, IOptimizedConcurrencyInfoDto } from '@dtos/concurrency-info.dto'

export interface ISimulationResponseDto {
  mode: TSimulationMode
  participantsCount: number
  processingTimeMs: number
  concurrencyInfo: INaiveConcurrencyInfoDto | IOptimizedConcurrencyInfoDto
  excelFile: string
  emailSent: boolean
  resultsPreview: IParticipantResultDto[]
}
