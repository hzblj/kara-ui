import type {ColorToken} from '@hzblj/kara-theme'
import type {ReactNode} from 'react'

/** A horizontal hairline — SwiftUI `Divider` / Compose `HorizontalDivider`. */
export type DividerProps = {
  /** The line's colour. `border.tertiary` by default. */
  color?: ColorToken
  /** Test identifier, forwarded to the native view on iOS — Android ignores it. */
  testID?: string
}

export type DividerComponent = (props: DividerProps) => ReactNode
