import type {ReactNode} from 'react'
import type {IconName} from '../../atoms/icon'

/**
 * The "nothing here" placeholder for an empty list, a failed search or a cleared inbox.
 * `action` takes a `Button` so the state can offer a way out.
 */
export type EmptyStateProps = {
  /** Under the text: a `Button`, say. */
  action?: ReactNode
  /** A second line under the title, in the secondary colour. */
  description?: string
  /** One of the app's icons, large and muted above the title. */
  icon?: IconName
  /** Test identifier, forwarded to the native view. */
  testID?: string
  /** The headline. */
  title: string
}

export type EmptyStateComponent = (props: EmptyStateProps) => ReactNode
