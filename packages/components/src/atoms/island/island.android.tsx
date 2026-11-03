import {useSx} from '@hzblj/kara-sx'

import {ComposeHost} from '../../hooks/compose-host'
import {HostBoundary} from '../../hooks/host-context'
import type {IslandComponent, IslandProps} from './island.types'

const MATCH_HEIGHT_ONLY = {horizontal: false, vertical: true}

const MATCH_NEITHER = {horizontal: false, vertical: false}

export const Island: IslandComponent = ({
  children,
  ignoreSafeArea = 'keyboard',
  matchContents = true,
  style,
  testID: _testID,
  ...sx
}: IslandProps) => {
  const resolved = useSx(sx)

  return (
    <ComposeHost
      ignoreSafeAreaKeyboardInsets={ignoreSafeArea === 'all' || ignoreSafeArea === 'keyboard'}
      matchContents={matchContents ? MATCH_HEIGHT_ONLY : MATCH_NEITHER}
      style={style ? [resolved, style] : resolved}
    >
      <HostBoundary>{children}</HostBoundary>
    </ComposeHost>
  )
}
