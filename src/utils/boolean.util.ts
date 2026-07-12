export class BooleanUtil {
  fromString(value: unknown): boolean {
    if (typeof value === 'boolean') return value
    return String(value).toLowerCase() === 'true'
  }

  fromEnv(key: string, fallback = false): boolean {
    const val = process.env[key]
    if (!val) return fallback
    return this.fromString(val)
  }
}

export const booleanUtil = new BooleanUtil()
