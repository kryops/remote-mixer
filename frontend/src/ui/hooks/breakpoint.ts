import { useEffect, useState } from 'react'

export function useBreakpoint(breakpoint: number): boolean {
  const [match, setMatch] = useState(window.innerWidth >= breakpoint)

  useEffect(() => {
    let oldMatch = window.innerWidth >= breakpoint
    const listener = () => {
      const newMatch = window.innerWidth >= breakpoint
      if (newMatch !== oldMatch) {
        oldMatch = newMatch
        setMatch(newMatch)
      }
    }

    window.addEventListener('resize', listener, false)
    window.addEventListener('orientationchange', listener, false)

    return () => {
      window.removeEventListener('resize', listener, false)
      window.removeEventListener('orientationchange', listener, false)
    }
  }, [breakpoint])

  return match
}
