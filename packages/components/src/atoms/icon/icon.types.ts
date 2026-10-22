import type {ColorToken, SpaceSize} from '@hzblj/kara-theme'
import type {ReactNode} from 'react'

declare global {
  /**
   * The app's icon names, one key per SVG in its icon folder. Written by the config plugin
   * (`plugins: [['@hzblj/kara-ui', {icons: {source: './assets/icons'}}]]`) into `kara-icons.d.ts`, or by
   * `npx kara-icons`. Empty until then. Global, so the declaration reaches it without resolving any kara package.
   */
  interface KaraIcons {}
}

type DeclaredIconName = keyof KaraIcons & string

/**
 * One of the app's icons. Once the plugin has written `kara-icons.d.ts` only those names type-check — an icon removed
 * from the folder fails at every call site. Before that, any string, so a project can adopt icons gradually.
 */
export type IconName = [DeclaredIconName] extends [never] ? string : DeclaredIconName

/**
 * One of the app's icons, in a host — SwiftUI `Image` from the asset catalog on iOS, Material's `Icon` with the vector
 * drawable on Android. `RnIcon` draws the same asset outside one.
 */
export type IconProps = {
  /** What a screen reader says. Unset, the icon is decorative and hidden from it. */
  accessibilityLabel?: string
  /** The icon's tint. `content.primary` by default. */
  color?: ColorToken
  /** Which of the app's icons — a key of `KaraIcons`. */
  name: IconName
  /** Its width and height, a spacing token. `s24` by default. */
  size?: SpaceSize
  /** Test identifier, forwarded to the native view on iOS — Android ignores it. */
  testID?: string
}

export type IconComponent = (props: IconProps) => ReactNode
