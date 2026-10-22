import type {ReactNode} from 'react'

/**
 * A short message laid over the bottom of its parent, with an optional action. The React Native tier, drawn the same on
 * both platforms: it needs no host, and it never hides itself.
 */
export type SnackbarProps = {
  /** The action button's text, on the trailing side. No button without it. */
  actionLabel?: string
  /** The message. */
  message: string
  /** The action was pressed. The snackbar stays up — turn `visible` off to hide it. */
  onAction?: () => void
  /** Shows the snackbar while true, fading it in and out. It sets no timer of its own. */
  visible: boolean
}

export type SnackbarComponent = (props: SnackbarProps) => ReactNode
