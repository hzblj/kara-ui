import {Column} from '@expo/ui/jetpack-compose'
import {testID as testIdModifier} from '@expo/ui/jetpack-compose/modifiers'
import {useSxModifiers} from '@hzblj/kara-sx'
import {useMemo} from 'react'
import {useHostGuard} from '../../host-context'
import type {CardComponent, CardProps} from './card.types'

export const Card: CardComponent = ({children, testID, ...sx}: CardProps) => {
  useHostGuard('Card')
  const sxModifiers = useSxModifiers({bg: 'surface.primary', borderRadius: 'large', p: 's16', shadow: 'card', ...sx})
  const modifiers = useMemo(
    () => (testID ? [...sxModifiers, testIdModifier(testID)] : sxModifiers),
    [sxModifiers, testID]
  )

  return <Column modifiers={modifiers}>{children}</Column>
}
