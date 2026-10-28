import {VStack} from '@expo/ui/swift-ui'
import {splitAccessibility, useAccessibilityModifiers, useSxModifiers} from '@hzblj/kara-sx'
import {useMemo} from 'react'
import {useHostGuard} from '../../hooks/host-context'
import type {CardComponent, CardProps} from './card.types'

export const Card: CardComponent = ({children, testID, ...props}: CardProps) => {
  useHostGuard('Card')
  const [accessibility, sx] = splitAccessibility(props)
  const sxModifiers = useSxModifiers({bg: 'surface.primary', borderRadius: 'large', p: 's16', shadow: 'card', ...sx})
  const accessibilityModifiers = useAccessibilityModifiers(accessibility)
  const modifiers = useMemo(() => [...sxModifiers, ...accessibilityModifiers], [accessibilityModifiers, sxModifiers])

  return (
    <VStack alignment="leading" modifiers={modifiers} testID={testID}>
      {children}
    </VStack>
  )
}
