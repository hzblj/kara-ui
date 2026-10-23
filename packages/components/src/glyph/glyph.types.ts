import type {GlyphName} from '@hzblj/kara-native'
import type {ColorToken, SpaceSize} from '@hzblj/kara-theme'
import type {ReactNode} from 'react'

/**
 * One of the few glyphs kara's own components draw: a search field's magnifier, a row's chevron. Internal: apps draw
 * their own icons with `Icon` / `RnIcon`.
 */
export type GlyphProps = {
  color?: ColorToken
  name: GlyphName
  size?: SpaceSize
}

export type GlyphComponent = (props: GlyphProps) => ReactNode
