import { IncomeSourceModel } from '@models/income-source-model'
import { DependentModel } from '@models/dependent-model'
import { TIncomeSourceType } from '@shared-types/simulation-types'
import { TNullable } from '@shared-types/generic-types'
import { LatencyConfig } from '@domain/latency-config'
import { sleep } from '@utils/sleep'

export class ParticipantDataFetch {
  constructor(private readonly latency: LatencyConfig) {}

  async fetchIncomeSourceValue(participantId: string, type: TIncomeSourceType): Promise<number> {
    await sleep(this.latency.getRandomMs())
    const record: TNullable<{ value: number }> = await IncomeSourceModel
      .findOne({ participantId, type })
      .select('value')
      .lean()
    return record?.value ?? 0
  }

  async listDependentIds(participantId: string): Promise<string[]> {
    const dependents = await DependentModel
      .find({ participantId })
      .select('_id')
      .lean()
    return dependents.map((d) => String(d._id))
  }

  async fetchDependentIncome(dependentId: string): Promise<number> {
    await sleep(this.latency.getRandomMs())
    const dependent: TNullable<{ income: number }> = await DependentModel
      .findById(dependentId)
      .select('income')
      .lean()
    return dependent?.income ?? 0
  }
}
