import type {Sx} from '@hzblj/kara-sx'
import type {ReactNode} from 'react'

/**
 * The full-bleed native host a screen starts with: a SwiftUI or Compose `Host` filling its parent, so native atoms
 * render anywhere inside it. The background runs to the edges; the content keeps clear of the status bar where the
 * screen covers it (no navigation bar above), on Android as SwiftUI's safe area does on iOS.
 */
export type ScreenProps = {
  /** The screen's colour. `surface.base` by default. */
  bg?: Sx['bg']
  /** Laid out in a column that fills the screen. */
  children?: ReactNode
  /** Keeps the content where it is when the keyboard opens, instead of avoiding it. Android reads it once, on mount. */
  ignoreKeyboardInset?: boolean
  /** Test identifier, on the host view on iOS and on the view around it on Android. */
  testID?: string
}

export type ScreenComponent = (props: ScreenProps) => ReactNode
