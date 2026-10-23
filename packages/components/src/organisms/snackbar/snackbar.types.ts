import type {SpaceSize} from '@hzblj/kara-theme'
import type {ComponentProps, ReactNode} from 'react'
import type Animated from 'react-native-reanimated'

type LayoutAnimation = ComponentProps<typeof Animated.View>['entering']

/** How it comes and goes. */
export type SnackbarAnimation = 'fade' | 'scale' | 'slide'

/** How long it stays: Material's short (4 s) and long (10 s), never, or a number of milliseconds. */
export type SnackbarDuration = 'indefinite' | 'long' | 'short' | number

/** The edge of its parent it sits on. */
export type SnackbarPosition = 'bottom' | 'top'

/**
 * A short message laid over an edge of its parent, with an optional action at its trailing end. The React Native tier,
 * drawn the same on both platforms (iOS has no snackbar of its own), so it needs no host. Material's options are all
 * here: a duration, a dismiss button, the action on a line of its own. It is announced to VoiceOver and TalkBack when
 * it appears.
 */
export type SnackbarProps = {
  /** The action button's text, at the trailing end. No button without it. */
  actionLabel?: string
  /** Puts the action under the message, at its trailing end: Material's layout for a long message or action. */
  actionOnNewLine?: boolean
  /**
   * How it comes and goes. `scale` is Material's own (a fade and a scale from 80 %), `slide` rises from its edge as it
   * fades in, `fade` only fades. `scale` on Android and `slide` on iOS by default. With motion reduced, it fades.
   */
  animation?: SnackbarAnimation
  /** A close button at the trailing end, Material's dismiss action; it calls `onDismiss`. */
  dismissible?: boolean
  /** How long it stays up before `onDismiss` is called. `indefinite` by default: it never hides itself. */
  duration?: SnackbarDuration
  /** A Reanimated entering animation of your own, e.g. `FadeInDown.springify()`. It wins over `animation`. */
  entering?: LayoutAnimation
  /** A Reanimated exiting animation of your own. It wins over `animation`. */
  exiting?: LayoutAnimation
  /** The message. */
  message: string
  /** Between the snackbar and its edge, a space token. `s24` by default; raise it above a tab bar. */
  offset?: SpaceSize
  /** The action was pressed. The snackbar stays up; turn `visible` off to hide it. */
  onAction?: () => void
  /** It asks to go: its `duration` ran out, or its dismiss button was pressed. Turn `visible` off to hide it. */
  onDismiss?: () => void
  /** The edge of its parent it sits on. `bottom` by default, Material's place for it. */
  position?: SnackbarPosition
  /** Shows the snackbar while true, animating it in and out. */
  visible: boolean
}

export type SnackbarComponent = (props: SnackbarProps) => ReactNode
