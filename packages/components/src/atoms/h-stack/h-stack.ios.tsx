import {HStack as SwiftUIHStack} from '@expo/ui/swift-ui'
import {type FrameAlignment, splitAccessibility, useAccessibilityModifiers, useSxModifiers} from '@hzblj/kara-sx'
import {spacing} from '@hzblj/kara-theme'
import {useMemo} from 'react'
import {useHostGuard} from '../../hooks/host-context'
import {tapModifiers} from '../../utils/tap-modifiers'
import type {HStackAlign, HStackComponent, HStackProps} from './h-stack.types'

const ALIGNMENT = {
  center: 'center',
  end: 'bottom',
  start: 'top',
} as const satisfies Record<HStackAlign, string>

const FRAME_ALIGNMENT = {
  center: 'leading',
  end: 'bottomLeading',
  start: 'topLeading',
} as const satisfies Record<HStackAlign, FrameAlignment>

export const HStack: HStackComponent = ({
  align = 'start',
  children,
  onPress,
  spacing: gap,
  testID,
  ...props
}: HStackProps) => {
  useHostGuard('HStack')
  const [accessibility, sx] = splitAccessibility(props)
  const sxModifiers = useSxModifiers(sx, FRAME_ALIGNMENT[align])
  const accessibilityModifiers = useAccessibilityModifiers(accessibility, onPress !== undefined)
  const modifiers = useMemo(
    () => [...sxModifiers, ...tapModifiers(onPress), ...accessibilityModifiers],
    [accessibilityModifiers, onPress, sxModifiers]
  )

  return (
    <SwiftUIHStack
      alignment={ALIGNMENT[align]}
      modifiers={modifiers}
      spacing={gap === undefined ? undefined : spacing[gap]}
      testID={testID}
    >
      {children}
    </SwiftUIHStack>
  )
}
