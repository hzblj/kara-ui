import {Card} from '../../atoms/card'
import {Text} from '../../atoms/text'
import {VStack} from '../../atoms/v-stack'
import {useHostGuard} from '../../host-context'
import type {FormComponent, FormProps, FormSectionProps} from './form.types'

/**
 * Inset from its container on every side, as SwiftUI's grouped form is — in a `Screen` the cards would otherwise run
 * into the screen's edges — and the section titles and footers indented to the cards' content.
 */
const FormRoot = ({children, testID}: FormProps) => {
  useHostGuard('Form')

  return (
    <VStack p="s16" spacing="s16" testID={testID} wide>
      {children}
    </VStack>
  )
}

const FormSection = ({children, footer, title}: FormSectionProps) => (
  <VStack spacing="s4" wide>
    {title ? (
      <VStack px="s16" wide>
        <Text color="content.secondary" transform="uppercase" variant="labelMedium">
          {title}
        </Text>
      </VStack>
    ) : null}
    <Card wide>{children}</Card>
    {footer ? (
      <VStack px="s16" wide>
        <Text color="content.tertiary" variant="footnote">
          {footer}
        </Text>
      </VStack>
    ) : null}
  </VStack>
)

export const Form: FormComponent = Object.assign(FormRoot, {Section: FormSection})
