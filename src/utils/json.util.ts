export class JsonUtil {
  stringify(value: unknown, indent = 2): string {
    return JSON.stringify(value, null, indent)
  }

  parse<T = unknown>(value: string): T {
    return JSON.parse(value) as T
  }

  toSseData(value: unknown, indent = 2): string {
    return this.stringify(value, indent)
      .split('\n')
      .map((line) => `data: ${line}`)
      .join('\n')
  }
}

export const jsonUtil = new JsonUtil()
