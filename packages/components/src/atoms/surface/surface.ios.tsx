import {GlassEffectContainer, VStack} from '@expo/ui/swift-ui'
import {useSxModifiers} from '@hzblj/kara-sx'
import {useHostGuard} from '../../host-context'
import type {SurfaceComponent, SurfaceProps} from './surface.types'

export const Surface: SurfaceComponent = ({children, glass = false, testID, ...sx}: SurfaceProps) => {
  useHostGuard('Surface')

  const modifiers = useSxModifiers({borderRadius: 'large', p: 's16', ...sx})
  const content = (
    <VStack alignment="leading" modifiers={modifiers} testID={testID}>
      {children}
    </VStack>
  )

  if (!glass) {
    return content
  }

  return <GlassEffectContainer>{content}</GlassEffectContainer>
}
