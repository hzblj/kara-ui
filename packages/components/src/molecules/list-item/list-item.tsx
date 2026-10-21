import {HStack} from '../../atoms/h-stack'
import {Icon} from '../../atoms/icon'
import {Spacer} from '../../atoms/spacer'
import {Text} from '../../atoms/text'
import {VStack} from '../../atoms/v-stack'
import {Glyph} from '../../glyph'
import type {ListItemComponent, ListItemProps} from './list-item.types'

export const ListItem: ListItemComponent = ({icon, onPress, subtitle, testID, title}: ListItemProps) => (
  <HStack align="center" onPress={onPress} py="s8" spacing="s12" testID={testID} wide>
    {icon ? <Icon color="content.secondary" name={icon} size="s20" /> : null}
    <VStack spacing="s2">
      <Text variant="body">{title}</Text>
      {subtitle ? (
        <Text color="content.secondary" variant="footnote">
          {subtitle}
        </Text>
      ) : null}
    </VStack>
    <Spacer />
    {onPress ? <Glyph color="content.quaternary" name="chevronRight" size="s16" /> : null}
  </HStack>
)
