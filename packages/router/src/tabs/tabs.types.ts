import type {IconName} from '@hzblj/kara-components'
import type {ReactNode} from 'react'

/** One tab of `Tabs`: the route it opens, its icon and its title. It renders nothing; `Tabs` reads its props. */
export type TabsScreenProps = {
  /**
   * Drops the tab from the bar *and* makes the route unreachable by navigation. Prefer this over
   * conditionally rendering the screen: every child route needs a declared tab, and toggling this
   * at runtime remounts the navigator, so pass a build constant.
   */
  hidden?: boolean
  /** One of the app's icons: the asset-catalog image on iOS, the vector drawable on Android. */
  icon: IconName
  /** The child route the tab opens, by its Expo Router name. */
  name: string
  /** Swapped in while the tab is active: the filled counterpart of `icon`, say. */
  selectedIcon?: IconName
  /** Test identifier of the tab's bar item: its accessibility identifier on iOS, its view tag on Android. */
  testID?: string
  /** The tab's label in the bar. */
  title: string
}

/** Maps to `UITabBarController.minimizeBehavior`. iOS 26+; ignored everywhere else. */
export type TabsMinimizeBehavior = 'automatic' | 'never' | 'onScrollDown' | 'onScrollUp'

/**
 * Native bottom tabs for an Expo Router layout, on Expo Router's native tabs: the system tab bar on iOS, Material's
 * navigation bar on Android, both in the theme's colours.
 */
export type TabsProps = {
  /** One `Tabs.Screen` per child route; any other child goes to the navigator as it is. */
  children: ReactNode
  /**
   * Whether the iOS 26 tab bar shrinks to a pill while scrolling.
   *
   * Off by default, unlike the system, which minimizes on scroll. Minimizing changes the tab bar's
   * height mid-gesture, and a native tabs screen re-insets the first scroll view inside it to match,
   * so the content shifts under the finger every time the scroll direction changes, and every list in
   * the app inherits that. Opt in per screen once the content is built to absorb it.
   */
  minimizeBehavior?: TabsMinimizeBehavior
}

export type TabsComponent = ((props: TabsProps) => ReactNode) & {
  Screen: (props: TabsScreenProps) => ReactNode
}
