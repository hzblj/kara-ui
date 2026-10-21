import {Box} from '@expo/ui/jetpack-compose'
import {clickable, testID as testIdModifier} from '@expo/ui/jetpack-compose/modifiers'
import {useSxModifiers} from '@hzblj/kara-sx'
import {useMemo} from 'react'
import {useHostGuard} from '../../host-context'
import type {ZStackAlign, ZStackComponent, ZStackProps} from './z-stack.types'

const ALIGNMENT = {
  bottom: 'bottomCenter',
  center: 'center',
  top: 'topCenter',
} as const satisfies Record<ZStackAlign, string>

export const ZStack: ZStackComponent = ({align = 'center', children, onPress, testID, ...sx}: ZStackProps) => {
  useHostGuard('ZStack')
  const sxModifiers = useSxModifiers(sx)
  const modifiers = useMemo(
    () => [...sxModifiers, ...(testID ? [testIdModifier(testID)] : []), ...(onPress ? [clickable(onPress)] : [])],
    [onPress, sxModifiers, testID]
  )

  return (
    <Box contentAlignment={ALIGNMENT[align]} modifiers={modifiers}>
      {children}
    </Box>
  )
}
