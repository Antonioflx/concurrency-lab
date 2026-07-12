import { booleanUtil } from '@utils/boolean.util'

export class BooleanEnvParser {
  parse(key: string, fallback = false): boolean {
    return booleanUtil.fromEnv(key, fallback)
  }
}
