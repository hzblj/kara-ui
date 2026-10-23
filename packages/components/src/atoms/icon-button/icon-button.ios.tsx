import {Button} from '@expo/ui/swift-ui'
import {buttonStyle, contentShape, disabled as disabledModifier, shapes} from '@expo/ui/swift-ui/modifiers'
import {useMemo} from 'react'

import {useHostGuard} from '../../host-context'
import {Icon} from '../icon'
import {ZStack} from '../z-stack'
import type {IconButtonComponent, IconButtonProps} from './icon-button.types'

/** Apple's least tap target. Android's `IconButton` is Material's 48dp; this is the same idea in points. */
const TARGET = 44

/** The whole square takes the tap, not only the glyph's own pixels. */
const WHOLE_TARGET = {modifiers: [contentShape(shapes.circle())]}

export const IconButton: IconButtonComponent = ({disabled = false, name, onPress, testID}: IconButtonProps) => {
  useHostGuard('IconButton')

  const modifiers = useMemo(() => {
    const list = [buttonStyle('plain')]

    if (disabled) {
      list.push(disabledModifier(true))
    }

    return list
  }, [disabled])

  return (
    <Button modifiers={modifiers} onPress={onPress} testID={testID}>
      <ZStack h={TARGET} ios={WHOLE_TARGET} w={TARGET}>
        {/* SwiftUI dims a disabled button's label itself; a disabled colour on top of that dimmed it twice. */}
        <Icon color="content.primary" name={name} />
      </ZStack>
    </Button>
  )
}
