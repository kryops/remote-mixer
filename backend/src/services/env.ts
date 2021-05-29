import { platform } from 'os'

export const isDevelopment = process.env.NODE_ENV === 'development'
export const onWindows = platform() === 'win32'
