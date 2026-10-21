import {HStack} from '../../atoms/h-stack'
import {Icon} from '../../atoms/icon'
import {Text} from '../../atoms/text'
import type {LabelComponent, LabelProps} from './label.types'

export const Label: LabelComponent = ({
  color = 'content.primary',
  icon,
  iconSize = 's20',
  testID,
  title,
  variant = 'body',
}: LabelProps) => (
  <HStack align="center" spacing="s8" testID={testID}>
    <Icon color={color} name={icon} size={iconSize} />
    <Text color={color} variant={variant}>
      {title}
    </Text>
  </HStack>
)
