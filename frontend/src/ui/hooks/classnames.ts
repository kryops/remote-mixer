import { useSettings } from '../../hooks/settings'

export function useClassName(
  className: string,
  lightModeClassName: string
): string {
  const { lightMode } = useSettings()
  return lightMode ? `${className} ${lightModeClassName}` : className
}

export function useClassNames<T extends [...Array<[string, string]>]>(
  ...args: T
): { [P in keyof T]: string } {
  const { lightMode } = useSettings()
  return args.map(([className, lightModeClassName]) =>
    lightMode ? `${className} ${lightModeClassName}` : className
  ) as { [P in keyof T]: string }
}
