import {Pressable} from '../pressable'
import {RnText} from '../rn-text'
import type {ChipComponent, ChipProps} from './chip.types'

export const Chip: ChipComponent = ({label, onPress, selected = false, testID}: ChipProps) => (
  <Pressable
    align="center"
    bg={selected ? 'fill.accent.base' : 'fill.tertiary'}
    borderColor={selected ? 'border.accent' : 'border.tertiary'}
    borderRadius="full"
    borderWidth={1}
    haptic
    justify="center"
    onPress={onPress}
    px="s12"
    py="s6"
    testID={testID}
  >
    <RnText color={selected ? 'content.accent' : 'content.secondary'} variant="labelMedium">
      {label}
    </RnText>
  </Pressable>
)
