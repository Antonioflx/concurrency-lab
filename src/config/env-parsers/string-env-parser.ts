import { stringUtil } from '@utils/string.util'

export class StringEnvParser {
  parse(key: string, fallback = ''): string {
    return stringUtil.fromEnv(key, fallback)
  }

  parseRequired(key: string): string {
    return stringUtil.fromEnvRequired(key)
  }
}
