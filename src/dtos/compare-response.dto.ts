import { INaiveConcurrencyInfoDto, IOptimizedConcurrencyInfoDto } from '@dtos/concurrency-info.dto'

export interface ICompareSideDto {
  processingTimeMs: number
  concurrencyInfo: INaiveConcurrencyInfoDto | IOptimizedConcurrencyInfoDto
}

export interface ICompareResponseDto {
  participantsCount: number
  naive: ICompareSideDto
  optimized: ICompareSideDto
  speedup: string
}
