import type {ReactNode} from 'react'

export type BadgeTone = 'accent' | 'destructive' | 'neutral' | 'success'

/** A small status label in a capsule: a SwiftUI `HStack` in the tone's fill on iOS, Material's `Badge` on Android. */
export type BadgeProps = {
  /** The text inside. */
  label: string
  /** Test identifier, forwarded to the native view. */
  testID?: string
  /** The fill and text colours. `neutral` by default. */
  tone?: BadgeTone
}

export type BadgeComponent = (props: BadgeProps) => ReactNode
