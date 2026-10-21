import {Spacer as ComposeSpacer} from '@expo/ui/jetpack-compose'
import {defaultMinSize, weight} from '@expo/ui/jetpack-compose/modifiers'
import {spacing} from '@hzblj/kara-theme'
import {useMemo} from 'react'

import {useHostGuard} from '../../host-context'
import type {SpacerComponent, SpacerProps} from './spacer.types'

export const Spacer: SpacerComponent = ({min}: SpacerProps) => {
  useHostGuard('Spacer')

  const modifiers = useMemo(
    () => (min === undefined ? [weight(1)] : [weight(1), defaultMinSize({minHeight: spacing[min]})]),
    [min]
  )

  return <ComposeSpacer modifiers={modifiers} />
}
