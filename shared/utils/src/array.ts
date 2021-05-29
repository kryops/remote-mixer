export function removeFromMutableArray<T>(arr: T[], el: T): void {
  const index = arr.indexOf(el)
  if (index === -1) {
    return
  } else if (index === 0) {
    arr.shift()
  } else if (index === arr.length - 1) {
    arr.pop()
  } else {
    arr.splice(index, 1)
  }
}

export function addToMutableArray<T>(arr: T[], el: T): void {
  if (arr.includes(el)) {
    return
  }
  arr.push(el)
}

export function arrayRange<T>(
  min: number,
  max: number,
  cb: (current: number) => T
): T[] {
  const entries: T[] = []
  for (let current = min; current <= max; current++) {
    entries.push(cb(current))
  }

  return entries
}

export function createRangeArray(min: number, max: number): number[] {
  const arr: number[] = []
  for (let i = min; i <= max; i++) {
    arr.push(i)
  }
  return arr
}

export function forEach<T>(entry: T | T[], cb: (it: T) => void): void {
  if (Array.isArray(entry)) {
    entry.forEach(cb)
  } else {
    cb(entry)
  }
}

export function sortByKey<T extends object>(arr: T[], key: keyof T): T[] {
  return [...arr].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]

    if (aVal === bVal) return 0
    if (aVal === null || aVal === undefined) return -1
    return aVal < bVal ? -1 : 1
  })
}

export function preferredOrder<T>(arr: T[], preferred: T[]): T[] {
  let currentTargetIndex = 0

  preferred.forEach(value => {
    const index = arr.indexOf(value)
    if (index === -1) return
    if (index !== currentTargetIndex) {
      arr.splice(index, 1)
      arr.splice(currentTargetIndex, 0, value)
    }

    currentTargetIndex++
  })

  return arr
}
