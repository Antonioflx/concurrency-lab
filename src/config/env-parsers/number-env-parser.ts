import { numberUtil } from '@utils/number.util'

export class NumberEnvParser {
  parse(key: string, fallback: number): number {
    return numberUtil.fromEnv(key, fallback)
  }

  parseRequired(key: string): number {
    return numberUtil.fromEnvRequired(key)
  }
}
