import type {ReactNode} from 'react'
import type {IconName} from '../../atoms/icon'

/**
 * The "nothing here" placeholder for an empty list, a failed search or a cleared inbox.
 * `action` takes a `Button` so the state can offer a way out.
 */
export type EmptyStateProps = {
  action?: ReactNode
  description?: string
  icon?: IconName
  testID?: string
  title: string
}

export type EmptyStateComponent = (props: EmptyStateProps) => ReactNode
