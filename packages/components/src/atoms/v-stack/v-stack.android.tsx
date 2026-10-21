import {Column} from '@expo/ui/jetpack-compose'
import {clickable, testID as testIdModifier} from '@expo/ui/jetpack-compose/modifiers'
import {useSxModifiers} from '@hzblj/kara-sx'
import {spacing} from '@hzblj/kara-theme'
import {useMemo} from 'react'
import {useHostGuard} from '../../host-context'
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
  const sxModifiers = useSxModifiers(sx)
  const modifiers = useMemo(
    () => [...sxModifiers, ...(testID ? [testIdModifier(testID)] : []), ...(onPress ? [clickable(onPress)] : [])],
    [onPress, sxModifiers, testID]
  )

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
