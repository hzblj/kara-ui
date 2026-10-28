import {
  AnimatedVisibility,
  Box,
  Column,
  Text as ComposeText,
  EnterTransition,
  ExitTransition,
  Row,
} from '@expo/ui/jetpack-compose'
import {
  animated,
  clickable,
  defaultMinSize,
  fillMaxWidth,
  graphicsLayer,
  testID as testIdModifier,
  tween,
} from '@expo/ui/jetpack-compose/modifiers'
import {useAccessibilityModifiers} from '@hzblj/kara-sx'
import {duration, useAppTheme, useReducedMotion} from '@hzblj/kara-theme'
import {useMemo} from 'react'
import {Glyph} from '../../atoms/glyph'
import {useHostGuard} from '../../hooks/host-context'
import type {CollapsibleComponent, CollapsibleProps} from './collapsible.types'

/** Material's standard easing, at the length a chevron turning takes. */
const TURN = tween({durationMillis: duration.fast, easing: 'fastOutSlowIn'})
const SNAP = tween({durationMillis: duration.none})

/** Down from the row, fading in — Compose's default grows from a corner, sideways as well as down. */
const ENTER = EnterTransition.expandVertically().plus(EnterTransition.fadeIn())
const EXIT = ExitTransition.shrinkVertically().plus(ExitTransition.fadeOut())

/** With motion reduced (Compose follows the device's own setting, this `KaraProvider reduceMotion`): no growing. */
const FADE_IN = EnterTransition.fadeIn()
const FADE_OUT = ExitTransition.fadeOut()

const WIDE = [fillMaxWidth()]

/** Material's least touch target. */
const ROW_HEIGHT = 48

/**
 * A pressable row and an animated reveal: the content expands down from the row, and the chevron turns a quarter
 * toward it, as a Material disclosure does — it used to jump between two glyphs. The row spans its parent, the chevron
 * at the far end, and is never shorter than a touch target.
 */
export const Collapsible: CollapsibleComponent = ({
  children,
  expanded,
  label,
  onExpandedChange,
  testID,
}: CollapsibleProps) => {
  useHostGuard('Collapsible')
  const theme = useAppTheme()
  const reduced = useReducedMotion()
  const accessibilityModifiers = useAccessibilityModifiers({}, true)
  const modifiers = useMemo(
    () => [
      fillMaxWidth(),
      defaultMinSize({minHeight: ROW_HEIGHT}),
      ...(testID ? [testIdModifier(testID)] : []),
      clickable(() => onExpandedChange(!expanded)),
      ...accessibilityModifiers,
    ],
    [accessibilityModifiers, expanded, onExpandedChange, testID]
  )
  const turn = useMemo(
    () => [graphicsLayer({rotationZ: animated(expanded ? 90 : 0, reduced ? SNAP : TURN)})],
    [expanded, reduced]
  )

  return (
    <Column modifiers={WIDE}>
      <Row horizontalArrangement="spaceBetween" modifiers={modifiers} verticalAlignment="center">
        <ComposeText color={theme.colorString('content.primary')} style={theme.typography.body}>
          {label}
        </ComposeText>
        <Box modifiers={turn}>
          <Glyph name="chevronRight" size="s20" />
        </Box>
      </Row>
      <AnimatedVisibility
        enterTransition={reduced ? FADE_IN : ENTER}
        exitTransition={reduced ? FADE_OUT : EXIT}
        visible={expanded}
      >
        {children}
      </AnimatedVisibility>
    </Column>
  )
}
