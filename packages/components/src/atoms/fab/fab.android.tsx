import {FloatingActionButton} from '@expo/ui/jetpack-compose'
import {useAccessibilityModifiers} from '@hzblj/kara-sx'
import {useAppTheme} from '@hzblj/kara-theme'

import {useHostGuard} from '../../host-context'
import {Icon} from '../icon'
import type {FabComponent, FabProps} from './fab.types'

export const Fab: FabComponent = ({accessibilityHint, accessibilityLabel, name, onPress}: FabProps) => {
  useHostGuard('Fab')

  const theme = useAppTheme()
  const modifiers = useAccessibilityModifiers({accessibilityHint}, accessibilityHint !== undefined)

  return (
    <FloatingActionButton containerColor={theme.color('fill.accent.primary')} modifiers={modifiers} onClick={onPress}>
      {/* `@expo/ui`'s FAB is slot-based: content outside `.Icon` is not composed at all. */}
      <FloatingActionButton.Icon>
        <Icon accessibilityLabel={accessibilityLabel} color="content.on.accent" name={name} />
      </FloatingActionButton.Icon>
    </FloatingActionButton>
  )
}
