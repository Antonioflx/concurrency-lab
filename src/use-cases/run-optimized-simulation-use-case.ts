import pLimit from 'p-limit'
import { ParticipantModel } from '@models/participant-model'
import { ParticipantResultDomain, IParticipantRaw } from '@domain/participant-result'
import { CalculationMode } from '@domain/calculation-mode'
import { SimulationMode } from '@domain/simulation-mode'
import { ConcurrencyConfig } from '@domain/concurrency-config'
import { EnsureParticipantsUseCase } from '@use-cases/ensure-participants-use-case'
import { ExcelService } from '@services/excel-service'
import { EmailService } from '@services/email-service'
import { ISimulationResponseDto } from '@dtos/simulation-response.dto'
import { Stopwatch } from '@utils/stopwatch'

export class RunOptimizedSimulationUseCase {
  constructor(
    private readonly domain: ParticipantResultDomain,
    private readonly ensureParticipants: EnsureParticipantsUseCase,
    private readonly excelService: ExcelService,
    private readonly emailService: EmailService,
    private readonly concurrencyConfig: ConcurrencyConfig,
  ) {}

  async execute(count: number): Promise<ISimulationResponseDto> {
    await this.ensureParticipants.execute(count)

    const participants = await ParticipantModel.find().limit(count).lean<IParticipantRaw[]>()
    const limit = pLimit(this.concurrencyConfig.getLimit())

    const stopwatch = Stopwatch.startNew()

    const results = await Promise.all(
      participants.map((p) => limit(() => this.domain.calculate(p, CalculationMode.PARALLEL))),
    )

    const processingTimeMs = stopwatch.elapsedMs()
    const mode = SimulationMode.OPTIMIZED

    const excelFile = await this.excelService.generate(results, mode)
    const emailSent = await this.emailService.send(excelFile, mode)

    return {
      mode: mode.toString(),
      participantsCount: count,
      processingTimeMs,
      concurrencyInfo: {
        concurrencyLimit: this.concurrencyConfig.getLimit(),
      },
      excelFile: excelFile.split(/[\\/]/).pop() ?? excelFile,
      emailSent,
      resultsPreview: results,
    }
  }
}
