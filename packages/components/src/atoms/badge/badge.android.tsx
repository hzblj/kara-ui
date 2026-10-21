import {Badge as ComposeBadge, Text as ComposeText} from '@expo/ui/jetpack-compose'
import {useAppTheme} from '@hzblj/kara-theme'
import {useHostGuard} from '../../host-context'
import type {BadgeComponent, BadgeProps} from './badge.types'
import {BADGE_TOKENS} from './badge-tokens'

/** Material's badge. Its content is a Compose `Text` — `@expo/ui`'s badge takes composable content, not a string. */
export const Badge: BadgeComponent = ({label, tone = 'neutral'}: BadgeProps) => {
  useHostGuard('Badge')
  const theme = useAppTheme()
  const tokens = BADGE_TOKENS[tone]

  return (
    <ComposeBadge containerColor={theme.color(tokens.fill)} contentColor={theme.color(tokens.content)}>
      <ComposeText color={theme.colorString(tokens.content)} style={theme.typography.captionMedium}>
        {label}
      </ComposeText>
    </ComposeBadge>
  )
}
