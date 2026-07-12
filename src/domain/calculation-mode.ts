const VALID_MODES = ['sequential', 'parallel'] as const

type TCalculationModeValue = (typeof VALID_MODES)[number]

export class CalculationMode {
  static readonly SEQUENTIAL = new CalculationMode('sequential')
  static readonly PARALLEL = new CalculationMode('parallel')

  private constructor(private readonly value: TCalculationModeValue) {}

  static fromString(raw: string): CalculationMode {
    if (raw === 'sequential') return CalculationMode.SEQUENTIAL
    if (raw === 'parallel') return CalculationMode.PARALLEL
    throw new Error(`CalculationMode inválido: "${raw}". Valores aceitos: ${VALID_MODES.join(', ')}`)
  }

  static isValid(raw: string): boolean {
    return (VALID_MODES as readonly string[]).includes(raw)
  }

  isParallel(): boolean {
    return this.value === 'parallel'
  }

  isSequential(): boolean {
    return this.value === 'sequential'
  }

  toString(): string {
    return this.value
  }
}
