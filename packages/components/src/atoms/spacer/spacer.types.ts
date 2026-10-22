import type {SpaceSize} from '@hzblj/kara-theme'
import type {ReactNode} from 'react'

/** Takes up the free space in a stack — SwiftUI `Spacer` / Compose `Spacer` with `weight(1)`. */
export type SpacerProps = {
  /** The least room it takes. iOS holds it along the stack's axis; Android as a minimum height only. */
  min?: SpaceSize
  /** iOS: forwarded to the native view. Android ignores it. */
  testID?: string
}

export type SpacerComponent = (props: SpacerProps) => ReactNode
