import type {ComponentProps} from 'react'

import type {Box} from './box'

/** Derived from the component itself, so it cannot drift from what `sx(View)` actually accepts. */
export type BoxProps = ComponentProps<typeof Box>
