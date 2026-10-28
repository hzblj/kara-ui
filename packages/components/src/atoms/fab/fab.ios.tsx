import {Button} from '@expo/ui/swift-ui'
import {buttonStyle} from '@expo/ui/swift-ui/modifiers'
import {type ResponsiveSx, useAccessibilityModifiers, useSxModifiers} from '@hzblj/kara-sx'
import type {SpaceSize} from '@hzblj/kara-theme'
import {useMemo} from 'react'
import {useHostGuard} from '../../hooks/host-context'
import {HStack} from '../h-stack'
import {Icon} from '../icon'
import {Text} from '../text'
import type {FabComponent, FabProps, FabSize} from './fab.types'

/** Material's sizes, in points: the circle across and the icon in it. */
const SIZES = {
  large: {icon: 's36', side: 96},
  regular: {icon: 's24', side: 56},
  small: {icon: 's24', side: 40},
} as const satisfies Record<FabSize, {icon: SpaceSize; side: number}>

const SURFACE = {bg: 'fill.accent.primary', borderRadius: 'full', shadow: 'btn.accent'} as const satisfies ResponsiveSx

/**
 * Material's extended FAB in kara's iOS language: the regular FAB's height, accent and shadow, drawn as a capsule (the
 * shape a round button takes once it has words), 16 before the icon and 20 after the text, as Material pads it.
 */
const EXTENDED = {...SURFACE, h: SIZES.regular.side, pl: 's16', pr: 's20'} as const satisfies ResponsiveSx

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
  const extended = Boolean(label)
  const {icon, side} = SIZES[size]

  // An icon alone carries the label; beside text, the button does, in place of what the text would say.
  const accessibilityModifiers = useAccessibilityModifiers(
    extended ? {accessibilityHint, accessibilityLabel} : {accessibilityHint}
  )

  // The frame centres the icon, so one circle serves every size: `regular` is the 56pt one it always was.
  const sxModifiers = useSxModifiers(extended ? EXTENDED : {...SURFACE, h: side, w: side}, 'center')
  const modifiers = useMemo(
    () => [buttonStyle('plain'), ...sxModifiers, ...accessibilityModifiers],
    [accessibilityModifiers, sxModifiers]
  )

  return (
    <Button modifiers={modifiers} onPress={onPress} testID={testID}>
      {extended ? (
        <HStack align="center" spacing="s12">
          <Icon color="content.on.accent" name={name} />
          <Text color="content.on.accent" variant="body">
            {label}
          </Text>
        </HStack>
      ) : (
        <Icon accessibilityLabel={accessibilityLabel} color="content.on.accent" name={name} size={icon} />
      )}
    </Button>
  )
}
