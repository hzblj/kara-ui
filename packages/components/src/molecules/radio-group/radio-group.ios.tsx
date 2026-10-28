import {Glyph} from '../../atoms/glyph'
import {HStack} from '../../atoms/h-stack'
import {Spacer} from '../../atoms/spacer'
import {Text} from '../../atoms/text'
import {VStack} from '../../atoms/v-stack'
import {useHostGuard} from '../../hooks/host-context'
import type {RadioGroupComponent, RadioGroupProps} from './radio-group.types'

export const RadioGroup: RadioGroupComponent = ({
  disabled = false,
  onValueChange,
  options,
  testID,
  value,
}: RadioGroupProps) => {
  useHostGuard('RadioGroup')

  return (
    <VStack spacing="s4" testID={testID} wide>
      {options.map(option => (
        <HStack
          align="center"
          key={option.value}
          onPress={disabled ? undefined : () => onValueChange?.(option.value)}
          py="s8"
          wide
        >
          <Text color={disabled ? 'content.tertiary' : 'content.primary'}>{option.label}</Text>
          <Spacer />
          {option.value === value ? (
            <Glyph color={disabled ? 'content.tertiary' : 'content.accent'} name="check" size="s20" />
          ) : null}
        </HStack>
      ))}
    </VStack>
  )
}
