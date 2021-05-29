export function isTruthy<T>(x: T | undefined | null | false | 0 | ''): x is T {
  return !!x
}

export function isUnique<T>(el: T, index: number, arr: T[]): boolean {
  return arr.indexOf(el) === index
}
