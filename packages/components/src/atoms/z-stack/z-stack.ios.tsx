import {ZStack as SwiftUIZStack} from '@expo/ui/swift-ui'
import {onTapGesture} from '@expo/ui/swift-ui/modifiers'
import {type FrameAlignment, useSxModifiers} from '@hzblj/kara-sx'
import {useMemo} from 'react'
import {useHostGuard} from '../../host-context'
import type {ZStackAlign, ZStackComponent, ZStackProps} from './z-stack.types'

const ALIGNMENT = {
  bottom: 'bottom',
  center: 'center',
  top: 'top',
} as const satisfies Record<ZStackAlign, FrameAlignment>

export const ZStack: ZStackComponent = ({align = 'center', children, onPress, testID, ...sx}: ZStackProps) => {
  useHostGuard('ZStack')
  const sxModifiers = useSxModifiers(sx, ALIGNMENT[align])
  const modifiers = useMemo(
    () => (onPress ? [...sxModifiers, onTapGesture(onPress)] : sxModifiers),
    [onPress, sxModifiers]
  )

  return (
    <SwiftUIZStack alignment={ALIGNMENT[align]} modifiers={modifiers} testID={testID}>
      {children}
    </SwiftUIZStack>
  )
}
