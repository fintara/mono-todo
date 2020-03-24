export async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function capitalize(value: string): string {
  if (value.length === 0) {
    return value
  }

  return value[0].toUpperCase() + value.substring(1)
}

export function toMap<K extends string | number, V extends { id: K }>(list: V[]): Record<K, V> {
  return list.reduce((acc, next) => Object.assign(acc, { [next.id]: next }), {} as Record<K, V>)
}

export function restore<T>(value: any, validation: (arg: any) => arg is T, setter: (arg: T) => void) {
  if (validation(value)) {
    setter(value)
  }
}

export function isString(value: any): value is string {
  return value !== undefined && value !== null && typeof value === "string"
}

export class InMemoryStorage implements Storage {
  private memory: Record<string, any> = {}

  readonly length: number = Object.keys(this.memory).length

  clear(): void {
    this.memory = {}
  }

  getItem(key: string): string | null {
    return this.memory[key] ?? null
  }

  key(index: number): string | null {
    return this.memory[index]
  }

  removeItem(key: string): void {
    delete this.memory[key]
  }

  setItem(key: string, value: string): void {
    this.memory[key] = value
  }
}