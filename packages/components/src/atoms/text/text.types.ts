import type {AccessibilityProps, ResponsiveSx} from '@hzblj/kara-sx'
import type {ColorToken, TextVariant} from '@hzblj/kara-theme'
import type {ReactNode} from 'react'

export type TextAlign = 'center' | 'left' | 'right'

export type TextDecoration = 'none' | 'strikethrough' | 'underline'

export type TextTransform = 'lowercase' | 'uppercase'

/** Where the ellipsis goes in a text cut short: its start, its middle or its end. */
export type TextTruncation = 'head' | 'middle' | 'tail'

/**
 * SwiftUI `Text` / Compose `Text` in a theme typography variant. A native atom: outside a host, use `RnText`. It takes
 * the native `sx` surface too: padding, a frame (`wide` lines it up by `align`), a background, and the `ios` bucket's
 * `contentTransition` and `animation` for a number that changes in place (with `monospacedDigit`, so it does not move
 * what follows it).
 *
 * Nested `Text` children are spans: runs of the same text in a colour of their own, one paragraph that wraps as one.
 * With `animate`, a colour that changes (the text's or a span's) eases to its new value instead of switching: a word lit
 * as it is said, a phrase brought forward. SwiftUI interpolates the text, Compose animates each span's colour.
 */
export type TextProps = ResponsiveSx &
  AccessibilityProps & {
    /**
     * How its lines align. iOS reads `left` and `right` as leading and trailing, so they flip in a right-to-left
     * layout; Android keeps them as they are.
     */
    align?: TextAlign
    /**
     * The text: a string, or strings and nested `Text` spans, each in a `color` of its own. A span takes only its
     * colour; the variant, alignment and everything else are the outer text's.
     */
    children?: ReactNode
    /** The text's colour. `content.primary` by default. */
    color?: ColorToken
    /** An underline or a strikethrough. */
    decoration?: TextDecoration
    /** The most lines it wraps to. A text cut short ends with an ellipsis, where `truncation` puts it. */
    numberOfLines?: number
    /**
     * Sets it in the theme's fixed-width face, at the variant's size and weight: the app's `fonts.mono`, else Menlo on
     * iOS and `monospace` on Android. For code, an order number, anything read character by character.
     */
    monospaced?: boolean
    /**
     * Digits of one width, in whatever face the text is set in, so a number that changes does not shift what follows
     * it and figures line up in a column. Asks the face for its tabular figures (`tnum`); a face without them keeps
     * its own.
     */
    monospacedDigit?: boolean
    /** Test identifier, forwarded to the native view. */
    testID?: string
    /** Upper- or lower-cases the text. Android applies it only when `children` is a plain string. */
    transform?: TextTransform
    /**
     * Where the ellipsis goes in a text cut short. `tail` by default: the end of the last line. `head` keeps the end of
     * the text and `middle` both of its ends, for a file name, a path or an address. Android puts it at the head or in
     * the middle of a single line only (`numberOfLines={1}`), as Compose does; a longer text there ends at the tail.
     */
    truncation?: TextTruncation
    /** The typography variant. `body` by default. */
    variant?: TextVariant
  }

export type TextComponent = (props: TextProps) => ReactNode
