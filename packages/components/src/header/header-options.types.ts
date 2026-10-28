import type {Theme} from '@hzblj/kara-theme'

import type {HeaderOptions, HeaderParams} from './header.types'

/** Turns a header's actions into the native-stack options each platform draws them from. */
export type HeaderOptionsBuilder = (params: HeaderParams, theme: Theme) => HeaderOptions
