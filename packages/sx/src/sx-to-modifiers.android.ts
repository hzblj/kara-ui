import {
  align,
  alpha,
  animateContentSize,
  type BuiltinShape,
  background,
  blur,
  clip,
  defaultMinSize,
  dropShadow,
  fillMaxHeight,
  fillMaxWidth,
  graphicsLayer,
  height as heightModifier,
  imePadding,
  innerShadow,
  type ModifierConfig,
  matchParentSize,
  offset,
  padding,
  rotate,
  Shapes,
  weight,
  width as widthModifier,
  wrapContentHeight,
  wrapContentWidth,
  zIndex as zIndexModifier,
} from '@expo/ui/jetpack-compose/modifiers'
import {opacity, radii, resolvePaletteColor, resolveShadow, type Theme, zIndex} from '@hzblj/kara-theme'
import type {ColorValue} from 'react-native'
import type {AndroidSx, FrameAlignment, Sx} from './sx.types'
import {sxPadding} from './sx-padding'

/**
 * The `full` radius token maps to `Circle` — Compose's `CircleShape` is a 50% rounding, so on any
 * box it draws the same capsule the iOS resolver gets from SwiftUI's `Capsule`.
 */
const shapeOf = (sx: Sx) => {
  if (sx.borderRadius === 'full') {
    return Shapes.Circle
  }

  return sx.borderRadius ? Shapes.RoundedCorner(radii[sx.borderRadius]) : Shapes.Rectangle
}

/**
 * A stroke that traces the box's own shape. `border` takes no shape, so on a rounded box it would
 * draw a square — an inner shadow with no blur and the width as its spread is the same inset stroke
 * that `strokeBorder` paints on iOS, and it follows the corner radius.
 */
const outline = (color: ColorValue, width: number, shape: BuiltinShape): ModifierConfig =>
  innerShadow(shape, {color, radius: 0, spread: width})

/**
 * Compose has no single transform modifier, so `scale` goes through `graphicsLayer` while `rotate` and
 * `offset` keep their own — `rotate` is the readable one for the Z axis, and `offset` moves the box
 * before it is drawn rather than after, which is what the React Native and SwiftUI paths also do.
 */
const effectModifiers = (sx: Sx): ModifierConfig[] => {
  const modifiers: ModifierConfig[] = []

  if (sx.offsetX !== undefined || sx.offsetY !== undefined) {
    modifiers.push(offset(sx.offsetX ?? 0, sx.offsetY ?? 0))
  }

  if (sx.rotate !== undefined) {
    modifiers.push(rotate(sx.rotate))
  }

  if (sx.scale !== undefined) {
    const scale = typeof sx.scale === 'number' ? {x: sx.scale, y: sx.scale} : sx.scale
    modifiers.push(graphicsLayer({scaleX: scale.x ?? 1, scaleY: scale.y ?? 1}))
  }

  if (sx.blur !== undefined) {
    modifiers.push(blur(sx.blur))
  }

  if (sx.opacity) {
    modifiers.push(alpha(opacity[sx.opacity]))
  }

  if (sx.zIndex) {
    modifiers.push(zIndexModifier(zIndex[sx.zIndex]))
  }

  return modifiers
}

/**
 * `wrapContentWidth`/`Height` take an alignment, and `true` means "wrap, don't care where" — Compose's
 * own default. Passing the flag straight through as the alignment would not type-check.
 */
const wrapAlignment = <T extends string>(value: T | boolean | undefined): T | undefined =>
  typeof value === 'boolean' ? undefined : value

/** The `android` bucket: Compose-only modifiers, which the SwiftUI resolver has no counterpart for. */
const androidModifiers = (android: AndroidSx | undefined): ModifierConfig[] => {
  if (!android) {
    return []
  }

  const modifiers: ModifierConfig[] = []

  if (android.align) {
    modifiers.push(align(android.align))
  }

  if (android.fillMaxWidth !== undefined) {
    modifiers.push(fillMaxWidth(android.fillMaxWidth))
  }

  if (android.fillMaxHeight !== undefined) {
    modifiers.push(fillMaxHeight(android.fillMaxHeight))
  }

  if (android.weight !== undefined) {
    modifiers.push(weight(android.weight))
  }

  if (android.wrapContentWidth) {
    modifiers.push(wrapContentWidth(wrapAlignment(android.wrapContentWidth)))
  }

  if (android.wrapContentHeight) {
    modifiers.push(wrapContentHeight(wrapAlignment(android.wrapContentHeight)))
  }

  if (android.matchParentSize) {
    modifiers.push(matchParentSize())
  }

  if (android.imePadding) {
    modifiers.push(imePadding())
  }

  if (android.animateContentSize) {
    modifiers.push(animateContentSize())
  }

  if (android.modifiers) {
    modifiers.push(...android.modifiers)
  }

  return modifiers
}

export const sxToModifiers = (sx: Sx, theme: Theme, _alignment: FrameAlignment = 'topLeading'): ModifierConfig[] => {
  const modifiers: ModifierConfig[] = []
  const shape = shapeOf(sx)
  const shadow = sx.shadow ? resolveShadow(theme, sx.shadow) : undefined
  const geometry = shadow?.geometry
  const shadowColors = shadow?.colors

  if (sx.wide) {
    modifiers.push(fillMaxWidth())
  }

  if (sx.tall) {
    modifiers.push(fillMaxHeight())
  }

  if (sx.w !== undefined) {
    modifiers.push(widthModifier(sx.w))
  }

  if (sx.h !== undefined) {
    modifiers.push(heightModifier(sx.h))
  }

  if (sx.minW !== undefined || sx.minH !== undefined) {
    modifiers.push(defaultMinSize({minHeight: sx.minH, minWidth: sx.minW}))
  }

  if (geometry?.drop && shadowColors?.drop) {
    modifiers.push(
      dropShadow(shape, {
        color: resolvePaletteColor(theme, shadowColors.drop),
        offsetY: geometry.drop.y,
        radius: geometry.drop.radius,
      })
    )
  }

  // A draw modifier is only clipped by a `clip` earlier in the chain, so the clip has to come
  // between the drop shadow — which must paint outside the box — and everything drawn within it.
  if (sx.borderRadius) {
    modifiers.push(clip(shape))
  }

  if (sx.bg) {
    modifiers.push(background(theme.color(sx.bg)))
  }

  if (geometry?.inset && shadowColors?.inset) {
    modifiers.push(
      innerShadow(shape, {
        color: resolvePaletteColor(theme, shadowColors.inset),
        radius: geometry.inset.radius,
      })
    )
  }

  if (sx.borderWidth !== undefined && sx.borderColor) {
    modifiers.push(outline(theme.color(sx.borderColor), sx.borderWidth, shape))
  }

  if (geometry?.ring && shadowColors?.ring) {
    modifiers.push(outline(resolvePaletteColor(theme, shadowColors.ring), geometry.ring.width, shape))
  }

  const boxPadding = sxPadding(sx)

  if (boxPadding) {
    modifiers.push(
      padding(boxPadding.leading ?? 0, boxPadding.top ?? 0, boxPadding.trailing ?? 0, boxPadding.bottom ?? 0)
    )
  }

  modifiers.push(...effectModifiers(sx))
  modifiers.push(...androidModifiers(sx.android))

  return modifiers
}
