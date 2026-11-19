import type {HeaderItemMorphCheck, HeaderItemMorphs} from './header-item-morph.types'

/** Android has no bar item glass to morph: a collapsible action swaps its label for the icon. */
export const morphsNatively: HeaderItemMorphCheck = () => false

export const withHeaderItemMorphs: HeaderItemMorphs = options => options
