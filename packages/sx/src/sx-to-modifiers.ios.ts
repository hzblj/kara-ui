import {
  Animation,
  animation,
  aspectRatio,
  background,
  blur,
  brightness,
  clipped,
  clipShape,
  colorInvert,
  containerRelativeFrame,
  contentTransition,
  contrast,
  controlSize,
  fixedSize,
  frame,
  glassEffect,
  grayscale,
  hidden,
  hueRotation,
  ignoreSafeArea,
  layoutPriority,
  luminanceToAlpha,
  type ModifierConfig,
  monospacedDigit,
  offset,
  opacity as opacityModifier,
  padding,
  privacySensitive,
  redacted,
  rotationEffect,
  saturation,
  scaleEffect,
  shadow,
  strokeBorder,
  tint,
  unredacted,
  zIndex as zIndexModifier,
} from '@expo/ui/swift-ui/modifiers'
import {
  duration as durations,
  opacity,
  radii,
  resolvePaletteColor,
  resolveShadow,
  springPhysics,
  type Theme,
  zIndex,
} from '@hzblj/kara-theme'
import type {ColorValue} from 'react-native'
import type {SxAnimate, SxAnimateConfig} from './motion.types'
import {animateConfig, animatedValue, nativeAnimate} from './native-animate'
import type {FrameAlignment, IosSx, Sx} from './sx.types'
import {sxPadding} from './sx-padding'

/**
 * The one shape every decoration traces — clip, strokes, drop shadow and glass all take it, so the
 * box reads as a single surface. The `full` radius token maps to a real capsule: SwiftUI's
 * `RoundedRectangle` degenerates when the radius outgrows the box, where `Capsule` stays clean.
 */
type BoxShape = {
  cornerRadius?: number
  shape: 'capsule' | 'rectangle' | 'roundedRectangle'
}

const boxShape = (sx: Sx): BoxShape => {
  if (sx.borderRadius === 'full') {
    return {shape: 'capsule'}
  }

  return sx.borderRadius ? {cornerRadius: radii[sx.borderRadius], shape: 'roundedRectangle'} : {shape: 'rectangle'}
}

/**
 * A stroke that traces the box's own shape. `.border` always draws a square, so on a rounded box the
 * following `.clipShape` cuts its corners off — `strokeBorder` follows the shape and stays inside.
 */
const outline = (color: ColorValue, width: number, box: BoxShape): ModifierConfig =>
  strokeBorder({
    color,
    cornerRadius: box.cornerRadius,
    shape: box.shape,
    style: {lineWidth: width},
  })

/**
 * `inset` is Android-only: SwiftUI has no inner-shadow modifier, and standing in with `.glassEffect`
 * paints a whole Liquid Glass material over the box — a washed-out plate, not a shadow.
 */
const shadowModifiers = (sx: Sx, theme: Theme, box: BoxShape): ModifierConfig[] => {
  if (!sx.shadow) {
    return []
  }

  const {colors, geometry} = resolveShadow(theme, sx.shadow)
  const modifiers: ModifierConfig[] = []

  if (geometry.ring && colors.ring) {
    modifiers.push(outline(resolvePaletteColor(theme, colors.ring), geometry.ring.width, box))
  }

  if (geometry.drop && colors.drop) {
    modifiers.push(
      shadow({
        color: resolvePaletteColor(theme, colors.drop),
        radius: geometry.drop.radius,
        y: geometry.drop.y,
      })
    )
  }

  return modifiers
}

/**
 * The native `FrameModifier` applies either the exact `width`/`height` pair or the min/max set —
 * never both, so one call mixing them would silently drop its min/max half. Each set therefore gets
 * its own `frame`: the exact one first, then the flexible one for the axes left free.
 */
const frameModifiers = (sx: Sx, alignment: FrameAlignment): ModifierConfig[] => {
  const modifiers: ModifierConfig[] = []

  if (sx.w !== undefined || sx.h !== undefined) {
    modifiers.push(frame({alignment, height: sx.h, width: sx.w}))
  }

  if (sx.wide || sx.tall || sx.minW !== undefined || sx.minH !== undefined) {
    modifiers.push(
      frame({
        alignment,
        maxHeight: sx.tall ? Infinity : undefined,
        maxWidth: sx.wide ? Infinity : undefined,
        minHeight: sx.minH,
        minWidth: sx.minW,
      })
    )
  }

  return modifiers
}

