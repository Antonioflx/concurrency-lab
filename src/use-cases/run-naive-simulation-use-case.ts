import { ParticipantModel } from '@models/participant-model'
import { ParticipantResultDomain, IParticipantRaw } from '@domain/participant-result'
import { CalculationMode } from '@domain/calculation-mode'
import { SimulationMode } from '@domain/simulation-mode'
import { NaiveBatchConfig } from '@domain/naive-batch-config'
import { EnsureParticipantsUseCase } from '@use-cases/ensure-participants-use-case'
import { ExcelService } from '@services/excel-service'
import { EmailService } from '@services/email-service'
import { ISimulationResponseDto } from '@dtos/simulation-response.dto'
import { IParticipantResult } from '@shared-types/simulation-types'
import { sleep } from '@utils/sleep'
import { arrayUtil } from '@utils/array.util'
import { Stopwatch } from '@utils/stopwatch'

export class RunNaiveSimulationUseCase {
  constructor(
    private readonly domain: ParticipantResultDomain,
    private readonly ensureParticipants: EnsureParticipantsUseCase,
    private readonly excelService: ExcelService,
    private readonly emailService: EmailService,
    private readonly batchConfig: NaiveBatchConfig,
  ) {}

  async execute(count: number): Promise<ISimulationResponseDto> {
    await this.ensureParticipants.execute(count)

    const participants = await ParticipantModel.find().limit(count).lean<IParticipantRaw[]>()
    const batches = arrayUtil.chunk(participants, this.batchConfig.getSize())

    const stopwatch = Stopwatch.startNew()
    const results = await this.processBatches(batches)
    const processingTimeMs = stopwatch.elapsedMs()

    const mode = SimulationMode.NAIVE

    const excelFile = await this.excelService.generate(results, mode)
    const emailSent = await this.emailService.send(excelFile, mode)

    return {
      mode: mode.toString(),
      participantsCount: count,
      processingTimeMs,
      concurrencyInfo: {
        batches: batches.length,
        batchSize: this.batchConfig.getSize(),
      },
      excelFile: excelFile.split(/[\\/]/).pop() ?? excelFile,
      emailSent,
      resultsPreview: results,
    }
  }

  private async processBatches(batches: IParticipantRaw[][]): Promise<IParticipantResult[]> {
    const results: IParticipantResult[] = []

    for (let i = 0; i < batches.length; i++) {
      const batchResults = await Promise.all(
        batches[i].map((p) => this.domain.calculate(p, CalculationMode.SEQUENTIAL)),
      )
      results.push(...batchResults)

      if (i < batches.length - 1) {
        await sleep(this.batchConfig.getSleepMs())
      }
    }

    return results
  }
}
