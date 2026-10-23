import {springs} from '@hzblj/kara-theme'

import type {AnimatableKey, SxAnimate, SxAnimateConfig} from './motion.types'
import type {Sx} from './sx.types'
import {valueKey} from './value-key'

/** `animate` in full, whichever of its forms it came in. */
export const animateConfig = (animate: Exclude<SxAnimate, false>): SxAnimateConfig => {
  if (animate === true) {
    return {}
  }

  if (typeof animate === 'string') {
    return animate in springs
      ? {spring: animate as SxAnimateConfig['spring']}
      : {duration: animate as SxAnimateConfig['duration']}
  }

  return animate
}

/** What the compositor moves without a layout pass: the colours, the opacity and the transform. */
export const DEFAULT_ANIMATABLE_KEYS: readonly AnimatableKey[] = [
  'bg',
  'borderColor',
  'offsetX',
  'offsetY',
  'opacity',
  'rotate',
  'scale',
]

/** With motion reduced a change may still fade or tint: nothing it does moves, grows or turns. */
const STILL_KEYS = new Set<AnimatableKey>(['bg', 'blur', 'borderColor', 'opacity'])

/** The native resolvers' view of `animate`: its config, and the keys it covers once Reduce Motion has had its say. */
export type NativeAnimate = {
  config: SxAnimateConfig
  keys: ReadonlySet<AnimatableKey>
}

export const nativeAnimate = (sx: Sx, reduced: boolean): NativeAnimate | undefined => {
  if (sx.animate === undefined || sx.animate === false) {
    return undefined
  }

  const config = animateConfig(sx.animate)
  const keys = (config.keys ?? DEFAULT_ANIMATABLE_KEYS).filter(key => !reduced || STILL_KEYS.has(key))

  return {config, keys: new Set(keys)}
}

/**
 * The covered keys' values folded into one number, for SwiftUI's `.animation(_:value:)`: it animates a change only when
 * the value it watches changes too, so this changes exactly when one of the covered keys does. A 32-bit FNV-1a hash.
 */
export const animatedValue = (sx: Sx, keys: ReadonlySet<AnimatableKey>): number => {
  let hash = 0x811c9dc5

  for (const key of [...keys].sort()) {
    const text = `${key}:${valueKey((sx as Record<string, unknown>)[key])}|`

    for (let index = 0; index < text.length; index += 1) {
      hash ^= text.charCodeAt(index)
      hash = Math.imul(hash, 0x01000193)
    }
  }

  return hash >>> 0
}
