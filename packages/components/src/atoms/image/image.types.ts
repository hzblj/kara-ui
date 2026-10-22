import type {ComponentProps} from 'react'

import type {Image} from './image'

/** Derived from the component itself, so it cannot drift from what `sx(Image)` actually accepts. */
export type ImageProps = ComponentProps<typeof Image>
