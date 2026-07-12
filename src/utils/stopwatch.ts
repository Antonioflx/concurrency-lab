import { dateUtil } from '@utils/date.util'

export class Stopwatch {
  private startMs = 0

  start(): void {
    this.startMs = dateUtil.nowMs()
  }

  elapsedMs(): number {
    return dateUtil.nowMs() - this.startMs
  }

  static startNew(): Stopwatch {
    const sw = new Stopwatch()
    sw.start()
    return sw
  }
}
