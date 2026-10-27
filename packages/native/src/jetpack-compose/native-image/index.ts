import {requireKaraView} from '../../require-view'

export type NativeImageProps = {
  fontFamily?: string
  /** In sp, for the label it falls back to. */
  fontSize?: number
  /** A numeric weight (`'500'`), for the label it falls back to. Medium when unset. */
  fontWeight?: string
  /** In dp. 20 when unset; the width follows the image's proportions. */
  imageHeight?: number
  /** What TalkBack says, and what is drawn instead, in the surrounding content colour, if the image cannot be loaded. */
  label?: string
  /** A URL (http, https, file, content or a data URI) or a drawable or raw resource's name; raster or SVG. */
  source?: string
}

/** An image loaded natively, raster or SVG, at a height and in its own colours, inside a Compose host. */
export const NativeImage = requireKaraView<NativeImageProps>('NativeImageView')
