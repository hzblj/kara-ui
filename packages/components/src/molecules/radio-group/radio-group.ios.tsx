import {HStack} from '../../atoms/h-stack'
import {Spacer} from '../../atoms/spacer'
import {Text} from '../../atoms/text'
import {VStack} from '../../atoms/v-stack'
import {Glyph} from '../../glyph'
import {useHostGuard} from '../../host-context'
import type {RadioGroupComponent, RadioGroupProps} from './radio-group.types'

export const RadioGroup: RadioGroupComponent = ({onValueChange, options, value}: RadioGroupProps) => {
  useHostGuard('RadioGroup')

  return (
    <VStack spacing="s4" wide>
      {options.map(option => (
        <HStack align="center" key={option.value} onPress={() => onValueChange?.(option.value)} py="s8" wide>
          <Text>{option.label}</Text>
          <Spacer />
          {option.value === value ? <Glyph color="content.accent" name="check" size="s20" /> : null}
        </HStack>
      ))}
    </VStack>
  )
}
