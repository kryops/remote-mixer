import { FC, memo } from 'react'

export function memoInProduction<T>(component: FC<T>) {
  // This sometimes becomes necessary when hot reloading does not work with memo components.
  return memo(component)
  // return process.env.NODE_ENV === 'production' ? memo(component) : component
}
