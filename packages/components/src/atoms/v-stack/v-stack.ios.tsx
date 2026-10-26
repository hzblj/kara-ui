import {VStack as SwiftUIVStack} from '@expo/ui/swift-ui'
import {type FrameAlignment, splitAccessibility, useAccessibilityModifiers, useSxModifiers} from '@hzblj/kara-sx'
import {spacing} from '@hzblj/kara-theme'
import {useMemo} from 'react'
import {useHostGuard} from '../../host-context'
import {tapModifiers} from '../../tap-modifiers'
import type {VStackAlign, VStackComponent, VStackProps} from './v-stack.types'

const ALIGNMENT = {
  center: 'center',
  end: 'trailing',
  start: 'leading',
} as const satisfies Record<VStackAlign, FrameAlignment>

export const VStack: VStackComponent = ({
  align = 'start',
  children,
  onPress,
  spacing: gap,
  testID,
  ...props
}: VStackProps) => {
  useHostGuard('VStack')
  const [accessibility, sx] = splitAccessibility(props)
  const sxModifiers = useSxModifiers(sx, ALIGNMENT[align])
  const accessibilityModifiers = useAccessibilityModifiers(accessibility, onPress !== undefined)
  const modifiers = useMemo(
    () => [...sxModifiers, ...tapModifiers(onPress), ...accessibilityModifiers],
    [accessibilityModifiers, onPress, sxModifiers]
  )

  return (
    <SwiftUIVStack
      alignment={ALIGNMENT[align]}
      modifiers={modifiers}
      spacing={gap === undefined ? undefined : spacing[gap]}
      testID={testID}
    >
      {children}
    </SwiftUIVStack>
  )
}
