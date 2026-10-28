import type {ColorToken, Theme} from '@hzblj/kara-theme'

/**
 * The native stack types header colours as `string`, but they only end up in native styles, which take any
 * `ColorValue`, including the opaque `PlatformColor` a system token resolves to on iOS.
 */
export const headerColor = (theme: Theme, token: ColorToken): string => theme.color(token) as string
