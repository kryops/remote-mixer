export function formatMessage(message: number[] | null): string {
  if (!message) return 'null'
  const hex = `[${message
    .map(it => {
      const str = it.toString(16)
      return str.length === 1 ? `0${str}` : str
    })
    .join(' ')}]`

  const data = message.slice(9, -1)
  if (data.length) {
    return `${hex} (${data.map(it => String.fromCharCode(it)).join(' ')})`
  }

  return hex
}
