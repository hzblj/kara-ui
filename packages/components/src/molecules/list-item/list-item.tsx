import {Platform} from 'react-native'

import {HStack} from '../../atoms/h-stack'
import {Icon} from '../../atoms/icon'
import {Spacer} from '../../atoms/spacer'
import {Text} from '../../atoms/text'
import {VStack} from '../../atoms/v-stack'
import {Glyph} from '../../glyph'
import type {ListItemComponent, ListItemProps} from './list-item.types'

/**
 * Compose measures a row's children in order, so a text column that fills the line leaves the chevron no room. With a
 * weight it is measured last and takes only what is left; SwiftUI shares the line by itself, with a `Spacer`.
 */
const TEXT_FILLS_ROW = {weight: 1}

export const ListItem: ListItemComponent = ({
  icon,
  onPress,
  px,
  subtitle,
  testID,
  title,
  ...accessibility
}: ListItemProps) => (
  <HStack
    accessible
    {...accessibility}
    align="center"
    onPress={onPress}
    px={px}
    py="s8"
    spacing="s12"
    testID={testID}
    wide
  >
    {icon ? <Icon color="content.secondary" name={icon} size="s20" /> : null}
    <VStack android={TEXT_FILLS_ROW} spacing="s2">
      <Text variant="body">{title}</Text>
      {subtitle ? (
        <Text color="content.secondary" variant="footnote">
          {subtitle}
        </Text>
      ) : null}
    </VStack>
    {Platform.OS === 'ios' ? <Spacer /> : null}
    {onPress ? <Glyph color="content.quaternary" name="chevronRight" size="s16" /> : null}
  </HStack>
)
