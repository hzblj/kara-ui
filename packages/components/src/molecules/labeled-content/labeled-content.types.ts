import type {ReactNode} from 'react'
import type {IconName} from '../../atoms/icon'

/**
 * A label on the leading edge and its value on the trailing edge — the settings/detail row.
 * Pass `children` instead of `value` when the trailing side is a control rather than text.
 */
export type LabeledContentProps = {
  children?: ReactNode
  icon?: IconName
  label: string
  onPress?: () => void
  testID?: string
  value?: string
}

export type LabeledContentComponent = (props: LabeledContentProps) => ReactNode
