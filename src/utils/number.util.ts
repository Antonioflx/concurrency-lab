export class NumberUtil {
  toInt(value: unknown): number {
    const parsed = parseInt(String(value), 10)
    if (isNaN(parsed)) return 0
    return parsed
  }

  toFloat(value: unknown, decimals = 2): number {
    const parsed = parseFloat(String(value))
    if (isNaN(parsed)) return 0
    return parseFloat(parsed.toFixed(decimals))
  }

  format(value: number, locale = 'pt-BR'): string {
    return value.toLocaleString(locale)
  }

  formatCurrency(value: number, locale = 'pt-BR', currency = 'BRL'): string {
    return value.toLocaleString(locale, { style: 'currency', currency })
  }

  clamp(value: number, min: number, max: number): number {
    if (value < min) return min
    if (value > max) return max
    return value
  }

  isValid(value: unknown): boolean {
    return !isNaN(Number(value)) && value !== null && value !== ''
  }

  randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min)
  }

  randomFloat(min: number, max: number, decimals = 2): number {
    return this.toFloat(Math.random() * (max - min) + min, decimals)
  }

  randomBool(probability = 0.5): boolean {
    return Math.random() > probability
  }

  fromEnv(key: string, fallback: number): number {
    const val = process.env[key]
    if (!val) return fallback
    const parsed = parseInt(val, 10)
    if (isNaN(parsed)) return fallback
    return parsed
  }

  fromEnvRequired(key: string): number {
    const val = process.env[key]
    const parsed = val ? parseInt(val, 10) : NaN

    if (!val || isNaN(parsed)) {
      console.error(`[env] Variável obrigatória ausente ou inválida (number): ${key}`)
      process.exit(1)
    }

    return parsed
  }
}

export const numberUtil = new NumberUtil()
