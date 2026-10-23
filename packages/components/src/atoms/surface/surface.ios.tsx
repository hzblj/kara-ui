import {GlassEffectContainer, VStack} from '@expo/ui/swift-ui'
import {splitAccessibility, useAccessibilityModifiers, useSxModifiers} from '@hzblj/kara-sx'
import {useMemo} from 'react'
import {useHostGuard} from '../../host-context'
import type {SurfaceComponent, SurfaceProps} from './surface.types'

export const Surface: SurfaceComponent = ({children, glass = false, testID, ...props}: SurfaceProps) => {
  useHostGuard('Surface')
  const [accessibility, sx] = splitAccessibility(props)

  // `surface.primary` unless told otherwise, as Material's `Surface` is on Android — without it a plain one drew nothing.
  const sxModifiers = useSxModifiers({bg: 'surface.primary', borderRadius: 'large', p: 's16', ...sx})
  const accessibilityModifiers = useAccessibilityModifiers(accessibility)
  const modifiers = useMemo(() => [...sxModifiers, ...accessibilityModifiers], [accessibilityModifiers, sxModifiers])
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
