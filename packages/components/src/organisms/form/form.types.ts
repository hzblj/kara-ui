import type {ReactNode} from 'react'

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
