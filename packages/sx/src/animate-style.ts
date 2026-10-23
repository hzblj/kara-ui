import {duration as durations, type EasingName, easing, type Theme} from '@hzblj/kara-theme'
import type {ViewStyle} from 'react-native'
import {cubicBezier} from 'react-native-reanimated'

import type {AnimatableKey, SxAnimate, SxAnimateConfig} from './motion.types'
import {animateConfig, DEFAULT_ANIMATABLE_KEYS} from './native-animate'
import {springCurve} from './spring-curve'
import {staticColor} from './static-color'

/** The React Native style properties each `sx` key resolves into, which is what a CSS transition names. */
const STYLE_PROPERTIES = {
  bg: ['backgroundColor'],
  blur: ['filter'],
  borderColor: ['borderColor'],
  borderRadius: [
    'borderRadius',
    'borderBottomLeftRadius',
    'borderBottomRightRadius',
    'borderTopLeftRadius',
    'borderTopRightRadius',
  ],
  borderWidth: ['borderWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderRightWidth', 'borderTopWidth'],
  h: ['height'],
  maxH: ['maxHeight'],
  maxW: ['maxWidth'],
  minH: ['minHeight'],
  minW: ['minWidth'],
  offsetX: ['transform'],
  offsetY: ['transform'],
  opacity: ['opacity'],
  rotate: ['transform'],
  scale: ['transform'],
  w: ['width'],
} as const satisfies Record<AnimatableKey, readonly string[]>

/** With motion reduced a change may still fade or tint: nothing it does moves, grows or turns. */
const STILL = new Set(['backgroundColor', 'borderColor', 'filter', 'opacity'])

const COLOR_PROPERTIES = ['backgroundColor', 'borderColor'] as const

const timingFunctions = new Map<EasingName, ReturnType<typeof cubicBezier>>()

const timingFunction = (name: EasingName) => {
  let existing = timingFunctions.get(name)

  if (!existing) {
    const [x1, y1, x2, y2] = easing[name]
    existing = cubicBezier(x1, y1, x2, y2)
    timingFunctions.set(name, existing)
  }

  return existing
}

/** The transition half of the style: Reanimated's CSS transition properties, which a plain `ViewStyle` does not type. */
export type TransitionStyle = Record<string, unknown>

/** Bounded like the style cache: a delay is a free number, so a stagger of transitions could otherwise grow it. */
const MAX_TRANSITIONS = 256

const transitions = new Map<string, TransitionStyle>()

const transitionFor = (properties: readonly string[], config: SxAnimateConfig): TransitionStyle => {
  const size = config.duration ?? 'fast'
  const curve = config.easing ?? 'smoothOut'
  const delay = config.delay ?? 0
  const key = `${properties.join(',')}|${config.spring ?? `${size}|${curve}`}|${delay}`
  let existing = transitions.get(key)

  if (!existing) {
    if (transitions.size >= MAX_TRANSITIONS) {
      transitions.clear()
    }

    // A spring runs as the curve it draws, sampled into `linear()`, over the time it takes to rest.
    const sprung = config.spring ? springCurve(config.spring) : undefined

    existing = {
      transitionDelay: delay,
      transitionDuration: sprung ? sprung.duration : durations[size],
      transitionProperty: [...properties],
      transitionTimingFunction: sprung ? sprung.timingFunction : timingFunction(curve),
    }
    transitions.set(key, existing)
  }

  return existing
}

/** Per resolved style (each already belongs to one theme), the merged overlay for every transition asked of it. */
const overlays = new WeakMap<ViewStyle, Map<string, TransitionStyle>>()

/**
 * `animate` as the style overlay a Reanimated view needs: the transition, and, on iOS, the transitioned colours as
 * values it can interpolate. A system colour reaches the style as a `PlatformColor` handle, which Reanimated's
 * transitions cannot read and would throw on; the overlay puts the hex UIKit draws for this appearance in its place,
 * and leaves a colour that cannot be resolved out of the transition, so it changes at once instead.
 */
export const animateStyle = (
  animate: SxAnimate | undefined,
  style: ViewStyle,
  theme: Theme,
  reduced: boolean
): TransitionStyle | undefined => {
  if (animate === undefined || animate === false) {
    return undefined
  }

  const config = animateConfig(animate)
  const wanted = new Set<string>()

  for (const name of config.keys ?? DEFAULT_ANIMATABLE_KEYS) {
    for (const property of STYLE_PROPERTIES[name]) {
      if (!reduced || STILL.has(property)) {
        wanted.add(property)
      }
    }
  }

  const memoKey = `${[...wanted].join(',')}|${config.spring}|${config.duration}|${config.easing}|${config.delay}`
  let forStyle = overlays.get(style)
  const existing = forStyle?.get(memoKey)

  if (existing) {
    return existing
  }

  const colors: Record<string, number | string> = {}

  for (const property of COLOR_PROPERTIES) {
    const value = style[property]

    if (!wanted.has(property) || value === undefined || typeof value === 'string' || typeof value === 'number') {
      continue
    }

    const resolved = staticColor(value, theme.dark)

    if (resolved === undefined) {
      wanted.delete(property)
    } else {
      colors[property] = resolved
    }
  }

  const overlay = {...colors, ...transitionFor([...wanted].sort(), config)}

  if (!forStyle) {
    forStyle = new Map()
    overlays.set(style, forStyle)
  }

  forStyle.set(memoKey, overlay)

  return overlay
}
