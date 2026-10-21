import {Badge as ComposeBadge} from '@expo/ui/jetpack-compose'
import {useAppTheme} from '@hzblj/kara-theme'
import {useHostGuard} from '../../host-context'
import type {BadgeComponent, BadgeProps} from './badge.types'
import {BADGE_TOKENS} from './badge-tokens'

export const Badge: BadgeComponent = ({label, tone = 'neutral'}: BadgeProps) => {
  useHostGuard('Badge')
  const theme = useAppTheme()
  const tokens = BADGE_TOKENS[tone]

  return (
    <ComposeBadge containerColor={theme.color(tokens.fill)} contentColor={theme.color(tokens.content)}>
      {label}
    </ComposeBadge>
  )
}
