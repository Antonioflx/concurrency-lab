import { EnsureParticipantsUseCase } from '@use-cases/ensure-participants-use-case'
import { RunNaiveSimulationUseCase } from '@use-cases/run-naive-simulation-use-case'
import { RunOptimizedSimulationUseCase } from '@use-cases/run-optimized-simulation-use-case'
import { ISimulationResponseDto } from '@dtos/simulation-response.dto'
import { ICompareResponseDto } from '@dtos/compare-response.dto'
import { ISseEnvelopeDto, TSseEventType } from '@dtos/sse-envelope.dto'

export type TStreamResultPayload = Omit<ISimulationResponseDto, 'resultsPreview'>
export type TStreamErrorPayload = { message: string }
export type TStreamPayload = TStreamResultPayload | ICompareResponseDto | TStreamErrorPayload
export type TStreamEnvelope = ISseEnvelopeDto<TStreamPayload>

export class StreamCompareUseCase {
  constructor(
    private readonly ensureParticipants: EnsureParticipantsUseCase,
    private readonly naiveUseCase: RunNaiveSimulationUseCase,
    private readonly optimizedUseCase: RunOptimizedSimulationUseCase,
  ) {}

  async execute(count: number, onEvent: (envelope: TStreamEnvelope) => void): Promise<void> {
    await this.ensureParticipants.execute(count)

    const emit = (event: TSseEventType, payload: TStreamPayload): void => {
      onEvent({ event, at: new Date().toISOString(), payload })
    }

    const toSlim = ({ resultsPreview: _, ...rest }: ISimulationResponseDto): TStreamResultPayload => rest

    const naivePromise = this.naiveUseCase.execute(count).then((result) => {
      emit('result', toSlim(result))
      return result
    })

    const optimizedPromise = this.optimizedUseCase.execute(count).then((result) => {
      emit('result', toSlim(result))
      return result
    })

    const [naive, optimized] = await Promise.all([naivePromise, optimizedPromise])

    const speedupRaw = naive.processingTimeMs / optimized.processingTimeMs

    emit('summary', {
      participantsCount: count,
      naive: {
        processingTimeMs: naive.processingTimeMs,
        concurrencyInfo: naive.concurrencyInfo,
      },
      optimized: {
        processingTimeMs: optimized.processingTimeMs,
        concurrencyInfo: optimized.concurrencyInfo,
      },
      speedup: `${speedupRaw.toFixed(2)}x`,
    })
  }
}
