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

  return {inner: [FILL, inner as ViewStyle], outer: outer as ViewStyle}
}
