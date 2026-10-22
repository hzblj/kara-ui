import type {ReactNode} from 'react'
import type {StyleProp, ViewStyle} from 'react-native'

/** SwiftUI's `Material` thicknesses — UIKit's `systemUltraThinMaterial` to `systemChromeMaterial`. */
export type BlurMaterial = 'regular' | 'thick' | 'thin' | 'ultraThick' | 'ultraThin'

/** The label levels, a fill and the separator — the vibrancy iOS draws its own content on materials with. */
export type BlurVibrancy = 'fill' | 'primary' | 'quaternary' | 'secondary' | 'separator' | 'tertiary'

export type BlurViewProps = {
  children?: ReactNode
  /** Pins the material to an appearance rather than the trait it inherits. */
  colorScheme?: 'dark' | 'light'
  /** In points, continuous. It clips the children too. */
  cornerRadius?: number
  material?: BlurMaterial
  style?: StyleProp<ViewStyle>
  testID?: string
  /** Draws the children vibrant, at this level; unset, they keep their own colours. */
  vibrancy?: BlurVibrancy
}
