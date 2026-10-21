import {Glyph as AndroidGlyph} from './glyph.android'
import {Glyph as IosGlyph} from './glyph.ios'
import type {GlyphComponent} from './glyph.types'
import {GlyphButton as AndroidGlyphButton} from './glyph-button.android'
import {GlyphButton as IosGlyphButton} from './glyph-button.ios'
import type {GlyphButtonComponent} from './glyph-button.types'
import {RnGlyph as AndroidRnGlyph} from './rn-glyph.android'
import {RnGlyph as IosRnGlyph} from './rn-glyph.ios'

export const _ios: GlyphComponent = IosGlyph
export const _android: GlyphComponent = AndroidGlyph
export const _iosRn: GlyphComponent = IosRnGlyph
export const _androidRn: GlyphComponent = AndroidRnGlyph
export const _iosButton: GlyphButtonComponent = IosGlyphButton
export const _androidButton: GlyphButtonComponent = AndroidGlyphButton
