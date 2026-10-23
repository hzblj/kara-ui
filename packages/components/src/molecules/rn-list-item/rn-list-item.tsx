import {accessibilityProps} from '@hzblj/kara-sx'
import {useAppTheme} from '@hzblj/kara-theme'
import {useMemo} from 'react'
import {Platform, Pressable, type PressableStateCallbackType} from 'react-native'

import {Box} from '../../atoms/box'
import {RnIcon} from '../../atoms/rn-icon'
import {RnText} from '../../atoms/rn-text'
import {RnGlyph} from '../../glyph'
import type {RnListItemComponent, RnListItemProps} from './rn-list-item.types'

export const RnListItem: RnListItemComponent = ({
  icon,
  onPress,
  px,
  subtitle,
  testID,
  title,
  ...accessibility
}: RnListItemProps) => {
  const theme = useAppTheme()
  // One element for a screen reader, as `ListItem` is: a button when it can be pressed.
  const a11y = accessibilityProps({accessible: true, ...accessibility}, onPress ? 'button' : undefined)
  const pressedColor = theme.color('fill.tertiary')

  const ripple = useMemo(() => ({color: pressedColor}), [pressedColor])
  const highlight = useMemo(
    () =>
      Platform.OS === 'ios'
        ? ({pressed}: PressableStateCallbackType) => (pressed ? {backgroundColor: pressedColor} : null)
        : undefined,
    [pressedColor]
  )

  const row = (
    <Box align="center" flexDirection="row" gap="s12" px={px} py="s12">
      {icon ? <RnIcon color="content.secondary" name={icon} size="s20" /> : null}
      <Box flex={1} gap="s2">
        <RnText variant="body">{title}</RnText>
        {subtitle ? (
          <RnText color="content.secondary" variant="footnote">
            {subtitle}
          </RnText>
        ) : null}
      </Box>
      {onPress ? <RnGlyph color="content.quaternary" name="chevronRight" size="s16" /> : null}
    </Box>
  )

  if (!onPress) {
    return (
      <Box {...a11y} testID={testID}>
        {row}
      </Box>
    )
  }

  return (
    <Pressable {...a11y} android_ripple={ripple} onPress={onPress} style={highlight} testID={testID}>
      {row}
    </Pressable>
  )
}
