export function formatMessage(message: number[] | null): string {
  if (!message) return 'null'
  return `[${message
    .map(it => {
      const str = it.toString(16)
      return str.length === 1 ? `0${str}` : str
    })
    .join(' ')}]`
}
