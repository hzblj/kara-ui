import {ZStack as SwiftUIZStack} from '@expo/ui/swift-ui'
import {type FrameAlignment, splitAccessibility, useAccessibilityModifiers, useSxModifiers} from '@hzblj/kara-sx'
import {useMemo} from 'react'
import {useHostGuard} from '../../hooks/host-context'
import {tapModifiers} from '../../utils/tap-modifiers'
import type {ZStackAlign, ZStackComponent, ZStackProps} from './z-stack.types'

const ALIGNMENT = {
  bottom: 'bottom',
  center: 'center',
  top: 'top',
} as const satisfies Record<ZStackAlign, FrameAlignment>

export const ZStack: ZStackComponent = ({align = 'center', children, onPress, testID, ...props}: ZStackProps) => {
  useHostGuard('ZStack')
  const [accessibility, sx] = splitAccessibility(props)
  const sxModifiers = useSxModifiers(sx, ALIGNMENT[align])
  const accessibilityModifiers = useAccessibilityModifiers(accessibility, onPress !== undefined)
  const modifiers = useMemo(
    () => [...sxModifiers, ...tapModifiers(onPress), ...accessibilityModifiers],
    [accessibilityModifiers, onPress, sxModifiers]
  )

  return (
    <SwiftUIZStack alignment={ALIGNMENT[align]} modifiers={modifiers} testID={testID}>
      {children}
    </SwiftUIZStack>
  )
}
