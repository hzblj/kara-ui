import type {AccessibilityProps} from '@hzblj/kara-sx'
import type {SpaceSize} from '@hzblj/kara-theme'
import type {ReactNode} from 'react'
import type {IconName} from '../../atoms/icon'

/**
 * A label on the leading edge and its value on the trailing edge: the settings/detail row.
 * Pass `children` instead of `value` when the trailing side is a control rather than text. With a `value`, screen
 * readers read the row as one element ("Version, 2.4"); with a control, the control stays its own.
 */
export type LabeledContentProps = AccessibilityProps & {
  /** The trailing side when it is a control, in place of `value`. */
  children?: ReactNode
  /** One of the app's icons, before the label, in the secondary colour. */
  icon?: IconName
  /** The leading text. */
  label: string
  /** Makes the row pressable and adds a chevron on the trailing edge. */
  onPress?: () => void
  /** Horizontal padding inside the row, and inside its press area too, so Android's ripple reaches the card's edges. */
  px?: SpaceSize
  /** Test identifier, forwarded to the native view. */
  testID?: string
  /** The trailing text, in the secondary colour. Ignored when `children` is given. */
  value?: string
}

export type LabeledContentComponent = (props: LabeledContentProps) => ReactNode
