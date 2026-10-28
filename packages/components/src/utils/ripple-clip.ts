import {StyleSheet, type ViewStyle} from 'react-native'

/** What lays out a view's children — it goes on the pressable inside, so the content sits where the caller put it. */
const CONTENT_KEYS = new Set<string>([
  'alignContent',
  'alignItems',
  'columnGap',
  'flexDirection',
  'flexWrap',
  'gap',
  'justifyContent',
  'padding',
  'paddingBottom',
  'paddingEnd',
  'paddingHorizontal',
  'paddingLeft',
  'paddingRight',
  'paddingStart',
  'paddingTop',
  'paddingVertical',
  'rowGap',
])

const FILL: ViewStyle = {flexGrow: 1}

/** What gives the outer view a height of its own, rather than its content's. */
const SIZING_KEYS = ['aspectRatio', 'flex', 'flexBasis', 'flexGrow', 'height', 'minHeight'] as const

/**
 * Splits a resolved style for a pressable with an Android ripple. The ripple is drawn as the pressable's foreground,
 * which its own `overflow: hidden` does not clip — so it would spill past rounded corners. A parent clips its
 * children's foregrounds, though: the outer view takes the shape, background, border and outer layout and clips; the
 * pressable inside takes the padding and the content layout and fills it, so the ripple covers the whole card and
 * stops at its corners.
 */
export const splitForRipple = (style: ViewStyle | undefined): {inner: ViewStyle[]; outer: ViewStyle} => {
  const flat = StyleSheet.flatten(style) ?? {}
  const outer: Record<string, unknown> = {overflow: 'hidden'}
  const inner: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(flat)) {
    if (CONTENT_KEYS.has(key)) {
      inner[key] = value
    } else if (key !== 'overflow') {
      outer[key] = value
    }
  }

  // Only a sized outer view needs the pressable stretched to it. Sized by its content it must not be: Yoga grows a
  // `flexGrow` child of a fit-content parent to the most it may take — inside a row centred on its cross axis, the
  // pressable would stretch to the row's full height and leave its content at the top.
  const sized =
    SIZING_KEYS.some(key => flat[key] !== undefined) || (flat.top !== undefined && flat.bottom !== undefined)

  return {inner: sized ? [FILL, inner as ViewStyle] : [inner as ViewStyle], outer: outer as ViewStyle}
}
