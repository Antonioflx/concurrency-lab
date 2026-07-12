export class ArrayUtil {
  chunk<T>(items: T[], size: number): T[][] {
    const chunks: T[][] = []
    for (let i = 0; i < items.length; i += size) {
      chunks.push(items.slice(i, i + size))
    }
    return chunks
  }

  isEmpty<T>(arr: T[]): boolean {
    return arr.length === 0
  }

  unique<T>(arr: T[]): T[] {
    return [...new Set(arr)]
  }

  sum(arr: number[]): number {
    return arr.reduce((acc, v) => acc + v, 0)
  }

  last<T>(arr: T[]): T | undefined {
    return arr[arr.length - 1]
  }
}

export const arrayUtil = new ArrayUtil()
