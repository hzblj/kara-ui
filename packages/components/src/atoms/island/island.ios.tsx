import {Host} from '@expo/ui/swift-ui'
import {dynamicTypeSize} from '@expo/ui/swift-ui/modifiers'
import {useSx} from '@hzblj/kara-sx'
import {MAX_DYNAMIC_TYPE_SIZE, useAppTheme} from '@hzblj/kara-theme'

import {HostBoundary} from '../../host-context'
import type {IslandComponent, IslandProps} from './island.types'

const DYNAMIC_TYPE_CAP = [dynamicTypeSize({max: MAX_DYNAMIC_TYPE_SIZE})]

const MATCH_HEIGHT_ONLY = {horizontal: false, vertical: true}

const MATCH_NEITHER = {horizontal: false, vertical: false}

export const Island: IslandComponent = ({
  children,
  ignoreSafeArea = 'keyboard',
  matchContents = true,
  style,
  testID,
  ...sx
}: IslandProps) => {
  const theme = useAppTheme()
  const resolved = useSx(sx)

  return (
    <Host
      colorScheme={theme.dark ? 'dark' : 'light'}
      ignoreSafeArea={ignoreSafeArea === 'none' ? undefined : ignoreSafeArea}
      matchContents={matchContents ? MATCH_HEIGHT_ONLY : MATCH_NEITHER}
      modifiers={DYNAMIC_TYPE_CAP}
      seedColor={theme.materialSeed}
      style={style ? [resolved, style] : resolved}
      testID={testID}
    >
      <HostBoundary>{children}</HostBoundary>
    </Host>
  )
}
