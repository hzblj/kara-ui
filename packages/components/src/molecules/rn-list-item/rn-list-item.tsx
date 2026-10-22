import {useAppTheme} from '@hzblj/kara-theme'
import {useMemo} from 'react'
import {Platform, Pressable, type PressableStateCallbackType} from 'react-native'

import {Box} from '../../atoms/box'
import {RnIcon} from '../../atoms/rn-icon'
import {RnText} from '../../atoms/rn-text'
import {RnGlyph} from '../../glyph'
import type {RnListItemComponent, RnListItemProps} from './rn-list-item.types'

export const RnListItem: RnListItemComponent = ({icon, onPress, px, subtitle, testID, title}: RnListItemProps) => {
  const theme = useAppTheme()
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
    return <Box testID={testID}>{row}</Box>
  }

  return (
    <Pressable accessibilityRole="button" android_ripple={ripple} onPress={onPress} style={highlight} testID={testID}>
      {row}
    </Pressable>
  )
}
