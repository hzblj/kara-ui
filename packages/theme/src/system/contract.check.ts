import {isDynamicColorSupported as AndroidDynamicColor} from './dynamic-color.android'
import {isDynamicColorSupported as IosDynamicColor} from './dynamic-color.ios'
import type {IsDynamicColorSupported} from './dynamic-color.types'
import {usePaletteResolver as AndroidHook, paletteResolver as AndroidResolver} from './palette-resolver.android'
import {usePaletteResolver as IosHook, paletteResolver as IosResolver} from './palette-resolver.ios'
import type {UsePaletteResolver} from './palette-resolver.types'

export const _ios: UsePaletteResolver = IosResolver
export const _android: UsePaletteResolver = AndroidResolver
export const _iosHook: UsePaletteResolver = IosHook
export const _androidHook: UsePaletteResolver = AndroidHook
export const _iosDynamicColor: IsDynamicColorSupported = IosDynamicColor
export const _androidDynamicColor: IsDynamicColorSupported = AndroidDynamicColor
