export class ObjectUtil {
  isEmpty(value: object): boolean {
    return Object.keys(value).length === 0
  }

  pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
    const result = {} as Pick<T, K>
    for (const key of keys) {
      if (key in obj) result[key] = obj[key]
    }
    return result
  }

  omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
    const result = { ...obj }
    for (const key of keys) {
      delete (result as Record<string, unknown>)[key as string]
    }
    return result as Omit<T, K>
  }

  deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj))
  }
}

export const objectUtil = new ObjectUtil()
