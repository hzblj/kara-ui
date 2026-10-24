import type {ColorToken} from '@hzblj/kara-theme'
import type {ReactNode} from 'react'

export type ActivityIndicatorSize = 'large' | 'small'

/**
 * That something is loading, for as long as it takes: UIKit's spinner on iOS, Material 3's expressive
 * `LoadingIndicator` on Android, its shapes morphing as it turns. A React Native view on iOS and a host of its own on
 * Android, so it renders anywhere; inside a `Screen` or `Island` it joins that host, beside other native views. For how
 * far along something is, use `Progress`.
 */
export type ActivityIndicatorProps = {
  /** What is loading, for VoiceOver and TalkBack: "Loading photos". Unset, the platform's own word ("In progress"). */
  accessibilityLabel?: string
  /** Its colour. `fill.accent.primary` by default. */
  color?: ColorToken
  /** `small` sits in a row or a button, `large` holds a screen that is loading. `small` by default. */
  size?: ActivityIndicatorSize
  /** Test identifier, forwarded to the view. */
  testID?: string
}

export type ActivityIndicatorComponent = (props: ActivityIndicatorProps) => ReactNode
