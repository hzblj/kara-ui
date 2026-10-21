import {Row} from '@expo/ui/jetpack-compose'
import {clickable, testID as testIdModifier} from '@expo/ui/jetpack-compose/modifiers'
import {useSxModifiers} from '@hzblj/kara-sx'
import {spacing} from '@hzblj/kara-theme'
import {useMemo} from 'react'
import {useHostGuard} from '../../host-context'
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
  const sxModifiers = useSxModifiers(sx)
  const modifiers = useMemo(
    () => [...sxModifiers, ...(testID ? [testIdModifier(testID)] : []), ...(onPress ? [clickable(onPress)] : [])],
    [onPress, sxModifiers, testID]
  )

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
