import {
  ExtendedFloatingActionButton,
  FloatingActionButton,
  LargeFloatingActionButton,
  SmallFloatingActionButton,
} from '@expo/ui/jetpack-compose'
import {testID as testIdModifier} from '@expo/ui/jetpack-compose/modifiers'
import {useAccessibilityModifiers} from '@hzblj/kara-sx'
import {type SpaceSize, useAppTheme} from '@hzblj/kara-theme'
import {useMemo} from 'react'

import {useHostGuard} from '../../host-context'
import {Icon} from '../icon'
import {Text} from '../text'
import type {FabComponent, FabProps, FabSize} from './fab.types'

/** Material's three FABs, and the icon each draws (`FloatingActionButtonDefaults.LargeIconSize` is 36dp). */
const SIZES = {
  large: {icon: 's36', Material: LargeFloatingActionButton},
  regular: {icon: 's24', Material: FloatingActionButton},
  small: {icon: 's24', Material: SmallFloatingActionButton},
} as const satisfies Record<FabSize, {Material: unknown; icon: SpaceSize}>

export const Fab: FabComponent = ({
  accessibilityHint,
  accessibilityLabel,
  label,
  name,
  onPress,
  size = 'regular',
  testID,
}: FabProps) => {
  useHostGuard('Fab')

  const theme = useAppTheme()
  const accessibilityModifiers = useAccessibilityModifiers({accessibilityHint}, accessibilityHint !== undefined)
  const modifiers = useMemo(
    () => (testID ? [testIdModifier(testID), ...accessibilityModifiers] : accessibilityModifiers),
    [accessibilityModifiers, testID]
  )
  const containerColor = theme.color('fill.accent.primary')

  /*
   * `@expo/ui`'s FABs are slot-based: content outside `.Icon` (and the extended one's `.Text`) is not composed at all.
   * The label rides on the icon, as for every FAB, and the text beside it is hidden from TalkBack so the button is not
   * read twice; a label on the FAB itself would clear the click inside it, which Material's FAB composes after our
   * modifiers.
   */
  if (label) {
    return (
      <ExtendedFloatingActionButton containerColor={containerColor} modifiers={modifiers} onClick={onPress}>
        <ExtendedFloatingActionButton.Icon>
          <Icon accessibilityLabel={accessibilityLabel} color="content.on.accent" name={name} />
        </ExtendedFloatingActionButton.Icon>
        <ExtendedFloatingActionButton.Text>
          <Text accessibilityHidden color="content.on.accent" variant="body">
            {label}
          </Text>
        </ExtendedFloatingActionButton.Text>
      </ExtendedFloatingActionButton>
    )
  }

  const {icon, Material} = SIZES[size]

  return (
    <Material containerColor={containerColor} modifiers={modifiers} onClick={onPress}>
      <Material.Icon>
        <Icon accessibilityLabel={accessibilityLabel} color="content.on.accent" name={name} size={icon} />
      </Material.Icon>
    </Material>
  )
}