/** Transforms and filters, which SwiftUI applies to the box after it has been laid out and painted. */
const effectModifiers = (sx: Sx): ModifierConfig[] => {
  const modifiers: ModifierConfig[] = []

  if (sx.offsetX !== undefined || sx.offsetY !== undefined) {
    modifiers.push(offset({x: sx.offsetX, y: sx.offsetY}))
  }

  if (sx.rotate !== undefined) {
    modifiers.push(rotationEffect(sx.rotate))
  }

  if (sx.scale !== undefined) {
    modifiers.push(scaleEffect(typeof sx.scale === 'number' ? sx.scale : {x: sx.scale.x ?? 1, y: sx.scale.y ?? 1}))
  }

  if (sx.blur !== undefined) {
    modifiers.push(blur(sx.blur))
  }

  if (sx.opacity) {
    modifiers.push(opacityModifier(opacity[sx.opacity]))
  }

  if (sx.zIndex) {
    modifiers.push(zIndexModifier(zIndex[sx.zIndex]))
  }

  return modifiers
}

const FIXED_SIZE_AXES = {
  both: {horizontal: true, vertical: true},
  horizontal: {horizontal: true},
  vertical: {vertical: true},
} as const

/**
 * Liquid Glass from either form of the `glass` key. With no shape of its own, the glass follows the
 * box's `borderRadius` — a plate that ignored the box's corners would read as a different surface.
 */
const glassModifier = (glass: NonNullable<IosSx['glass']>, theme: Theme, box: BoxShape) => {
  const config = typeof glass === 'string' ? {variant: glass} : glass
  const followsBox = config.shape === undefined && box.shape !== 'rectangle'

  return glassEffect({
    cornerRadius: config.cornerRadius ?? (followsBox ? box.cornerRadius : undefined),
    glass: {
      interactive: config.interactive,
      tint: config.tint === undefined ? undefined : theme.color(config.tint),
      variant: config.variant,
    },
    shape: followsBox ? box.shape : config.shape,
  })
}

/** The `ios` bucket: SwiftUI-only modifiers, which the Compose resolver has no counterpart for. */
const iosModifiers = (ios: IosSx | undefined, theme: Theme, box: BoxShape): ModifierConfig[] => {
  if (!ios) {
    return []
  }

  const modifiers: ModifierConfig[] = []

  if (ios.aspectRatio !== undefined) {
    modifiers.push(aspectRatio({contentMode: 'fit', ratio: ios.aspectRatio}))
  }

  // The ideal sizes live in the native frame modifier's min/max branch, so they need their own
  // `frame` call — one with an exact width or height would never reach them.
  if (ios.idealW !== undefined || ios.idealH !== undefined) {
    modifiers.push(frame({idealHeight: ios.idealH, idealWidth: ios.idealW}))
  }

  if (ios.containerRelativeFrame) {
    modifiers.push(containerRelativeFrame(ios.containerRelativeFrame))
  }

  if (ios.ignoreSafeArea) {
    modifiers.push(ignoreSafeArea(ios.ignoreSafeArea === true ? undefined : ios.ignoreSafeArea))
  }

  if (ios.glass) {
    modifiers.push(glassModifier(ios.glass, theme, box))
  }

  if (ios.tint) {
    modifiers.push(tint(theme.color(ios.tint)))
  }

  if (ios.controlSize) {
    modifiers.push(controlSize(ios.controlSize))
  }

  if (ios.layoutPriority !== undefined) {
    modifiers.push(layoutPriority(ios.layoutPriority))
  }

  if (ios.fixedSize) {
    modifiers.push(fixedSize(FIXED_SIZE_AXES[ios.fixedSize]))
  }

  if (ios.clipped) {
    modifiers.push(clipped(true))
  }

  if (ios.hidden) {
    modifiers.push(hidden(true))
  }

  if (ios.redacted) {
    modifiers.push(redacted(ios.redacted))
  }

  if (ios.unredacted) {
    modifiers.push(unredacted())
  }

  if (ios.privacySensitive) {
    modifiers.push(privacySensitive(true))
  }

  if (ios.saturation !== undefined) {
    modifiers.push(saturation(ios.saturation))
  }

  if (ios.brightness !== undefined) {
    modifiers.push(brightness(ios.brightness))
  }

  if (ios.contrast !== undefined) {
    modifiers.push(contrast(ios.contrast))
  }

  if (ios.grayscale !== undefined) {
    modifiers.push(grayscale(ios.grayscale))
  }

  if (ios.hueRotation !== undefined) {
    modifiers.push(hueRotation(ios.hueRotation))
  }

  if (ios.colorInvert) {
    modifiers.push(colorInvert(true))
  }

  if (ios.luminanceToAlpha) {
    modifiers.push(luminanceToAlpha())
  }

  if (ios.monospacedDigit) {
    modifiers.push(monospacedDigit())
  }

  if (ios.contentTransition) {
    modifiers.push(
      contentTransition(ios.contentTransition.type, {
        countsDown: ios.contentTransition.countsDown,
      })
    )
  }

  // After the transition it plays: the animation is what makes the content change animate at all.
  if (ios.animation) {
    const {curve = 'default', duration, value} = ios.animation
    modifiers.push(animation(curve === 'default' ? Animation.default : Animation[curve]({duration}), value))
  }

  if (ios.modifiers) {
    modifiers.push(...ios.modifiers)
  }

  return modifiers
}

