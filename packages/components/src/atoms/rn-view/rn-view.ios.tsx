import {RNHostView} from '@expo/ui/swift-ui'

import type {RnViewComponent, RnViewProps} from './rn-view.types'

export const RnView: RnViewComponent = ({children, matchContents = true}: RnViewProps) => (
  <RNHostView matchContents={matchContents}>{children}</RNHostView>
)
