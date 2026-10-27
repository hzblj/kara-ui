import {HStack} from '@expo/ui/swift-ui'
import {useSxModifiers} from '@hzblj/kara-sx'
import {useHostGuard} from '../../host-context'
import {Text} from '../text'
import type {BadgeComponent, BadgeProps} from './badge.types'
import {BADGE_TOKENS} from './badge-tokens'

export const Badge: BadgeComponent = ({label, testID, tone = 'neutral'}: BadgeProps) => {
  useHostGuard('Badge')
  const tokens = BADGE_TOKENS[tone]
  const modifiers = useSxModifiers({bg: tokens.fill, borderRadius: 'full', px: 's8', py: 's2'})

  return (
    <HStack modifiers={modifiers} testID={testID}>
      <Text color={tokens.content} variant="labelMedium">
        {label}
      </Text>
    </HStack>
  )
}
