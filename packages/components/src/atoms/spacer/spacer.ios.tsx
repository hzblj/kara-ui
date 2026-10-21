import {Spacer as SwiftUISpacer} from '@expo/ui/swift-ui'
import {spacing} from '@hzblj/kara-theme'

import {useHostGuard} from '../../host-context'
import type {SpacerComponent, SpacerProps} from './spacer.types'

export const Spacer: SpacerComponent = ({min, testID}: SpacerProps) => {
  useHostGuard('Spacer')

  return <SwiftUISpacer minLength={min === undefined ? undefined : spacing[min]} testID={testID} />
}
