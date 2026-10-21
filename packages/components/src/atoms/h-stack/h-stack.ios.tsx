import {HStack as SwiftUIHStack} from '@expo/ui/swift-ui'
import {onTapGesture} from '@expo/ui/swift-ui/modifiers'
import {type FrameAlignment, useSxModifiers} from '@hzblj/kara-sx'
import {spacing} from '@hzblj/kara-theme'
import {useMemo} from 'react'
import {useHostGuard} from '../../host-context'
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
  ...sx
}: HStackProps) => {
  useHostGuard('HStack')
  const sxModifiers = useSxModifiers(sx, FRAME_ALIGNMENT[align])
  const modifiers = useMemo(
    () => (onPress ? [...sxModifiers, onTapGesture(onPress)] : sxModifiers),
    [onPress, sxModifiers]
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
