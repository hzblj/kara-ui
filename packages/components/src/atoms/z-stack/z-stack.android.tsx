import {Box} from '@expo/ui/jetpack-compose'
import {useHostGuard} from '../../hooks/host-context'
import {useStackModifiers} from '../../hooks/use-stack-modifiers'
import type {ZStackAlign, ZStackComponent, ZStackProps} from './z-stack.types'

const ALIGNMENT = {
  bottom: 'bottomCenter',
  center: 'center',
  top: 'topCenter',
} as const satisfies Record<ZStackAlign, string>

export const ZStack: ZStackComponent = ({align = 'center', children, onPress, testID, ...sx}: ZStackProps) => {
  useHostGuard('ZStack')
  const modifiers = useStackModifiers(sx, onPress, testID)

  return (
    <Box contentAlignment={ALIGNMENT[align]} modifiers={modifiers}>
      {children}
    </Box>
  )
}
