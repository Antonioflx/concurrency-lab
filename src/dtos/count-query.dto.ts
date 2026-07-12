import { numberUtil } from '@utils/number.util'

const DEFAULT_COUNT = 20
const MIN_COUNT = 1
const MAX_COUNT = 500

export interface ICountQueryDto {
  count: number
}

interface ICountQueryParseResult {
  data?: ICountQueryDto
  error?: string
}

export class CountQueryDto {
  static parse(raw: unknown): ICountQueryParseResult {
    if (raw === undefined || raw === '') {
      return { data: { count: DEFAULT_COUNT } }
    }

    if (!numberUtil.isValid(raw)) {
      return { error: `O parâmetro "count" deve ser um inteiro >= ${MIN_COUNT}.` }
    }

    const count = numberUtil.toInt(raw)

    if (count < MIN_COUNT) {
      return { error: `O parâmetro "count" deve ser um inteiro >= ${MIN_COUNT}.` }
    }

    if (count > MAX_COUNT) {
      return { error: `O parâmetro "count" não pode ultrapassar ${MAX_COUNT}.` }
    }

    return { data: { count } }
  }
}
