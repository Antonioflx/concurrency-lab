import { RunNaiveSimulationUseCase } from '@use-cases/run-naive-simulation-use-case'
import { RunOptimizedSimulationUseCase } from '@use-cases/run-optimized-simulation-use-case'
import { ICompareResponseDto } from '@dtos/compare-response.dto'

export class CompareSimulationsUseCase {
  constructor(
    private readonly naiveUseCase: RunNaiveSimulationUseCase,
    private readonly optimizedUseCase: RunOptimizedSimulationUseCase,
  ) {}

  async execute(count: number): Promise<ICompareResponseDto> {
    const naive = await this.naiveUseCase.execute(count)
    const optimized = await this.optimizedUseCase.execute(count)

    const speedupRaw = naive.processingTimeMs / optimized.processingTimeMs
    const speedup = `${speedupRaw.toFixed(2)}x`

    return {
      participantsCount: count,
      naive: {
        processingTimeMs: naive.processingTimeMs,
        concurrencyInfo: naive.concurrencyInfo,
      },
      optimized: {
        processingTimeMs: optimized.processingTimeMs,
        concurrencyInfo: optimized.concurrencyInfo,
      },
      speedup,
    }
  }
}
