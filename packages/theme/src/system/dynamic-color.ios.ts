import type {IsDynamicColorSupported} from './dynamic-color.types'

/** iOS has no wallpaper-derived colours; its semantic colours already follow the appearance on their own. */
export const isDynamicColorSupported: IsDynamicColorSupported = () => false
