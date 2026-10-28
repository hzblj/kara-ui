import type {ReactNode} from 'react'
import type {ColorValue, StyleProp, ViewStyle} from 'react-native'

export type BackdropBlurViewProps = {
  /** The blur's radius, in dp. Android 12+ only. */
  blurRadius?: number
  /** React Native views, drawn over the glass. */
  children?: ReactNode
  /** The shape's corner radius, in dp. It clips the backdrop and the children. */
  cornerRadius?: number
  /** A tint opaque enough for the content to read, drawn instead of `tint` below Android 12, where there is no blur. */
  fallbackTint?: ColorValue
  /** Over the blur; its alpha is how much of it covers the backdrop. */
  glassTint?: ColorValue
  hairlineColor?: ColorValue
  /** In dp. */
  hairlineWidth?: number
  /** How far the material has come in, 0 to 1: scales the blur, the saturation's lift and the tint's alpha. 1 by default. */
  intensity?: number
  /** Applied to the backdrop after the blur; 1 leaves it as it is, more lifts its colour the way iOS's materials do. */
  saturation?: number
  style?: StyleProp<ViewStyle>
  testID?: string
}