/**
 * `animate` as a SwiftUI animation. A spring token is `.spring(response:dampingFraction:)`, the same physics as
 * Reanimated's; `smoothOut` is `.smooth(duration:)`, the no-bounce spring SwiftUI reaches for, which starts as fast and
 * settles as long; the other curves are SwiftUI's own timings, since `@expo/ui` takes no bézier.
 */
const swiftAnimation = (config: SxAnimateConfig) => {
  const seconds = durations[config.duration ?? 'fast'] / 1000
  let curve: ReturnType<typeof Animation.smooth>

  if (config.spring) {
    const {dampingRatio, response} = springPhysics(config.spring)
    curve = Animation.spring({dampingFraction: dampingRatio, response})
  } else if (config.easing === 'inOut') {
    curve = Animation.easeInOut({duration: seconds})
  } else if (config.easing === 'out') {
    curve = Animation.easeOut({duration: seconds})
  } else if (config.easing === 'linear') {
    curve = Animation.linear({duration: seconds})
  } else {
    curve = Animation.smooth({duration: seconds})
  }

  return config.delay ? curve.delay(config.delay / 1000) : curve
}

/**
 * `.animation(_:value:)` animates every change in the view whenever `value` changes, so the value is the covered keys
 * folded into a number: a change of one of them animates, a change of anything else alone does not.
 */
const animateModifier = (sx: Sx, reduced: boolean): ModifierConfig | undefined => {
  const native = nativeAnimate(sx, reduced)

  if (!native || native.keys.size === 0) {
    return undefined
  }

  return animation(swiftAnimation(native.config), animatedValue(sx, native.keys))
}

/**
 * `animate` on a text's colours: SwiftUI interpolates the text (`.contentTransition(.interpolate)`) whenever `key`
 * changes, on the same timing `animate` gives the rest. `key` folds the colours and the text into a number.
 */
export const textColorTransition = (animate: SxAnimate | undefined, key: number): ModifierConfig[] =>
  animate === undefined || animate === false
    ? []
    : [contentTransition('interpolate'), animation(swiftAnimation(animateConfig(animate)), key)]

export const sxToModifiers = (
  sx: Sx,
  theme: Theme,
  alignment: FrameAlignment = 'topLeading',
  reduced = false
): ModifierConfig[] => {
  const modifiers: ModifierConfig[] = []
  const boxPadding = sxPadding(sx)
  const box = boxShape(sx)

  if (boxPadding) {
    modifiers.push(padding(boxPadding))
  }

  modifiers.push(...frameModifiers(sx, alignment))

  if (sx.bg) {
    modifiers.push(background(theme.color(sx.bg)))
  }

  // Clip before the strokes and the drop shadow, so all three trace the rounded box, not its bounds.
  if (box.shape !== 'rectangle') {
    modifiers.push(clipShape(box.shape, box.cornerRadius))
  }

  if (sx.borderWidth !== undefined && sx.borderColor) {
    modifiers.push(outline(theme.color(sx.borderColor), sx.borderWidth, box))
  }

  modifiers.push(...shadowModifiers(sx, theme, box))
  modifiers.push(...effectModifiers(sx))
  modifiers.push(...iosModifiers(sx.ios, theme, box))

  // Last, so it covers everything before it: the frame, the background, the strokes and the effects.
  const animated = animateModifier(sx, reduced)

  if (animated) {
    modifiers.push(animated)
  }

  return modifiers
}
