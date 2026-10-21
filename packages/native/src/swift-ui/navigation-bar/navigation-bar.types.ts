import type {ColorValue, StyleProp, ViewStyle} from 'react-native'

export type NavigationBarProps = {
  /** Accessibility label of the back item. */
  backLabel?: string
  /** Becomes the back item's `accessibilityIdentifier`. */
  backTestID?: string
  /** Accessibility label of the close item. */
  closeLabel?: string
  /** Becomes the close item's `accessibilityIdentifier`. */
  closeTestID?: string
  fontFamily?: string
  fontSize?: number
  itemColor: ColorValue
  /** Shows the back chevron when set. */
  onBack?: () => void
  /** Shows the system close item when set. */
  onClose?: () => void
  style?: StyleProp<ViewStyle>
  testID?: string
  title?: string
  titleColor: ColorValue
}
