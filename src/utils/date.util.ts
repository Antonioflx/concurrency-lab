export class DateUtil {
  now(): Date {
    return new Date()
  }

  nowMs(): number {
    return Date.now()
  }

  toISO(date: Date): string {
    return date.toISOString()
  }

  format(date: Date, locale = 'pt-BR'): string {
    return date.toLocaleDateString(locale)
  }

  formatDateTime(date: Date, locale = 'pt-BR'): string {
    return date.toLocaleString(locale)
  }

  formatTime(date: Date, locale = 'pt-BR'): string {
    return date.toLocaleTimeString(locale)
  }

  fromTimestamp(ms: number): Date {
    return new Date(ms)
  }

  diffMs(from: Date, to: Date): number {
    return to.getTime() - from.getTime()
  }
}

export const dateUtil = new DateUtil()
