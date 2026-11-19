import type {Theme} from '@hzblj/kara-theme'

import type {HeaderAction, HeaderOptions} from './header.types'

/** Adds the native morph of the collapsible trailing text actions to a screen's header options (iOS 26). */
export type HeaderItemMorphs = (
  options: HeaderOptions,
  trailingActions: HeaderAction[] | undefined,
  theme: Theme
) => HeaderOptions

/** Whether a trailing action morphs natively, so its item keeps its label and the morph view does the rest. */
export type HeaderItemMorphCheck = (action: HeaderAction) => boolean
