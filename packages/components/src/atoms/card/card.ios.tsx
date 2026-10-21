import {VStack} from '@expo/ui/swift-ui'
import {useSxModifiers} from '@hzblj/kara-sx'
import {useHostGuard} from '../../host-context'
import type {CardComponent, CardProps} from './card.types'

export const Card: CardComponent = ({children, testID, ...sx}: CardProps) => {
  useHostGuard('Card')
  const modifiers = useSxModifiers({bg: 'surface.primary', borderRadius: 'large', p: 's16', shadow: 'card', ...sx})

  return (
    <VStack alignment="leading" modifiers={modifiers} testID={testID}>
      {children}
    </VStack>
  )
}
