import {Host} from '@expo/ui/jetpack-compose'
import {useSx} from '@hzblj/kara-sx'
import {useAppTheme} from '@hzblj/kara-theme'

import {HostBoundary} from '../../host-context'
import type {IslandComponent, IslandProps} from './island.types'

const MATCH_HEIGHT_ONLY = {horizontal: false, vertical: true}

const MATCH_NEITHER = {horizontal: false, vertical: false}

export const Island: IslandComponent = ({
  children,
  matchContents = true,
  style,
  testID: _testID,
  ...sx
}: IslandProps) => {
  const theme = useAppTheme()
  const resolved = useSx(sx)

  return (
    <Host
      colorScheme={theme.dark ? 'dark' : 'light'}
      matchContents={matchContents ? MATCH_HEIGHT_ONLY : MATCH_NEITHER}
      seedColor={theme.materialSeed}
      style={style ? [resolved, style] : resolved}
    >
      <HostBoundary>{children}</HostBoundary>
    </Host>
  )
}
