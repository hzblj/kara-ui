import {Text as ComposeText, RadioButton, Row} from '@expo/ui/jetpack-compose'
import {clickable, fillMaxWidth} from '@expo/ui/jetpack-compose/modifiers'
import {useAppTheme} from '@hzblj/kara-theme'
import {VStack} from '../../atoms/v-stack'
import {useHostGuard} from '../../host-context'
import type {RadioGroupComponent, RadioGroupProps} from './radio-group.types'

/**
 * Material's radio buttons, each in a full-width row that selects it as a whole. A disabled group keeps every
 * button's handler, so Material keeps the touch target an enabled one has; `enabled` is what stops the input.
 */
export const RadioGroup: RadioGroupComponent = ({
  disabled = false,
  onValueChange,
  options,
  testID,
  value,
}: RadioGroupProps) => {
  useHostGuard('RadioGroup')

  const theme = useAppTheme()

  return (
    <VStack spacing="s4" testID={testID} wide>
      {options.map(option => (
        <Row
          key={option.value}
          modifiers={disabled ? [fillMaxWidth()] : [fillMaxWidth(), clickable(() => onValueChange?.(option.value))]}
          verticalAlignment="center"
        >
          <RadioButton
            colors={{selectedColor: theme.color('fill.accent.primary')}}
            enabled={!disabled}
            onClick={() => onValueChange?.(option.value)}
            selected={option.value === value}
          />
          <ComposeText
            color={theme.colorString(disabled ? 'content.tertiary' : 'content.primary')}
            style={theme.typography.body}
          >
            {option.label}
          </ComposeText>
        </Row>
      ))}
    </VStack>
  )
}
