import {Row} from '@expo/ui/jetpack-compose'
import {spacing} from '@hzblj/kara-theme'
import {useHostGuard} from '../../host-context'
import {useStackModifiers} from '../../use-stack-modifiers'
import type {HStackAlign, HStackComponent, HStackProps} from './h-stack.types'

const ALIGNMENT = {
  center: 'center',
  end: 'bottom',
  start: 'top',
} as const satisfies Record<HStackAlign, string>

export const HStack: HStackComponent = ({
  align = 'start',
  children,
  onPress,
  spacing: gap,
  testID,
  ...sx
}: HStackProps) => {
  useHostGuard('HStack')
  const modifiers = useStackModifiers(sx, onPress, testID)

  return (
    <Row
      verticalAlignment={ALIGNMENT[align]}
      horizontalArrangement={gap === undefined ? undefined : {spacedBy: spacing[gap]}}
      modifiers={modifiers}
    >
      {children}
    </Row>
  )
}
