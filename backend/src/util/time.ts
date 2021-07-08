import { logger } from '@remote-mixer/utils'

export async function delay(ms: number): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, ms, undefined))
}

export function howLong(start: number, label: string): void {
  const ms = Date.now() - start
  logger.debug(`${label} took ${ms / 1000}s`)
}
