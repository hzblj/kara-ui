import {Text as ComposeText, RadioButton, Row} from '@expo/ui/jetpack-compose'
import {useAppTheme} from '@hzblj/kara-theme'
import {VStack} from '../../atoms/v-stack'
import {useHostGuard} from '../../host-context'
import type {RadioGroupComponent, RadioGroupProps} from './radio-group.types'

export const RadioGroup: RadioGroupComponent = ({onValueChange, options, value}: RadioGroupProps) => {
  useHostGuard('RadioGroup')

  const theme = useAppTheme()

  return (
    <VStack spacing="s4" wide>
      {options.map(option => (
        <Row key={option.value} verticalAlignment="center">
          <RadioButton onClick={() => onValueChange?.(option.value)} selected={option.value === value} />
          <ComposeText color={theme.colorString('content.primary')} style={theme.typography.body}>
            {option.label}
          </ComposeText>
        </Row>
      ))}
    </VStack>
  )
}
