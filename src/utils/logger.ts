import { env } from '@config/env'

type TLogLevel = 'info' | 'warn' | 'error' | 'debug'

interface ILogEntry {
  level: TLogLevel
  source: string
  message: string
  timestamp: string
}

export class Logger {
  constructor(private readonly source: string) {}

  info(message: string): void {
    this.print('info', message)
  }

  warn(message: string): void {
    this.print('warn', message)
  }

  error(message: string, cause?: unknown): void {
    this.print('error', message)
    if (cause !== undefined) console.error(cause)
  }

  debug(message: string): void {
    if (env.nodeEnv !== 'development') return
    this.print('debug', message)
  }

  private buildEntry(level: TLogLevel, message: string): ILogEntry {
    return {
      level,
      source: this.source,
      message,
      timestamp: new Date().toISOString(),
    }
  }

  private format(entry: ILogEntry): string {
    return `[${entry.timestamp}] [${entry.level.toUpperCase()}] [${entry.source}] ${entry.message}`
  }

  private print(level: TLogLevel, message: string): void {
    const entry = this.buildEntry(level, message)
    const formatted = this.format(entry)

    if (level === 'error') {
      console.error(formatted)
      return
    }

    if (level === 'warn') {
      console.warn(formatted)
      return
    }

    console.log(formatted)
  }
}
