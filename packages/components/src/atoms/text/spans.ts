import type {ColorToken} from '@hzblj/kara-theme'
import {Children, isValidElement, type ReactNode} from 'react'

/** A run of the text: a string child, or a nested `Text` with a colour of its own. */
export type TextSpan = {color?: ColorToken; text: string}

/** The string and number children, joined: the text of a `Text` without spans, however JSX split it. */
export const textOf = (children: ReactNode): string =>
  Children.toArray(children)
    .map(child => (typeof child === 'string' || typeof child === 'number' ? String(child) : ''))
    .join('')

/**
 * The children as runs when any of them is a nested `Text` (`type`, the platform's own component), `null` when they
 * are only text. A span keeps its `color`; anything else it sets is the outer text's.
 */
export const spansOf = (children: ReactNode, type: unknown): TextSpan[] | null => {
  const items = Children.toArray(children)

  if (!items.some(child => isValidElement(child) && child.type === type)) {
    return null
  }

  return items.flatMap<TextSpan>(child => {
    if (typeof child === 'string' || typeof child === 'number') {
      return [{text: String(child)}]
    }
    if (isValidElement<{children?: ReactNode; color?: ColorToken}>(child) && child.type === type) {
      return [{color: child.props.color, text: textOf(child.props.children)}]
    }
    return []
  })
}

/** The colours and the text folded into one number, for SwiftUI's `.animation(_:value:)`. A 32-bit FNV-1a hash. */
export const spansKey = (color: ColorToken, spans: readonly TextSpan[] | null, text: string): number => {
  let hash = 0x811c9dc5
  const value = spans ? spans.map(span => `${span.color ?? ''}:${span.text}`).join('|') : text

  for (const character of `${color}|${value}`) {
    hash ^= character.charCodeAt(0)
    hash = Math.imul(hash, 0x01000193)
  }

  return hash >>> 0
}
