import {Linking} from 'react-native'

import {HStack} from '../../atoms/h-stack'
import {Icon} from '../../atoms/icon'
import {Text} from '../../atoms/text'
import type {LinkComponent, LinkProps} from './link.types'

export const Link: LinkComponent = ({
  color = 'content.accent',
  icon,
  label,
  testID,
  url,
  variant = 'body',
}: LinkProps) => {
  const open = () => {
    Linking.openURL(url).catch(() => undefined)
  }

  return (
    <HStack align="center" onPress={open} spacing="s8" testID={testID}>
      {icon ? <Icon color={color} name={icon} size="s20" /> : null}
      <Text color={color} variant={variant}>
        {label}
      </Text>
    </HStack>
  )
}
