import {
  type AnimationSpec,
  align,
  alpha,
  animateContentSize,
  animated,
  type BuiltinShape,
  background,
  blur,
  clip,
  spring as composeSpring,
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
  tween,
  weight,
  width as widthModifier,
  wrapContentHeight,
  wrapContentWidth,
  zIndex as zIndexModifier,
} from '@expo/ui/jetpack-compose/modifiers'
import {
  duration as durations,
  type EasingName,
  opacity,
  radii,
  resolvePaletteColor,
  resolveShadow,
  springPhysics,
  type Theme,
  zIndex,
} from '@hzblj/kara-theme'
import type {ColorValue} from 'react-native'
import type {AnimatableKey, SxAnimateConfig} from './motion.types'
import {type NativeAnimate, nativeAnimate} from './native-animate'
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

/** Compose's own curves: the nearest to each token, since a `tween` here takes no bézier of its own. */
const TWEEN_EASING = {
  inOut: 'fastOutSlowIn',
  linear: 'linear',
  out: 'linearOutSlowIn',
  smoothOut: 'linearOutSlowIn',
} as const satisfies Record<EasingName, string>

/**
 * `animate` as a Compose animation spec. A spring token is `spring(dampingRatio, stiffness)`, the same physics as on
 * iOS; `smoothOut` is a no-bounce spring over its duration, as SwiftUI's `.smooth` is; the other curves are tweens.
 * A spring has no delay in Compose, so `delay` applies to the tweens only.
 */
const composeSpec = (config: SxAnimateConfig): AnimationSpec => {
  if (config.spring) {
    const {dampingRatio, stiffness} = springPhysics(config.spring)

    return composeSpring({dampingRatio, stiffness})
  }

  const milliseconds = durations[config.duration ?? 'fast']
  const easing = config.easing ?? 'smoothOut'

  if (easing === 'smoothOut') {
    const omega = (2 * Math.PI * 1000) / milliseconds

    return composeSpring({dampingRatio: 1, stiffness: omega * omega})
  }

  return tween({delayMillis: config.delay, durationMillis: milliseconds, easing: TWEEN_EASING[easing]})
}

const SIZE_KEYS = new Set<AnimatableKey>(['h', 'maxH', 'maxW', 'minH', 'minW', 'w'])

/** A covered value animates to where it is going; one `animate` does not cover is set as it is. */
const toward = (value: number, key: AnimatableKey, native: NativeAnimate, spec: AnimationSpec) =>
  native.keys.has(key) ? animated(value, spec) : value

/**
 * The transforms and the opacity of an animated box, in one `graphicsLayer` whose values Compose animates itself. It
 * stands in for `offset`, `rotate`, `alpha` and the scale layer of a box at rest, at the same place in the chain.
 */
const animatedEffectModifiers = (sx: Sx, native: NativeAnimate, spec: AnimationSpec): ModifierConfig[] => {
  const scale = typeof sx.scale === 'number' ? {x: sx.scale, y: sx.scale} : (sx.scale ?? {})
  const modifiers: ModifierConfig[] = [
    graphicsLayer({
      alpha: toward(sx.opacity ? opacity[sx.opacity] : 1, 'opacity', native, spec),
      rotationZ: toward(sx.rotate ?? 0, 'rotate', native, spec),
      scaleX: toward(scale.x ?? 1, 'scale', native, spec),
      scaleY: toward(scale.y ?? 1, 'scale', native, spec),
      translationX: toward(sx.offsetX ?? 0, 'offsetX', native, spec),
      translationY: toward(sx.offsetY ?? 0, 'offsetY', native, spec),
    }),
  ]

  if (sx.blur !== undefined) {
    modifiers.push(blur(sx.blur))
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

export const sxToModifiers = (
  sx: Sx,
  theme: Theme,
  _alignment: FrameAlignment = 'topLeading',
  reduced = false
): ModifierConfig[] => {
  const modifiers: ModifierConfig[] = []
  const shape = shapeOf(sx)
  const shadow = sx.shadow ? resolveShadow(theme, sx.shadow) : undefined
  const geometry = shadow?.geometry
  const shadowColors = shadow?.colors
  const native = nativeAnimate(sx, reduced)
  const spec = native ? composeSpec(native.config) : undefined

  // Before the size modifiers it animates: placed after them, it would only see the size they already settled on.
  if (native && spec && [...native.keys].some(key => SIZE_KEYS.has(key))) {
    const physics = spec.$type === 'spring' ? spec : {dampingRatio: 1, stiffness: undefined}
    modifiers.push(animateContentSize(physics.dampingRatio, physics.stiffness))
  }

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
    const animatesBg = native?.keys.has('bg') && spec
    modifiers.push(background(theme.color(sx.bg), animatesBg ? {animationSpec: spec} : undefined))
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

  modifiers.push(...(native && spec ? animatedEffectModifiers(sx, native, spec) : effectModifiers(sx)))
  modifiers.push(...androidModifiers(sx.android))

  return modifiers
}
