import { ISimulationEnvDto } from '@config/dtos/simulation-env.dto'

export class NaiveBatchConfig {
  private constructor(
    private readonly size: number,
    private readonly sleepMs: number,
  ) {}

  static fromEnv(simulation: ISimulationEnvDto): NaiveBatchConfig {
    return new NaiveBatchConfig(simulation.naiveBatchSize, simulation.naiveBatchSleepMs)
  }

  getSize(): number {
    return this.size
  }

  getSleepMs(): number {
    return this.sleepMs
  }
}
