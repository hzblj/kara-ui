import {Column} from '@expo/ui/jetpack-compose'
import {testID as testIdModifier} from '@expo/ui/jetpack-compose/modifiers'
import {splitAccessibility, useAccessibilityModifiers, useSxModifiers} from '@hzblj/kara-sx'
import {useMemo} from 'react'
import {useHostGuard} from '../../hooks/host-context'
import type {CardComponent, CardProps} from './card.types'

export const Card: CardComponent = ({children, testID, ...props}: CardProps) => {
  useHostGuard('Card')
  const [accessibility, sx] = splitAccessibility(props)
  const sxModifiers = useSxModifiers({bg: 'surface.primary', borderRadius: 'large', p: 's16', shadow: 'card', ...sx})
  const accessibilityModifiers = useAccessibilityModifiers(accessibility)
  const modifiers = useMemo(
    () => [...sxModifiers, ...(testID ? [testIdModifier(testID)] : []), ...accessibilityModifiers],
    [accessibilityModifiers, sxModifiers, testID]
  )

  return <Column modifiers={modifiers}>{children}</Column>
}
