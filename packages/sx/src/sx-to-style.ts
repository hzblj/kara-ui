import {opacity, radii, resolvePaletteColor, resolveShadow, type Theme, zIndex} from '@hzblj/kara-theme'
import {StyleSheet, type ViewStyle} from 'react-native'
import type {StyleSx} from './sx.types'
import {sxPadding} from './sx-padding'

/**
 * React Native takes transforms as one ordered array, so — unlike the modifier paths, where each is
 * its own entry — they have to be collected before any of them can be written to the style.
 */
/** React Native also accepts `transform` as a CSS string; `Extract` keeps the array form's element. */
type Transform = Extract<NonNullable<ViewStyle['transform']>, readonly unknown[]>[number]

const transform = (sx: StyleSx): ViewStyle['transform'] => {
  const transforms: Transform[] = []

  if (sx.offsetX !== undefined) {
    transforms.push({translateX: sx.offsetX})
  }

  if (sx.offsetY !== undefined) {
    transforms.push({translateY: sx.offsetY})
  }

  if (sx.rotate !== undefined) {
    transforms.push({rotate: `${sx.rotate}deg`})
  }

  if (typeof sx.scale === 'number') {
    transforms.push({scale: sx.scale})
  } else if (sx.scale !== undefined) {
    if (sx.scale.x !== undefined) {
      transforms.push({scaleX: sx.scale.x})
    }

    if (sx.scale.y !== undefined) {
      transforms.push({scaleY: sx.scale.y})
    }
  }

  return transforms.length > 0 ? transforms : undefined
}

/**
 * A React Native view has a single border slot, so a ring shadow rides it — an explicit
 * `borderColor`/`borderWidth` on the same box is written later and wins, where the modifier paths
 * draw the ring and the border as two separate strokes.
 */
const shadowStyle = (sx: StyleSx, theme: Theme): ViewStyle => {
  if (!sx.shadow) {
    return {}
  }

  const {colors, geometry} = resolveShadow(theme, sx.shadow)
  const style: ViewStyle = {}

  if (geometry.ring && colors.ring) {
    style.borderColor = resolvePaletteColor(theme, colors.ring)
    style.borderWidth = Math.max(geometry.ring.width, StyleSheet.hairlineWidth)
  }

  if (geometry.drop && colors.drop) {
    style.elevation = geometry.drop.y * 2
    style.shadowColor = resolvePaletteColor(theme, colors.drop)
    style.shadowOffset = {height: geometry.drop.y, width: 0}
    style.shadowOpacity = 1
    style.shadowRadius = geometry.drop.radius
  }

  return style
}

export const sxToStyle = (sx: StyleSx, theme: Theme): ViewStyle => {
  const style: ViewStyle = {...shadowStyle(sx, theme)}
  const padding = sxPadding(sx)

  // Only the sides that resolved: a side written as `undefined` is a key React Native still walks on every mount.
  if (padding) {
    if (padding.top !== undefined) {
      style.paddingTop = padding.top
    }

    if (padding.bottom !== undefined) {
      style.paddingBottom = padding.bottom
    }

    if (padding.leading !== undefined) {
      style.paddingLeft = padding.leading
    }

    if (padding.trailing !== undefined) {
      style.paddingRight = padding.trailing
    }
  }

  if (sx.wide) {
    style.width = '100%'
  }

  if (sx.tall) {
    style.height = '100%'
  }

  if (sx.w !== undefined) {
    style.width = sx.w
  }

  if (sx.h !== undefined) {
    style.height = sx.h
  }

  if (sx.minW !== undefined) {
    style.minWidth = sx.minW
  }

  if (sx.minH !== undefined) {
    style.minHeight = sx.minH
  }

  if (sx.bg) {
    style.backgroundColor = theme.color(sx.bg)
  }

  if (sx.borderColor) {
    style.borderColor = theme.color(sx.borderColor)
  }

  if (sx.borderWidth !== undefined) {
    style.borderWidth = sx.borderWidth
  }

  if (sx.borderRadius) {
    style.borderRadius = radii[sx.borderRadius]
  }

  if (sx.opacity) {
    style.opacity = opacity[sx.opacity]
  }

  if (sx.zIndex) {
    style.zIndex = zIndex[sx.zIndex]
  }

  if (sx.blur !== undefined) {
    style.filter = [{blur: sx.blur}]
  }

  const transforms = transform(sx)

  if (transforms) {
    style.transform = transforms
  }

  return style
}
