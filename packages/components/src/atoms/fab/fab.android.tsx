import {FloatingActionButton} from '@expo/ui/jetpack-compose'
import {useAppTheme} from '@hzblj/kara-theme'

import {useHostGuard} from '../../host-context'
import {Icon} from '../icon'
import type {FabComponent, FabProps} from './fab.types'

export const Fab: FabComponent = ({name, onPress}: FabProps) => {
  useHostGuard('Fab')

  const theme = useAppTheme()

  return (
    <FloatingActionButton containerColor={theme.color('fill.accent.primary')} onClick={onPress}>
      {/* `@expo/ui`'s FAB is slot-based: content outside `.Icon` is not composed at all. */}
      <FloatingActionButton.Icon>
        <Icon color="content.on.bg" name={name} />
      </FloatingActionButton.Icon>
    </FloatingActionButton>
  )
}
