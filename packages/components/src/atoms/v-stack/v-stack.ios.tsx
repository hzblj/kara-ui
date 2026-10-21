import {VStack as SwiftUIVStack} from '@expo/ui/swift-ui'
import {onTapGesture} from '@expo/ui/swift-ui/modifiers'
import {type FrameAlignment, useSxModifiers} from '@hzblj/kara-sx'
import {spacing} from '@hzblj/kara-theme'
import {useMemo} from 'react'
import {useHostGuard} from '../../host-context'
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
  ...sx
}: VStackProps) => {
  useHostGuard('VStack')
  const sxModifiers = useSxModifiers(sx, ALIGNMENT[align])
  const modifiers = useMemo(
    () => (onPress ? [...sxModifiers, onTapGesture(onPress)] : sxModifiers),
    [onPress, sxModifiers]
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
