import type {ReactNode} from 'react'

/** A filter pill on a `Pressable`, not a native control — the React Native tier, so it needs no host. */
export type ChipProps = {
  /** The text in the pill. */
  label: string
  /** Called when the chip is pressed, with the `selection` haptic. */
  onPress?: () => void
  /** Draws the chip in the accent colours. Off by default. */
  selected?: boolean
  /** Test identifier, forwarded to the view. */
  testID?: string
}

export type ChipComponent = (props: ChipProps) => ReactNode
