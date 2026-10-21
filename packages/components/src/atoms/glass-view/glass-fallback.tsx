import {Box} from '../box'
import type {GlassViewProps} from './glass-view.types'

/**
 * The capsule drawn where there is no Liquid Glass to draw: the glass buttons' own translucent fill, so whatever sits
 * on the glass — usually content meant for a colourful backdrop — stays readable, the way it would on real glass.
 */
export const GlassFallback = ({children, interactive: _interactive, tint, ...props}: GlassViewProps) => (
  <Box borderRadius="full" {...props} bg={tint ?? 'btn.bg.glass.base'}>
    {children}
  </Box>
)
