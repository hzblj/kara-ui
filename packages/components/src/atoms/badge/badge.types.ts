import type {ReactNode} from 'react'

export type BadgeTone = 'accent' | 'destructive' | 'neutral' | 'success'

export type BadgeProps = {
  label: string
  tone?: BadgeTone
}

export type BadgeComponent = (props: BadgeProps) => ReactNode
