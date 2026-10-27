import type {ColorToken} from '@hzblj/kara-theme'
import type {ReactNode} from 'react'

/** Which way the line runs. */
export type DividerAxis = 'horizontal' | 'vertical'

/**
 * A hairline between views: SwiftUI `Divider` / Compose `HorizontalDivider`, or `VerticalDivider` with
 * `axis="vertical"`.
 */
export type DividerProps = {
  /**
   * Which way the line runs. `horizontal` by default: across a `VStack`. `vertical` stands it up between the children
   * of an `HStack`, as tall as the stack, so give the stack a height (`h`). iOS ignores it: SwiftUI's divider turns by
   * itself, vertical in an `HStack` and horizontal anywhere else. Set it anyway, so Android draws the same.
   */
  axis?: DividerAxis
  /** The line's colour. `border.tertiary` by default. */
  color?: ColorToken
  /** Test identifier, forwarded to the native view. */
  testID?: string
}

export type DividerComponent = (props: DividerProps) => ReactNode
