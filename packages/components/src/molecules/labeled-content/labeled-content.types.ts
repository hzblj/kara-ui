import type {SpaceSize} from '@hzblj/kara-theme'
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
  /** Horizontal padding inside the row — inside its press area too, so Android's ripple reaches the card's edges. */
  px?: SpaceSize
  testID?: string
  value?: string
}

export type LabeledContentComponent = (props: LabeledContentProps) => ReactNode
