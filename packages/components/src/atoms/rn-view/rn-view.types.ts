import type {ReactElement, ReactNode} from 'react'

/** Carries a React Native view into a SwiftUI or Compose tree: `@expo/ui`'s `RNHostView` on both platforms. */
export type RnViewProps = {
  /**
   * A single React Native *view*. It may not contain React Native text: a bare string becomes a
   * `RawText` node, which has no component view, so mounting it across the SwiftUI host boundary
   * fails the `RCTComponentViewFactory` assertion and takes the whole app down. `@expo/ui` states
   * the rule itself in `ListItem.ios.tsx` ("SwiftUI hosts can't render bare strings") and wraps
   * every raw string in a SwiftUI `Text` before it reaches a host. Do the same: use the `Text` atom
   * inside the host, and keep `RnText` outside it.
   */
  children: ReactElement
  /**
   * Sizes the host to the child's measured layout. On by default because a raw RN view has no
   * intrinsic size and would otherwise stretch to fill the SwiftUI parent.
   */
  matchContents?: boolean
  /** Not forwarded on either platform: give the child its own `testID`. */
  testID?: string
}

export type RnViewComponent = (props: RnViewProps) => ReactNode
