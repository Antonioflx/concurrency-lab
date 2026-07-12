import { env } from '@config/env'
import { ParticipantDataFetch } from '@data-access/participant-data-fetch'
import { ParticipantResultDomain } from '@domain/participant-result'
import { EmailConfig } from '@domain/email-config'
import { LatencyConfig } from '@domain/latency-config'
import { NaiveBatchConfig } from '@domain/naive-batch-config'
import { ConcurrencyConfig } from '@domain/concurrency-config'
import { ExcelService } from '@services/excel-service'
import { EmailService } from '@services/email-service'
import { EnsureParticipantsUseCase } from '@use-cases/ensure-participants-use-case'
import { RunNaiveSimulationUseCase } from '@use-cases/run-naive-simulation-use-case'
import { RunOptimizedSimulationUseCase } from '@use-cases/run-optimized-simulation-use-case'
import { CompareSimulationsUseCase } from '@use-cases/compare-simulations-use-case'
import { StreamCompareUseCase } from '@use-cases/stream-compare-use-case'
import { SimulationController } from '@controllers/simulation-controller'

const latencyConfig = LatencyConfig.fromEnv(env)
const naiveBatchConfig = NaiveBatchConfig.fromEnv(env)
const concurrencyConfig = ConcurrencyConfig.fromEnv(env)
const emailConfig = EmailConfig.fromEnv(env)

const dataFetch = new ParticipantDataFetch(latencyConfig)
const domain = new ParticipantResultDomain(dataFetch)

const excelService = new ExcelService()
const emailService = new EmailService(emailConfig)

const ensureParticipants = new EnsureParticipantsUseCase()

const naiveUseCase = new RunNaiveSimulationUseCase(domain, ensureParticipants, excelService, emailService, naiveBatchConfig)
const optimizedUseCase = new RunOptimizedSimulationUseCase(domain, ensureParticipants, excelService, emailService, concurrencyConfig)
const compareUseCase = new CompareSimulationsUseCase(naiveUseCase, optimizedUseCase)
const streamCompareUseCase = new StreamCompareUseCase(ensureParticipants, naiveUseCase, optimizedUseCase)

export const simulationController = new SimulationController(naiveUseCase, optimizedUseCase, compareUseCase, streamCompareUseCase)
export { ensureParticipants }
