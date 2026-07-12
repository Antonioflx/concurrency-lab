export class StringUtil {
  isEmpty(value: unknown): boolean {
    return value === null || value === undefined || String(value).trim() === ''
  }

  trim(value: string): string {
    return value.trim()
  }

  toUpperCase(value: string): string {
    return value.toUpperCase()
  }

  toLowerCase(value: string): string {
    return value.toLowerCase()
  }

  capitalize(value: string): string {
    if (this.isEmpty(value)) return ''
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
  }

  truncate(value: string, maxLength: number, suffix = '...'): string {
    if (value.length <= maxLength) return value
    return value.slice(0, maxLength - suffix.length) + suffix
  }

  fromEnv(key: string, fallback = ''): string {
    return process.env[key] ?? fallback
  }

  fromEnvRequired(key: string): string {
    const val = process.env[key]

    if (!val || val.trim() === '') {
      console.error(`[env] Variável obrigatória ausente (string): ${key}`)
      process.exit(1)
    }

    return val
  }
}

export const stringUtil = new StringUtil()
