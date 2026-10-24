import type {MotionProps, ResponsiveViewSx} from '@hzblj/kara-sx'
import type {ColorToken, TextVariant} from '@hzblj/kara-theme'
import type {ReactNode} from 'react'
import type {TextProps as RNTextProps, StyleProp, TextStyle} from 'react-native'
import type {AnimatedStyle} from 'react-native-reanimated'

/**
 * React Native's `Text` in a theme typography variant: the React Native tier, for text outside a native host. It takes
 * `Box`'s `sx` surface for its own box (margins, flex, padding, a background), all but `align`, which here aligns the
 * lines, and the motion props a `Box` takes: `entering="fadeUp"` makes it an `Animated.Text` by itself.
 */
export type RnTextProps = Omit<RNTextProps, 'style'> &
  MotionProps &
  Omit<ResponsiveViewSx, 'align'> & {
    /** Horizontal alignment, as React Native's `textAlign`. */
    align?: 'center' | 'left' | 'right'
    /** The text's colour. `content.primary` by default. */
    color?: ColorToken
    /**
     * Sets it in the theme's fixed-width face, at the variant's size and weight: the app's `fonts.mono`, else Menlo on
     * iOS and `monospace` on Android, the same face `Text` sets. For code, an order number, anything read character by
     * character.
     */
    monospaced?: boolean
    /**
     * Digits of one width, in whatever face the text is set in, so a number that changes does not shift what follows
     * it and figures line up in a column. React Native's `fontVariant: ['tabular-nums']`; a face without tabular
     * figures keeps its own.
     */
    monospacedDigit?: boolean
    /** Goes last, over the variant and the `sx`: an animated style from `useAnimatedStyle`, which it renders through Reanimated for. */
    style?: StyleProp<AnimatedStyle<TextStyle>>
    /** The typography variant. `body` by default. */
    variant?: TextVariant
  }

export type RnTextComponent = (props: RnTextProps) => ReactNode
