import { ILatencyEnvDto } from '@config/dtos/latency-env.dto'

export class LatencyConfig {
  private constructor(
    private readonly min: number,
    private readonly max: number,
  ) {}

  static fromEnv(latency: ILatencyEnvDto): LatencyConfig {
    return new LatencyConfig(latency.networkLatencyMinMs, latency.networkLatencyMaxMs)
  }

  getRandomMs(): number {
    return Math.floor(Math.random() * (this.max - this.min) + this.min)
  }
}
