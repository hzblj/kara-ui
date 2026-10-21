import {GlassFallback} from './glass-fallback'
import type {GlassViewComponent, GlassViewProps} from './glass-view.types'

/** Android has no Liquid Glass, so this is always the fallback capsule. */
export const GlassView: GlassViewComponent = (props: GlassViewProps) => <GlassFallback {...props} />
