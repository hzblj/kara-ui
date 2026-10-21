import {Box} from '../box'
import type {GlassViewProps} from './glass-view.types'

/** The capsule drawn where there is no Liquid Glass to draw. */
export const GlassFallback = ({children, interactive: _interactive, tint, ...props}: GlassViewProps) => (
  <Box borderRadius="full" {...props} bg={tint ?? 'fill.tertiary'}>
    {children}
  </Box>
)
