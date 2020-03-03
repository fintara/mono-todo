export async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function capitalize(value: string): string {
  if (value.length === 0) {
    return value
  }

  return value[0].toUpperCase() + value.substring(1)
}