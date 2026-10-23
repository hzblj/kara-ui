import type {NativeIconName} from '@hzblj/expo-native-icons'
import type {ColorToken, SpaceSize} from '@hzblj/kara-theme'
import type {ReactNode} from 'react'

/**
 * One of the app's icons: a key of the global `NativeIcons`, which the config plugin writes into `native-icons.d.ts`
 * (`plugins: [['@hzblj/kara-ui', {icons: {source: './assets/icons'}}]]`) or `npx kara-icons` does. Once it exists only
 * those names type-check, so an icon removed from the folder fails at every call site; before that, any string.
 */
export type IconName = NativeIconName

/**
 * One of the app's icons, in a host: SwiftUI `Image` from the asset catalog on iOS, Material's `Icon` with the vector
 * drawable on Android. `RnIcon` draws the same asset outside one.
 */
export type IconProps = {
  /** What a screen reader says. Unset, the icon is decorative and hidden from it. */
  accessibilityLabel?: string
  /** The icon's tint. `content.primary` by default. */
  color?: ColorToken
  /** Which of the app's icons: a key of `NativeIcons`, one per SVG in the icon folder. */
  name: IconName
  /** Its width and height, a spacing token. `s24` by default. */
  size?: SpaceSize
  /** Test identifier, forwarded to the native view on iOS. Android ignores it. */
  testID?: string
}

export type IconComponent = (props: IconProps) => ReactNode
