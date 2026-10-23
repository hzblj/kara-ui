import type {BlurMaterial, BlurVibrancy} from '@hzblj/kara-native/swift-ui'
import type {ResponsiveViewSx} from '@hzblj/kara-sx'
import type {ReactNode} from 'react'

export type {BlurMaterial, BlurVibrancy} from '@hzblj/kara-native/swift-ui'

/**
 * One of the system's materials (what sheets, bars, menus and HUDs are made of) behind React Native content, in
 * SwiftUI's five thicknesses. iOS: UIKit's `system*Material` blur, with optional vibrancy for the content. Android:
 * what lies behind, blurred and saturated (Android 12+), under a Material tonal surface as thick as the material
 * (`surface` at `ultraThin` up to `surfaceContainerHighest` at `ultraThick`); below Android 12 the surface alone. The
 * React Native tier: it needs no host, so it suits a list cell. Shape it with `borderRadius`; it clips its children.
 */
export type BlurViewProps = ResponsiveViewSx & {
  /**
   * Pins the material to light or dark whatever the app's appearance (a dark HUD over a light screen). Unset, it
   * follows the app theme. Android draws the opposite appearance with Material's inverse surface.
   */
  appearance?: 'dark' | 'light'
  /** React Native content, over the material. */
  children?: ReactNode
  /** How much of what lies behind shows through, from `ultraThin` (most) to `ultraThick` (least). `regular` by default. */
  material?: BlurMaterial
  /** Test identifier, forwarded to the view. */
  testID?: string
  /**
   * iOS: draws the children vibrant at this level, the way iOS draws its own labels and fills on a material. Their
   * colour becomes the material's vibrant one and their alpha the mask. Android has no vibrancy: the children keep
   * their colours there.
   */
  vibrancy?: BlurVibrancy
}

export type BlurViewComponent = (props: BlurViewProps) => ReactNode
