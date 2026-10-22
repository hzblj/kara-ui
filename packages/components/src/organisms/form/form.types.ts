import type {ReactNode} from 'react'

/**
 * A settings form — SwiftUI `Form` with its grouped sections, Material cards on Android. On iOS it scrolls like a
 * `List`, so it needs a height from outside: a `Screen`, or an `Island` with `matchContents={false}` and a height. In
 * an island that sizes itself to its content it has no height and shows nothing.
 */
export type FormProps = {
  /** The form's `Form.Section`s. */
  children: ReactNode
  /** Test identifier, forwarded to the native view. */
  testID?: string
}

/** A group of rows in a `Form`: a SwiftUI `Section` on iOS, a `Card` under a heading on Android. */
export type FormSectionProps = {
  /** The section's rows. */
  children: ReactNode
  /** Small print under the section. */
  footer?: string
  /** The section's heading. */
  title?: string
}

export type FormComponent = ((props: FormProps) => ReactNode) & {
  Section: (props: FormSectionProps) => ReactNode
}
