export function formatMessage(message: number[]): string {
  return `[${message.map(it => it.toString(16)).join(' ')}]`
}
