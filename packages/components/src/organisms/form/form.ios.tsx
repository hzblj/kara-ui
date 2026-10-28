import {Section, Form as SwiftUIForm} from '@expo/ui/swift-ui'
import {Text} from '../../atoms/text'
import {useHostGuard} from '../../hooks/host-context'
import type {FormComponent, FormProps, FormSectionProps} from './form.types'

const FormRoot = ({children, testID}: FormProps) => {
  useHostGuard('Form')

  return <SwiftUIForm testID={testID}>{children}</SwiftUIForm>
}

const FormSection = ({children, footer, title}: FormSectionProps) => (
  <Section footer={footer ? <Text variant="footnote">{footer}</Text> : undefined} title={title}>
    {children}
  </Section>
)

export const Form: FormComponent = Object.assign(FormRoot, {Section: FormSection})
