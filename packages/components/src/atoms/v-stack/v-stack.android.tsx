import {Column} from '@expo/ui/jetpack-compose'
import {spacing} from '@hzblj/kara-theme'
import {useHostGuard} from '../../hooks/host-context'
import {useStackModifiers} from '../../hooks/use-stack-modifiers'
import type {VStackAlign, VStackComponent, VStackProps} from './v-stack.types'

const ALIGNMENT = {
  center: 'center',
  end: 'end',
  start: 'start',
} as const satisfies Record<VStackAlign, string>

export const VStack: VStackComponent = ({
  align = 'start',
  children,
  onPress,
  spacing: gap,
  testID,
  ...sx
}: VStackProps) => {
  useHostGuard('VStack')
  const modifiers = useStackModifiers(sx, onPress, testID)

  return (
    <Column
      horizontalAlignment={ALIGNMENT[align]}
      verticalArrangement={gap === undefined ? undefined : {spacedBy: spacing[gap]}}
      modifiers={modifiers}
    >
      {children}
    </Column>
  )
}
