import type {ResponsiveViewSx} from '@hzblj/kara-sx'
import type {ReactNode} from 'react'
import type {StyleProp, ViewStyle} from 'react-native'

/**
 * A host for native atoms in a React Native layout: the SwiftUI / Compose `Host` an `@expo/ui` tree mounts into. It
 * sits in that layout like a `Box`, and takes `Box`'s `sx` props for it: `h`, `flex`, margins.
 */
export type IslandProps = ResponsiveViewSx & {
  /** The native views it hosts. */
  children?: ReactNode
  /**
   * Sizes the island's height to its native content while the width still comes from the parent, which
   * is what a full-width card wants. On by default. Only the height is ever measured: auto-sizing the
   * width maps to `fixedSize(horizontal: true)`, so the native side ignores the proposed width and
   * resolves a `wide` stack's ideal width as unbounded.
   *
   * Turn it off (and give the island an explicit height, `h`) when the subtree contains an
   * `RnView`: that host drives its SwiftUI frame from the child's Yoga-laid-out bounds while this one
   * writes its measured size back into the Yoga style, and the two together spin a layout loop that
   * hangs the main thread as soon as the views lay out on screen.
   */
  matchContents?: boolean
  /** A React Native style for the host view, merged over the `sx` props, for what they cannot say. */
  style?: StyleProp<ViewStyle>
  /** Test identifier, forwarded to the host view on iOS. Android ignores it. */
  testID?: string
}

export type IslandComponent = (props: IslandProps) => ReactNode
