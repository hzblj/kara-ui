import {Card} from '../../atoms/card'
import {Text} from '../../atoms/text'
import {VStack} from '../../atoms/v-stack'
import {useHostGuard} from '../../host-context'
import type {FormComponent, FormProps, FormSectionProps} from './form.types'

const FormRoot = ({children, testID}: FormProps) => {
  useHostGuard('Form')

  return (
    <VStack spacing="s16" testID={testID} wide>
      {children}
    </VStack>
  )
}

const FormSection = ({children, footer, title}: FormSectionProps) => (
  <VStack spacing="s4" wide>
    {title ? (
      <Text color="content.secondary" transform="uppercase" variant="labelMedium">
        {title}
      </Text>
    ) : null}
    <Card wide>{children}</Card>
    {footer ? (
      <Text color="content.tertiary" variant="footnote">
        {footer}
      </Text>
    ) : null}
  </VStack>
)

export const Form: FormComponent = Object.assign(FormRoot, {Section: FormSection})
