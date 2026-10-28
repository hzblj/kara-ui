import type {ReactNode} from 'react'

export type NativeSubtitleProps = {
  subtitle: string
  subtitleHidden: boolean
}

export type NativeSubtitleComponent = (props: NativeSubtitleProps) => ReactNode
