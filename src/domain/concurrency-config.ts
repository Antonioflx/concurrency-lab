import { ISimulationEnvDto } from '@config/dtos/simulation-env.dto'

export class ConcurrencyConfig {
  private constructor(private readonly limit: number) {}

  static fromEnv(simulation: ISimulationEnvDto): ConcurrencyConfig {
    return new ConcurrencyConfig(simulation.optimizedConcurrencyLimit)
  }

  getLimit(): number {
    return this.limit
  }
}
