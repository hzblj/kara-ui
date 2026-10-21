import type {Decorator} from '@storybook/react-native'

import {Island} from './atoms/island'

/**
 * The host a story renders its subject in. Native atoms only appear inside `<Screen>` or `<Island>`, and
 * Storybook mounts a story on its own — so this is the story-side stand-in for the screen a real call site
 * would already be inside. `Screen` is the wrong one here: it is full-bleed and would swallow the frame.
 *
 * The React Native tier — `Box`, the `Rn*` atoms, `Chip`, `Avatar`, `Skeleton`, `Snackbar` and the lists —
 * must *not* take it. Those views host nothing, and an island around them buys a native boundary for
 * nothing.
 */
export const insideIsland: Decorator = Story => (
  <Island>
    <Story />
  </Island>
)

/**
 * The same host with its auto-sizing turned off and an explicit height.
 *
 * Two kinds of story need it. One is a subtree containing `RnView`, where an auto-sizing island and the
 * view's own Yoga-driven frame chase each other until the main thread hangs — see `IslandProps`. The other
 * is a native view with no intrinsic height of its own, like `ScrollView` or `Pager`, which an island
 * measuring its contents would collapse to nothing.
 */
export const insideIslandOfHeight = (height: number): Decorator => {
  const style = {height}

  return Story => (
    <Island matchContents={false} style={style}>
      <Story />
    </Island>
  )
}
