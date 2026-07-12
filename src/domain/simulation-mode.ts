const VALID_MODES = ['naive', 'optimized'] as const

type TSimulationModeValue = (typeof VALID_MODES)[number]

export class SimulationMode {
  static readonly NAIVE = new SimulationMode('naive')
  static readonly OPTIMIZED = new SimulationMode('optimized')

  private constructor(private readonly value: TSimulationModeValue) {}

  static fromString(raw: string): SimulationMode {
    if (raw === 'naive') return SimulationMode.NAIVE
    if (raw === 'optimized') return SimulationMode.OPTIMIZED
    throw new Error(`SimulationMode inválido: "${raw}". Valores aceitos: ${VALID_MODES.join(', ')}`)
  }

  static isValid(raw: string): boolean {
    return (VALID_MODES as readonly string[]).includes(raw)
  }

  isNaive(): boolean {
    return this.value === 'naive'
  }

  isOptimized(): boolean {
    return this.value === 'optimized'
  }

  toString(): TSimulationModeValue {
    return this.value
  }
}
