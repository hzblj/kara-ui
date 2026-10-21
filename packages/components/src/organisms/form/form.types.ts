import type {ReactNode} from 'react'

/**
 * A settings form — SwiftUI `Form` with its grouped sections, Material cards on Android. On iOS it scrolls like a
 * `List`, so it needs a height from outside: a `Screen`, or an `Island` with `matchContents={false}` and a height. In
 * an island that sizes itself to its content it has no height and shows nothing.
 */
export type FormProps = {
  children: ReactNode
  testID?: string
}

export type FormSectionProps = {
  children: ReactNode
  footer?: string
  title?: string
}

export type FormComponent = ((props: FormProps) => ReactNode) & {
  Section: (props: FormSectionProps) => ReactNode
}
