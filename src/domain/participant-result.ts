import { IParticipantResult, INCOME_SOURCE_TYPES } from '@shared-types/simulation-types'
import { ParticipantDataFetch } from '@data-access/participant-data-fetch'
import { CalculationMode } from '@domain/calculation-mode'
import { numberUtil } from '@utils/number.util'

export interface IParticipantRaw {
  _id: unknown
  name: string
}

export class ParticipantResultDomain {
  constructor(private readonly dataFetch: ParticipantDataFetch) {}

  async calculate(
    participant: IParticipantRaw,
    mode: CalculationMode,
  ): Promise<IParticipantResult> {
    const id = String(participant._id)

    const sourcesTotal = await this.sumIncomeSources(id, mode)
    const dependentIds = await this.dataFetch.listDependentIds(id)
    const dependentsTotal = await this.sumDependentIncomes(dependentIds, mode)

    const totalIncome = sourcesTotal + dependentsTotal
    const membersCount = 1 + dependentIds.length
    const perCapitaIncome = Math.round(totalIncome / membersCount)

    return {
      participantId: id,
      name: participant.name,
      totalIncome,
      membersCount,
      perCapitaIncome,
      perCapitaIncomeFormatted: numberUtil.formatCurrency(perCapitaIncome),
    }
  }

  private async sumIncomeSources(id: string, mode: CalculationMode): Promise<number> {
    if (mode.isParallel()) {
      const values = await Promise.all(
        INCOME_SOURCE_TYPES.map((type) => this.dataFetch.fetchIncomeSourceValue(id, type)),
      )
      return values.reduce((sum, v) => sum + v, 0)
    }

    let total = 0
    for (const type of INCOME_SOURCE_TYPES) {
      total += await this.dataFetch.fetchIncomeSourceValue(id, type)
    }
    return total
  }

  private async sumDependentIncomes(ids: string[], mode: CalculationMode): Promise<number> {
    if (mode.isParallel()) {
      const values = await Promise.all(
        ids.map((depId) => this.dataFetch.fetchDependentIncome(depId)),
      )
      return values.reduce((sum, v) => sum + v, 0)
    }

    let total = 0
    for (const depId of ids) {
      total += await this.dataFetch.fetchDependentIncome(depId)
    }
    return total
  }
}
