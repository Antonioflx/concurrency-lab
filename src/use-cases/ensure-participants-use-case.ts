import { Types } from 'mongoose'
import { ParticipantModel } from '@models/participant-model'
import { IncomeSourceModel } from '@models/income-source-model'
import { DependentModel } from '@models/dependent-model'
import { INCOME_SOURCE_TYPES } from '@shared-types/simulation-types'
import { Logger } from '@utils/logger'
import { numberUtil } from '@utils/number.util'

export class EnsureParticipantsUseCase {
  private readonly logger = new Logger('ensure-participants')

  private readonly INCOME_MIN = 500
  private readonly INCOME_MAX = 5000
  private readonly DEPENDENT_INCOME_MIN = 0
  private readonly DEPENDENT_INCOME_MAX = 2000
  private readonly INCOME_ZERO_PROBABILITY = 0.3
  private readonly MAX_DEPENDENTS = 3

  async execute(count: number): Promise<void> {
    const existing = await ParticipantModel.countDocuments()
    if (existing >= count) return

    const needed = count - existing
    this.logger.info(`Criando ${needed} participante(s)...`)

    for (let i = existing; i < existing + needed; i++) {
      await this.seedOne(i)
    }

    this.logger.info(`Total agora: ${count} participante(s).`)
  }

  private async seedOne(index: number): Promise<void> {
    const participant = await ParticipantModel.create({ name: `Participante ${index + 1}` })
    const participantId = participant._id as Types.ObjectId

    await this.createIncomeSources(participantId)
    await this.createDependents(participantId, participant.name)
  }

  private async createIncomeSources(participantId: Types.ObjectId): Promise<void> {
    const docs = INCOME_SOURCE_TYPES.map((type) => ({
      participantId,
      type,
      value: numberUtil.randomBool(this.INCOME_ZERO_PROBABILITY)
        ? numberUtil.randomInt(this.INCOME_MIN, this.INCOME_MAX)
        : 0,
    }))

    await IncomeSourceModel.insertMany(docs)
  }

  private async createDependents(participantId: Types.ObjectId, participantName: string): Promise<void> {
    const count = numberUtil.randomInt(0, this.MAX_DEPENDENTS + 1)
    if (count === 0) return

    const docs = Array.from({ length: count }, (_, i) => ({
      participantId,
      name: `Dependente ${i + 1} de ${participantName}`,
      income: numberUtil.randomInt(this.DEPENDENT_INCOME_MIN, this.DEPENDENT_INCOME_MAX),
    }))

    await DependentModel.insertMany(docs)
  }
}
